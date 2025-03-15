"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { set } from "mongoose";

export default function AllNotes() {
    const [userId, setUserId] = useState("")
    const [notes, setNotes] = useState([]);
    const [username, setUsername] = useState("");
    const params = useParams();
    const router = useRouter();

    const fetchUser = async (token: string) => {
        try {
            const response = await axios.get("/api/user/getuser", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsername(response.data.username);
            return response.data;
            // console.log(response); // Now response will be shown in console
        } catch (error) {
            console.error("Error fetching user:", error.message);
        }
    }
    const fetchNotes = async (token: string) => {
        try {
            const response = await axios.get("/api/notes/allnotes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes(response.data.allNotes);
            return response.data;
            // console.log(response); // Now response will be shown in console
        } catch (error) {
            console.error("Error fetching notes:", error.message);
        }
    };
    // setUserId(params.id); //this causes error of infinite render as it renders page on every update
    useEffect(() => {
        console.log({ "paramsId": params.id });
        if (params.id) {
            setUserId(params.id);
        }
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/"); // Redirect if no token
            return;
        }
        console.log("trial1")
        const fetchData = async (token: string) => {
            try {
                console.log("trial2")
                await fetchUser(token);
                // const userResponse = await fetchUser(token);
                // console.log(userResponse);
                try {
                    await fetchNotes(token);
                    // const notesResponse = await fetchNotes(token);
                    // console.log(notesResponse);
                } catch (error) {
                    console.error("Error fetching notes:", error.message);
                }
            } catch (error) {
                console.error("Error fetching user:", error.message);
            }
        }
        fetchData(token);
    }, [params.id]);
    return (
        <div>
            <h2>Hello, {username}</h2>
            <div>
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <div key={note._id}>
                            <div>{note.title}</div>
                            <div>{note.content}</div>
                            <div><a href={`/notes/full/${note._id}`}>See More</a></div>
                            <div>
                                <a href={`/notes/edit/${note._id}`}>edit</a>
                                <a href={`/notes/delete/${note._id}`}>delete</a>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No notes found</p>
                )}
            </div>
        </div>
    );
    
}