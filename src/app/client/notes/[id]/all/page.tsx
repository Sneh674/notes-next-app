"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import styles from "./all.module.css";
// import { set } from "mongoose";

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
    const handleLogout = async () => {
        localStorage.removeItem("token");
        router.replace("/");
    }
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
                <form action="">
                    <input type="hidden" name="username" value={username} />
                    <input type="text" name="title" id="addtitle" placeholder="enter title" />
                    <input type="hidden" name="content" id="addcont" placeholder="enter content" value="" />
                    <input type="submit" value="Add Note" className={styles.addbtn} style={{ color: 'rgb(250, 177, 81)', }} />
                </form>
            </div>
            {/* <div className={styles.notesadd}>
                <div>Add a note</div>
                <form action="/notes/add" method="post">
                    <input type="hidden" name="username" value="<%= user %>">
                    <input type="text" name="title" id="addtitle" placeholder="enter title">
                    <input type="hidden" name="content" id="addcont" placeholder="enter content" value="">
                    <input type="submit" value="Add Note" className="addbtn" style={{color: 'rgb(250, 177, 81)',}}>
                </form>
            </div> */}
            <div className={styles.notes}>
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <div className={styles.note} key={note._id}>
                            <div className={styles.ntitle}>{note.title}</div>
                            <div className={styles.ntext}>{note.content}</div>
                            <div className={styles.smlink}><a href={`/notes/full/${note._id}`}>See More</a></div>
                            <div className={styles.edel}>
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







        // <div className={styles.allnotesmain}>
        //     <div className={styles.notesmain}>
        //         <button className={styles.logoutbutton} onClick={handleLogout}>
        //             Log Out
        //         </button>
        //         <div className={styles.noteshead}>Your Notes</div>
        //         <div className={styles.notesuser}>{username}</div>
        //     </div>

        //     {/* <div className={styles.notesadd}>
        //         <div>Add a note</div>
        //         <form action="/notes/add" method="post">
        //             <input type="hidden" name="username" value={username} />
        //             <input
        //                 type="text"
        //                 name="title"
        //                 id="addtitle"
        //                 placeholder="Enter title"
        //                 value={title}
        //                 onChange={handleTitleChange}
        //             />
        //             <input
        //                 type="hidden"
        //                 name="content"
        //                 id="addcont"
        //                 value={content}
        //                 onChange={handleContentChange}
        //             />
        //             <input
        //                 type="submit"
        //                 value="Add Note"
        //                 className={styles.addbtn}
        //                 style={{ color: "rgb(250, 177, 81)" }}
        //             />
        //         </form>
        //     </div> */}

        //     <div className={styles.notes}>
        //         {notes.length > 0 ? (
        //             notes.map((note) => (
        //                 <div className={styles.note} key={note._id}>
        //                     <div className={styles.ntitle}>{note.title}</div>
        //                     <div className={styles.ntext}>{note.content}</div>
        //                     <div className={styles.smlink}>
        //                         <a href={`/notes/full/${note._id}`}>See More</a>
        //                     </div>
        //                     <div className={styles.edel}>
        //                         <a href={`/notes/edit/${note._id}`}>Edit</a>
        //                         <a href={`/notes/delete/${note._id}`}>Delete</a>
        //                     </div>
        //                 </div>
        //             ))
        //         ) : (
        //             <p>No notes found</p>
        //         )}
        //     </div>
        // </div>
    );

}