"use client";

import { useState, useEffect, } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useNote } from "@/app/context/NoteContext";
import Link from "next/link";

export default function SeeMore() {
    const params = useParams();
    const router = useRouter();

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
                // setNote(response.data.note);
            } catch (error) {
                console.error("An error occurred while fetching the note:", error);
            }
        };
        fetchNote();
    }, [router, params]);
    return (
        <div>
            <Link href={`all`}>Go Back</Link>
            <h1>Seemore</h1>
        </div>
    )
}