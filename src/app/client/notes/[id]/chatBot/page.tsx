"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./chatbot.module.css";

export default function ChatBot() {
  const router = useRouter();

  const [input, setInput] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [botMessages, setBotMessages] = useState([]);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages, botMessages]);

  const handleSend = () => {
    if (!input.trim()) return;

    setUserMessages((prev) => [...prev, input]);

    const reply = `Bot reply to: ${input}`;
    setBotMessages((prev) => [...prev, reply]);

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);

    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <div className={styles.chatPage}>
      {/* FIXED BACK BUTTON */}
      <button className={styles.backButton} onClick={() => router.back()}>
        Back
      </button>

      <div className={styles.chatContainer}>
        <div className={styles.chatHistory}>
          {userMessages.map((msg, index) => (
            <div key={index} className={styles.messageWrapper}>
              <div className={styles.userMessage}>{msg}</div>
              {botMessages[index] && (
                <div className={styles.botMessage}>{botMessages[index]}</div>
              )}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
      </div>

      <div className={styles.inputOuter}>
        <div className={styles.inputContainer}>
          <textarea
            ref={textareaRef}
            placeholder="Type your message..."
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={styles.chatInput}
            rows={1}
          />
          <button onClick={handleSend} className={styles.sendButton}>
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}
