import { verifyToken } from "@/helpers/jwt";
import { NextRequest, NextResponse } from "next/server";
import NoteModel from "@/models/notesModel";
import { connect, disconnect } from "@/dbConfig/dbConfig";

