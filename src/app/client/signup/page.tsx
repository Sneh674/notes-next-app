"use client";

import { useState } from "react";
import styles from "./create.module.css"; // Import CSS module
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUp: React.FC = () => {
    const router = useRouter();
    const [details, setDetails] = useState({
        uname: "",
        uemail: "",
        upassword: "",
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

    return (
        <div className={styles.bodyCreateUser}>
            <div>
                <Link href="/" className={styles.toLoginLink}>
                    Go to LogIn Page
                </Link>
            </div>
            <div className={styles.crt}>Create User</div>
            <div>
                <form onSubmit={handleSubmit} className={styles.createUserForm}>
                    <input type="text" name="uname" placeholder="Enter name" onChange={handleChange} required className={styles.createUserFormInput} />
                    <input type="email" name="uemail" placeholder="Enter email" onChange={handleChange} required className={styles.createUserFormInput} />
                    <input type="password" name="upassword" placeholder="Enter password" onChange={handleChange} required className={styles.createUserFormInput} />
                    <input type="submit" value="Create User" className={styles.crtbtn} />
                </form>
            </div>
            <div className={styles.errormsg}>{errorMsg}</div>
        </div>
    );
};

export default SignUp;
