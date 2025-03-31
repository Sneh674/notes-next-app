"use client";

import { useState } from "react";
import styles from "./create.module.css"; // Import CSS module
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { set } from "mongoose";

const SignUp: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [mailSent, setMailSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [details, setDetails] = useState({
        uname: "",
        uemail: "",
        upassword: "",
        otp: "",
    });
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/user/signup", details);
            console.log(res);
            localStorage.setItem("token", res.data.token);
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
    };

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
            const res = await axios.post("/api/user/sendOtp", { uemail: details.uemail, forgotPassword: false });
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
            if(verifying) return;
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
            } else {
                setErrorMsg("An unexpected error occurred");
            }
            console.log("Error:", error);
        }
    }

    return (
        <div className={styles.bodyCreateUser}>
            <div>
                <Link href="/" className={styles.toLoginLink}>
                    Go to LogIn Page
                </Link>
            </div>
            <div className={styles.crt}>Create User</div>
            <div>
                {(!mailSent && !verified) && (
                    <form onSubmit={handleEmailSend} className={styles.createUserForm}>
                        <input type="email" name="uemail" placeholder="Enter email" onChange={handleChange} required className={styles.createUserFormInput} />
                        {/* <input type="hidden" name="forgotPassword" value="false"/> */}
                        <input type="submit" value="Send OTP" className={styles.crtbtn} />
                    </form>
                )}
                {(mailSent && !verified) && (
                    <div className="verifyOtp">
                        <form onSubmit={handleOtpVerify} className={styles.createUserForm}>
                            {/* <input type="email" name="uemail" placeholder="Enter email" onChange={handleChange} required className={styles.createUserFormInput} /> */}
                            <input type="hidden" name="email" value={email} />
                            <input type="text" name="otp" required className={styles.createUserFormInput} onChange={handleChange} />
                            {verifying ? "Verifying..." : (<input type="submit" value="Verify OTP" className={styles.crtbtn} />)}
                        </form>
                        <button onClick={retryVerification} className={styles.crtbtn} >Retry Verification</button>
                    </div>
                )}
                {(verified && mailSent) && (
                    <form onSubmit={handleSubmit} className={styles.createUserForm}>
                        <input type="text" name="uname" placeholder="Enter name" onChange={handleChange} required className={styles.createUserFormInput} />
                        {/* <input type="email" name="uemail" placeholder="Enter email" onChange={handleChange} required className={styles.createUserFormInput} /> */}
                        <input type="hidden" name="uemail" value={email} />
                        <input type="password" name="upassword" placeholder="Enter password" onChange={handleChange} required className={styles.createUserFormInput} />
                        {/* <input type={()} /> */}
                        <input type="submit" value="Create User" className={styles.crtbtn} />
                    </form>
                )}
            </div>
            <div className={styles.errormsg}>{errorMsg}</div>
        </div>
    );
};

export default SignUp;
