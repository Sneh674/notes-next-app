"use client";

import { useState, useEffect, } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import styles from "./edit.module.css";

export default function Edit() {
    const params = useParams();
    const router = useRouter();
    const [note, setNote] = useState({ title: "", content: "" });

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
    }, []);

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/");
            return;
        }
        console.log("Note to edit:", note);
        const noteId = localStorage.getItem("noteId");
        try {
            const response = await axios.put(`/api/notes/editnote/${noteId}`, note, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Note edited:", response.data);
            localStorage.removeItem("noteId");
            router.replace("all");
        } catch (error) {
            console.error("An error occurred while editing the note:", error);
        }
    }

    return (
        <div className={styles.editmain}>
            <button onClick={(e) => { e.preventDefault(); localStorage.removeItem("noteId"); router.replace("all") }} className={styles.linkToNotes}>Go Back</button>
            <form onSubmit={handleEditSubmit} className={styles.editForm}>
                <label htmlFor="title">Title:</label>
                <textarea value={note.title} onChange={(e) => setNote((prevNote) => ({ ...prevNote, title: e.target.value }))} name="title"/>
                <label htmlFor="content">Content:</label>
                <textarea value={note.content} rows={22} onChange={(e) => setNote((prevNote) => ({ ...prevNote, content: e.target.value }))} name="content"/>
                <input type="submit" value="Edit Note" className={styles.editSubmit}/>
            </form>
        </div>
    )
}