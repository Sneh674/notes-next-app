"use client";

import { useState } from "react";
import "./create.css"
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUp: React.FC = () => {
    const router = useRouter();
    const [details, setDetails] = useState({
        uname: "",
        uemail: "",
        upassword: "",
    })
    const [errorMsg, setErrorMsg] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // console.log(details)
        try {
            const res = await axios.post("/api/user/signup", details);
            console.log(res);
            setErrorMsg("")
            router.push("/");
        } catch (error: any) {
            if (error.response) {
                // Extract error message from server response
                setErrorMsg(error.response.data.error || "Login failed");
            } else {
                setErrorMsg("An unexpected error occurred");
            }
            console.log("Error:", error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    // React.FC (or React.FunctionComponent) is a TypeScript type that provides type safety for functional components in React
    return (
        <div>
            <div><Link href="/">Go to LogIn Page</Link></div>
            <div className="crt">Create User</div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="uname" placeholder="Enter name" onChange={handleChange} required />
                    <input type="email" name="uemail" placeholder="Enter email" onChange={handleChange} required />
                    <input type="password" name="upassword" placeholder="Enter password" onChange={handleChange} required />
                    <input type="submit" value="Create User" id="crtbtn" />
                </form>
            </div>
            <div className="errormsg">{errorMsg}</div>
        </div>
    );
}

export default SignUp;
