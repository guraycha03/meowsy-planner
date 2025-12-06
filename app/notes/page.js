"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { Plus } from "lucide-react";

export default function NotesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "notes");
    const q = query(ref, orderBy("updatedAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(list);
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* Add Note */}
      <button
        onClick={() => {
          const id = crypto.randomUUID();
          router.push(`/edit-note?id=${id}&new=true`);
        }}
        className="fixed bottom-24 right-6 z-[200] bg-[var(--color-accent)] text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
      >
        <Plus className="w-6 h-6" />
      </button>

      <h1 className="text-3xl font-bold mb-6">My Notes</h1>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 && (
          <p className="text-gray-500 text-center mt-20">
            You have no notes yet. Tap the + button to create one.
          </p>
        )}

        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => router.push(`/edit-note?id=${note.id}`)}
            className="p-4 bg-white rounded-xl border shadow-sm hover:shadow-md cursor-pointer transition"
          >
            <h2 className="font-bold text-xl">{note.title || "(Untitled)"}</h2>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {note.content || "No content..."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
