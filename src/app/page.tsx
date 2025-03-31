"use client";

import { useEffect, useState } from "react";
import styles from "./home.module.css"
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [details, setDetails] = useState({
    lemail: "",
    lpassword: "",
  })
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setErrorMsg("")
      // console.log(details);

      const response = await axios.post("/api/user/login", details, {
        headers: { "Content-Type": "application/json" }
      });
      console.log(response);
      localStorage.setItem("token", response.data.token);
      setErrorMsg("")
      router.push(`client/notes/${response.data.user._id}/all`)

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Extract error message from server response
        setErrorMsg(error.response.data.error || "Login failed");
      } else {
        setErrorMsg("An unexpected error occurred");
      }
      console.log("Error:", error);
    }
  }

  const verifyToken = async (token: string) => {
    try {
      const response = await axios.get("/api/jwt/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User:", response.data);
      console.log(response.data.user.id);
      router.push(`client/notes/${response.data.user.id}/all`)
      return response.data;
    } catch (error) {
      console.error("Error verifying token:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if(token){
      verifyToken(token)
      // router.push(`client/notes/${user.id}/all`)
    }
    // const user = token ? verifyToken(token) : null;
    // console.log(user);
    // if (token) {
    //   router.push("/client/notes");
    // }
  }, [])
  return (
    <div className={styles.homemain}>
      <h2 className={styles.h2}>Welcome to your Notes</h2>
      <div className={styles.div}>
        <h1 className={styles.h1}>Already a user:</h1>
        <form onSubmit={handleLogin} className={styles.logInForm}>
          <input type="text" name="lemail" required placeholder="Enter email" onChange={(e) => setDetails((prev) => ({ ...prev, lemail: e.target.value }))} />
          <input type="password" name="lpassword" required placeholder="Enter password" onChange={(e) => setDetails((prev) => ({ ...prev, lpassword: e.target.value }))} />
          <input type="submit" value="Log User" id="cubtn" className={styles.cubtn} />
          <div className={styles.errormsg}>{errorMsg}</div>
        </form>
        <Link href="/client/forgot" className={styles.forgotLink}>Forgot password</Link>

        <h1>New user:</h1>
        <Link href="/client/signup" className={styles.signUpLink}>Sign Up</Link>
      </div>
    </div>
  );
}
