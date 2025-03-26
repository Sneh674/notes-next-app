"use client";

import { createContext, useState, useContext } from "react";

interface NoteContextType {
  noteId: string;
  setNoteId: React.Dispatch<React.SetStateAction<string>>;
}

const NoteContext = createContext<NoteContextType | null>(null);

import { ReactNode } from "react";

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [noteId, setNoteId] = useState("");

  return (
    <NoteContext.Provider value={{ noteId, setNoteId }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = () => useContext(NoteContext);
