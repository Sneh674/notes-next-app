"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function AllNotes() {
    const [userId, setUserId] = useState("")
    const params = useParams();
    const router = useRouter();

    const fetchNotes = async (token: string) => {
        try {
            const response = await axios.get("/api/notes/allnotes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("trial2");
            console.log(response); // Now response will be shown in console
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
        try {
            fetchNotes(token);
        } catch (error) {
            console.error("Error fetching notes:", error.message);
        }
    }, [params.id]);
    return (
        <div>hello, {userId}</div>
        //     <>
        //     <div class="notesmain">
        //     <a href="/logout" class="loglink">Log Out</a>
        //     <div class="noteshead">Your Notes</div>
        //     <div class="notesuser">
        //         {/* <%= user %> */}
        //     </div>
        // </div>
        // <div class="notesadd">
        //     <div>Add a note</div>
        //     <form action="/notes/add" method="post">
        //         <input type="hidden" name="username" value="<%= user %>">
        //         <input type="text" name="title" id="addtitle" placeholder="enter title">
        //         <input type="hidden" name="content" id="addcont" placeholder="enter content" value="">
        //         {/* <!-- <textarea name="content" id="addcont" rows="5" placeholder="enter content"></textarea> --> */}
        //         <input type="submit" value="Add Note" class="addbtn" style="color: rgb(250, 177, 81);">
        //     </form>
        // </div>
        // <div class="notes">
        //     {/* <% allnotes.forEach((note)=>{ %>
        //         <div class="note">
        //             <div class="ntitle"><%= note.title %></div>
        //             <div class="ntext"><%= note.content %></div>
        //             <div class="smlink"><a href="/notes/full/<%= note._id %>">See More</a></div>
        //             <div class="edel">
        //                 <a href="/notes/edit/<%= note._id %>" style="color: rgb(136, 136, 244); font-weight: bold;">edit</a>
        //                 <a href="/notes/delete/<%= note._id %>" style="color: rgb(105, 105, 255); font-weight: bold;">delete</a>
        //             </div>
        //         </div>
        //     <% }) %> */}
        // </div>
        //     </>
    )
}