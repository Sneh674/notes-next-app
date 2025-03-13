"use client";

import { useState } from "react";
import "./create.css"
import axios from "axios";
import { redirect } from 'next/navigation'

const SignUp: React.FC = () => {
    const [details, setDetails] = useState({
        uname: "",
        uemail: "",
        upassword: "",
    })
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(details)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    // React.FC (or React.FunctionComponent) is a TypeScript type that provides type safety for functional components in React
    return (
        <div>
            <div><a href="/">Go to LogIn Page</a></div>
            <div className="crt">Create User</div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="uname" placeholder="Enter name" onChange={handleChange} required/>
                    <input type="email" name="uemail" placeholder="Enter email" onChange={handleChange} required/>
                    <input type="password" name="upassword" placeholder="Enter password" onChange={handleChange} required/>
                    <input type="submit" value="Create User" id="crtbtn" />
                </form>
            </div>
        </div>
    );
}

export default SignUp;
