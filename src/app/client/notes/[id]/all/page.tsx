"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import styles from "./all.module.css";
// import { useNote } from "@/app/context/NoteContext";
// import { set } from "mongoose";

export default function AllNotes() {
    interface Note {
        _id: string;
        title: string;
        content: string;
        email: string;
        name: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    }

    const [userId, setUserId] = useState("")
    const [notes, setNotes] = useState<Note[]>([]);
    const [useremail, setUseremail] = useState("");
    const [username, setUsername] = useState("");
    const params = useParams();
    const router = useRouter();
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState("");

    // const [noteId, setNoteId] = useState("");
    // const noteContext = useNote();
    // if (!noteContext) {
    //     throw new Error("useNote must be used within a NoteProvider");
    // }
    // const { setNoteId } = noteContext;

    const handleDeleteClick = (deleteId: string) => {
        setDeleteModal(true);
        setDeleteId(deleteId);
    }
    const handleEditClick = (id: string) => {
        // setNoteId(id); // Set the selected noteId in context
        localStorage.setItem("noteId", id);
        console.log("Note ID set:", id);
        router.push(`editnote`);
    };
    const handleSeeMoreClick = (id: string) => () => {
        // setNoteId(id); // Set the selected noteId in context
        localStorage.setItem("noteId", id);
        console.log("Note ID set:", id);
        router.push(`seemore`);
    };
    const fetchUser = async (token: string) => {
        try {
            const response = await axios.get("/api/user/getuser", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsername(response.data.username);
            setUseremail(response.data.email);
            console.log(response.data);
            return null; // Explicitly return null instead of `return;`
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error fetching user:", error.message);
            } else {
                console.error("Error fetching user:", error);
            }
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
            // console.log(response.data.allNotes);
            return null; // Explicitly return null instead of `return;`
            // console.log(response); // Now response will be shown in console
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error fetching notes:", error.message);
            } else {
                console.error("Error fetching notes:", error);
            }
        }
    };
    const handleLogout = async () => {
        localStorage.removeItem("token");
        router.replace("/");
    }
    const handleAddNote = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/");
            return;
        }

        const form = event.currentTarget;
        const title = (form.elements.namedItem("title") as HTMLInputElement)?.value || "";

        try {
            const response = await axios.post(
                "/api/notes/addnote",
                {
                    username,
                    useremail,
                    title,
                    content: "",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);
            form.reset();
            fetchNotes(token);
        } catch (error) {
            console.error("Error adding note:", (error as Error).message);
        }
    };

    const handleDeleteNote = async () => {
        try {
            setNotes([]);
            setDeleteModal(false);
            const token = localStorage.getItem("token");
            if (!token) {
                router.replace("/");
                return;
            }
            const response = await axios.delete(`/api/notes/delete/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log(response);
            fetchNotes(token);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error deleting note:", error.message);
            } else {
                console.error("Error deleting note:", error);
            }
        }
    }
    // setUserId(params.id); //this causes error of infinite render as it renders page on every update
    useEffect(() => {
        console.log({ paramsId: params.id });

        if (params.id && params.id !== userId) {
            setUserId(params.id as string);
        }

        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/"); // Redirect if no token
            return;
        }

        const fetchData = async (token: string) => {
            try {
                console.log("trial2");
                await fetchUser(token);

                try {
                    await fetchNotes(token);
                } catch (error) {
                    console.error("Error fetching notes:", (error as Error).message);
                }
            } catch (error) {
                console.error("Error fetching user:", (error as Error).message);
            }
        };

        fetchData(token);
    }, [params.id, router, userId]);


    return (
        <div className={styles.allnotesmain}>
            <div className={styles.notesmain}>
                <button className={styles.logoutbutton} onClick={handleLogout}>Log Out</button>
                {/* <a href="/logout" class={styles.loglink}>Log Out</a> */}
                <div className={styles.noteshead}>Your Notes</div>
                <div className={styles.notesuser}>{username}</div>
            </div>
            {/* <h2>Hello, {username}</h2> */}
            <div className={styles.notesadd}>
                <div>Add a note</div>
                <form onSubmit={handleAddNote}>
                    {/* <input type="hidden" name="username" value={username} /> */}
                    {/* <input type="hidden" name="useremail" value={useremail} /> */}
                    <input type="text" name="title" id="addtitle" placeholder="enter title" />
                    {/* <input type="hidden" name="content" id="addcont" placeholder="enter content" value="" /> */}
                    <input type="submit" value="Add Note" className={styles.addbtn} style={{ color: 'rgb(250, 177, 81)', }} />
                </form>
            </div>
            <div className={styles.notesouterdiv}>
                <div className={styles.notes}>
                    {notes.length > 0 ? (
                        notes.map((note) => (
                            <div className={styles.note} key={note._id as string}>
                                <div className={styles.ntitle}>{note.title}</div>
                                <div className={styles.ntext}>{note.content}</div>
                                {/* <div className={styles.smlink}><a href={`/notes/full/${note._id}`}>See More</a></div> */}
                                <button className={styles.smlink} onClick={handleSeeMoreClick(note._id)}>See More</button>
                                <div className={styles.edel}>
                                    {/* <a href={`/notes/edit/${note._id}`}>edit</a> */}
                                    <button onClick={() => handleEditClick(note._id)}>edit</button>
                                    <button onClick={() => handleDeleteClick(note._id)}>delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No notes found</p>
                    )}
                </div>
            </div>
            {deleteModal && (
                <div className={styles.modal} >
                    <div className={styles.modalcontent}>
                        <div>Are you sure you want to delete this note?</div>
                        <div className={styles.modalbuttons}>
                            <button onClick={() => setDeleteModal(false)}>Cancel</button>
                            <button onClick={() => handleDeleteNote()}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );

}