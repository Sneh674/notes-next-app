"use client";

import { useState, useEffect, } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function seeMore(){
    const router = useRouter();
    const { id } = useParams();
    const [note, setNote] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axios.get(`/api/notes/shownote/${id}`);
                setNote(response.data.note);
            } catch (error) {
                console.error("An error occurred while fetching the note:", error);
            }
        };
        fetchNote();
    }, [id]);
    return (
        <div>
            <h1>Seemore</h1>
        </div>
    )
}