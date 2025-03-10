"use client";

import { useState } from "react";
import "./home.css"
import axios from "axios";
// import { useRouter } from "next/router";

export default function Home() {
  // const router=useRouter();
  const [details, setDetails] = useState({
    lname: "",
    lpassword: "",
  })
  const [errorMsg, setErrorMsg] = useState()

  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      console.log(details);

      const response = await axios.post("/api/user/login", details, {
        headers: { "Content-Type": "application/json" }
      });
      console.log(response);
      setErrorMsg("")

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
      <h2>Welcome to our website</h2>
      <div>
        <h1>Already a user:</h1>
        <form onSubmit={handleLogin}>
          <input type="text" name="lname" required placeholder="Enter name" onChange={(e) => setDetails((prev) => ({ ...prev, lname: e.target.value }))} />
          <input type="password" name="lpassword" required placeholder="Enter password" onChange={(e) => setDetails((prev) => ({ ...prev, lpassword: e.target.value }))} />
          <input type="submit" value="Log User" id="cubtn" />
          <div>{errorMsg}</div>
        </form>
        <h1>New user:</h1>
        <a href="/createuser">Sign Up</a>
      </div>
    </>
  );
}
