"use client";

import { useState, useEffect, } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
// import { useNote } from "@/app/context/NoteContext";
import styles from "./seemore.module.css";

export default function SeeMore() {
    const params = useParams();
    const router = useRouter();
    const [note, setNote] = useState({ title: "", content: "" });

    // const noteContext = useNote();
    // if (!noteContext) {
    //     throw new Error("useNote must be used within a NoteProvider");
    // }
    // const { noteId, setNoteId } = noteContext;

    useEffect(() => {
        console.log("Params:", params);
        if (!params.id || params.id === "" || params.id === "undefined") {
            router.replace("/");
        }
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/");
            return;
        }
        const noteId = localStorage.getItem("noteId");
        const fetchNote = async () => {
            console.log("Fetching note:", noteId);
            try {
                const response = await axios.get(`/api/notes/shownote/${noteId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Note fetched:", response.data);
                // setNote(response.data);
                setNote((prevNote) => ({ ...prevNote, title: response.data.note.title, content: response.data.note.content }));
                console.log("Note set:", note);
                // setNote(response.data.note);
            } catch (error) {
                console.error("An error occurred while fetching the note:", error);
            }
        };
        fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);//router, params, note, noteId
    return (
        <div className={styles.fullmain}>
            {/* <Link href={`all`} onClick={(e) => { e.preventDefault();setNoteId(""); }} className={styles.linkToNotes}>Go Back</Link> */}
            <button onClick={(e) => { e.preventDefault(); localStorage.removeItem("noteId"); router.replace("all")}} className={styles.linkToNotes}>Go Back</button>
            <div className={styles.fullcont}>
                <div className={styles.fulltitle}>{note.title || "Title"}</div>
                {/* <% let formatted=ftext.replace(/\n/g, '<br>') %></br> */}
                {/* <div className={styles.fulltext}>{note.content.replace(/\n/g,'<br>') || "Text"}</div> */}
                <div className={styles.fulltext}
                    dangerouslySetInnerHTML={{ __html: note.content.replace(/\n/g, '<br>') || "Text"}}>
                </div>
            </div>
        </div>
    )
}