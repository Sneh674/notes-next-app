"use client";

import { useState } from "react";
import styles from "./home.module.css"
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router=useRouter();
  const [details, setDetails] = useState({
    lemail: "",
    lpassword: "",
  })
  const [errorMsg, setErrorMsg] = useState()

  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setErrorMsg("")
      // console.log(details);

      const response = await axios.post("/api/user/login", details, {
        headers: { "Content-Type": "application/json" }
      });
      console.log(response);
      setErrorMsg("")
      router.push("client/notes/all")

    } catch (error) {
      if (error.response) {
        // Extract error message from server response
        setErrorMsg(error.response.data.error || "Login failed");
      } else {
        setErrorMsg("An unexpected error occurred");
      }
      console.log("Error:", error);
    }
  }
  return (
    <>
      <h2 className={styles.h2}>Welcome to our website</h2>
      <div className={styles.div}>
        <h1 className={styles.h1}>Already a user:</h1>
        <form onSubmit={handleLogin} className={styles.logInForm}>
          <input type="text" name="lemail" required placeholder="Enter email" onChange={(e) => setDetails((prev) => ({ ...prev, lemail: e.target.value }))} />
          <input type="password" name="lpassword" required placeholder="Enter password" onChange={(e) => setDetails((prev) => ({ ...prev, lpassword: e.target.value }))} />
          <input type="submit" value="Log User" id="cubtn" className={styles.cubtn}/>
          <div className={styles.errormsg}>{errorMsg}</div>
        </form>
        <h1>New user:</h1>
        <Link href="/client/signup" className={styles.signUpLink}>Sign Up</Link>
      </div>
    </>
  );
}
