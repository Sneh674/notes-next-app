"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./chatbot.module.css";

type Role = "user" | "assistant";

interface Message {
  role: Role;
  text: string;
}

export default function ChatBot() {
  const router = useRouter();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // 🔥 Replace this with real API call later
    await new Promise((res) => setTimeout(res, 700));

    const botMessage: Message = {
      role: "assistant",
      text: `Bot reply to: ${userMessage.text}`,
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  };

  return (
    <div className={styles.chatPage}>
      {/* Back Button */}
      <button className={styles.backButton} onClick={() => router.back()}>
        Back
      </button>

      <div className={styles.chatContainer}>
        <div className={styles.chatHistory}>
          {messages.map((msg, index) => (
            <div key={index} className={styles.messageWrapper}>
              <div
                className={
                  msg.role === "user" ? styles.userMessage : styles.botMessage
                }
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className={styles.messageWrapper}>
              <div className={styles.botMessage}>
                <span className={styles.typingDot}></span>
                <span className={styles.typingDot}></span>
                <span className={styles.typingDot}></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>
      </div>

      {/* Input */}
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
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className={styles.sendButton}
            disabled={isLoading}
          >
            {isLoading ? "..." : "Enter"}
          </button>
        </div>
      </div>
    </div>
  );
}
