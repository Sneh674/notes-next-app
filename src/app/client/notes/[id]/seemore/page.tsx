"use client";

import { useState, useEffect, } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useNote } from "@/app/context/NoteContext";
import Link from "next/link";
import styles from "./seemore.module.css";
import { set } from "mongoose";
// import styles from "@/app/client/notes/[id]/seemore/seemore.module.css";

export default function SeeMore() {
    const params = useParams();
    const router = useRouter();
    const [note, setNote] = useState({title:"", content:""});

    const noteContext = useNote();
    if (!noteContext) {
        throw new Error("useNote must be used within a NoteProvider");
    }
    const { noteId, setNoteId } = noteContext;

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
        const fetchNote = async () => {
            try {
                const response = await axios.get(`/api/notes/shownote/${noteId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Note fetched:", response.data);
                // setNote(response.data);
                setNote((prevNote)=>({...prevNote, title: response.data.note.title, content: response.data.note.content}));
                console.log("Note set:", note);
                // setNote(response.data.note);
            } catch (error) {
                console.error("An error occurred while fetching the note:", error);
            }
        };
        fetchNote();
    }, [router, params, note, noteId]);
    return (
        <div className={styles.fullmain}>
            <Link href={`all`} onClick={()=>{setNoteId("")}} className={styles.linkToNotes}>Go Back</Link>
            <div className={styles.fullcont}>
                <div className={styles.fulltitle}>{note.title  || "Title"}</div>
                <div className={styles.fulltext}>{note.content || "Text"}</div>
            </div>
        </div>
    )
}