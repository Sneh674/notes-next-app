"use client";

import { useState } from "react";
import styles from "./forgot.module.css"
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Forgot() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [mailSent, setMailSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [details, setDetails] = useState({
        uemail: "",
        upassword: "",
        otp: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const retryVerification = () => {
        setMailSent(false);
        setVerified(false);
        setErrorMsg("");
        setEmail("");
    }

    const handleEmailSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setEmail(details.uemail);
        try {
            setVerifying(false);
            setMailSent(true);
            const res = await axios.post("/api/user/sendOtp", { uemail: details.uemail, forgotPassword: true });
            console.log(res);
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "response" in error) {
                const errObj = error as { response: { data?: { error?: string } } };
                setErrorMsg(errObj.response.data?.error || "Error sending OTP");
            } else {
                setErrorMsg("An unexpected error occurred");
            }
            console.log("Error:", error);
        }
    }
    const handleOtpVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            if (verifying) return;
            if (!details.otp) {
                setErrorMsg("OTP is required");
                return;
            }
            setVerifying(true);
            const res = await axios.post("/api/user/verifyOtp", { email: details.uemail, otp: details.otp });
            console.log(res);
            setVerified(true);
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "response" in error) {
                const errObj = error as { response: { data?: { error?: string } } };
                setErrorMsg(errObj.response.data?.error || "Error verifying OTP");
                setVerifying(false)
            } else {
                setErrorMsg("An unexpected error occurred");
            }
            console.log("Error:", error);
        }
    }
    const handleSubmit = async(e: React.FormEvent)=>{
        e.preventDefault();
        try{
            const res = await axios.post("/api/user/updatePassword", details);
            console.log(res);
            // localStorage.setItem("token", res.data.token);
            setErrorMsg("");
            router.push("/");
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "response" in error) {
                const errObj = error as { response: { data?: { error?: string } } };
                setErrorMsg(errObj.response.data?.error || "Login failed");
            } else {
                setErrorMsg("An unexpected error occurred");
            }
            console.log("Error:", error);
        }
    }
    return (
        <div className={styles.forgotMain}>
            <Link href="/" className={styles.toLoginLink}>
                Go to LogIn Page
            </Link>
            {(!mailSent && !verified) && (
                <form onSubmit={handleEmailSend} className={styles.createUserForm}>
                    <input type="uemail" name="uemail" id="" placeholder="Enter Email" className={styles.createUserFormInput} required onChange={handleChange}/>
                    {/* <input type="hidden" name="forgotPassword" value="true"/> */}
                    <input type="submit" value="Send OTP" className={styles.crtbtn} />
                </form>
            )}
            {(mailSent && !verified) && (
                <div className={styles.verifyOtp}>
                    <form onSubmit={handleOtpVerify} className={styles.createUserForm}>
                        {/* <input type="email" name="uemail" placeholder="Enter email" onChange={handleChange} required className={styles.createUserFormInput} /> */}
                        <input type="hidden" name="uemail" value={email} />
                        <input type="text" name="otp" required className={styles.createUserFormInput} onChange={handleChange} />
                        {verifying ? "Verifying..." : (<input type="submit" value="Verify OTP" className={styles.crtbtn} />)}
                    </form>
                    <button onClick={retryVerification} className={styles.crtbtn} >Retry Verification</button>
                </div>
            )}
            {(mailSent && verified) && (
                <form onSubmit={handleSubmit} className={styles.createUserForm}>
                    <input type="password" name="upassword" id="" className={styles.createUserFormInput} placeholder="Enter new password" onChange={handleChange} />
                    <input type="submit" value="Submit" className={styles.crtbtn} />
                </form>
            )}
            <div className={styles.errormsg}>{errorMsg}</div>
        </div>
    )
}