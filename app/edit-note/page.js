"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { doc, setDoc, deleteDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import NoticePopup from "../../components/NoticePopup";

export default function EditNotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get("id");
  const isNew = searchParams.get("new") === "true";

  const { user } = useAuth();
  const [note, setNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Load note
  useEffect(() => {
    if (!noteId) {
      router.replace("/notes");
      return;
    }
    if (!user) return;
    if (isNew) {
      setLoading(false);
      return;
    }

    const ref = doc(db, "users", user.uid, "notes", noteId);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setNote(snap.data());
        } else {
          router.replace("/notes");
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setNotice({ type: "error", message: "Failed to load note." });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, noteId, isNew, router]);

  if (!user || loading)
    return (
      <div className="p-6 text-center text-xl text-[var(--color-accent)] font-semibold">
        Loading Note...
      </div>
    );

  // Save note
  const saveNote = async () => {
    if (!user || !noteId || saving) return;
    if (!note.title.trim() && !note.content.trim()) {
      setNotice({ type: "warning", message: "Note is empty. Add title or content." });
      return;
    }

    setSaving(true);

    const ref = doc(db, "users", user.uid, "notes", noteId);
    const dataToSave = {
      title: note.title,
      content: note.content,
      updatedAt: serverTimestamp(),
      ...(isNew && { createdAt: serverTimestamp() }),
    };

    try {
      setDoc(ref, dataToSave, { merge: true }).catch((err) => console.error(err));
      setNotice({ type: "success", message: "Note Saved! 🎉" });
      setTimeout(() => router.push("/notes"), 500);
    } catch (err) {
      console.error(err);
      setNotice({ type: "error", message: "Failed to save note." });
    } finally {
      setSaving(false);
    }
  };

  // Delete note
  const handleDeleteClick = () => {
    if (isNew) {
      router.replace("/notes");
    } else {
      setConfirmDelete(true);
    }
  };

  const confirmDeleteNote = async () => {
    try {
      const ref = doc(db, "users", user.uid, "notes", noteId);
      await deleteDoc(ref);
      setNotice({ type: "success", message: "Note deleted successfully." });
      setTimeout(() => router.push("/notes"), 500);
    } catch (err) {
      console.error(err);
      setNotice({ type: "error", message: "Failed to delete note." });
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full px-4 py-8 bg-[var(--color-background)]">
      {/* Buttons */}
      <div className="w-full max-w-[1200px] flex items-center justify-between mb-6">
        <button
          onClick={isNew ? handleDeleteClick : () => router.replace("/notes")}
          className="p-3 rounded-xl bg-white border shadow-md hover:scale-[1.05] transition"
        >
          <ArrowLeft className="w-6 h-6 opacity-70" />
        </button>

        <div className="flex gap-3 items-center">
          {!isNew && (
            <button
              onClick={handleDeleteClick}
              className="p-3 rounded-xl bg-red-100 border border-red-300 shadow-md hover:scale-[1.05] transition"
            >
              <Trash2 className="w-6 h-6 text-red-500" />
            </button>
          )}
          <button
            onClick={saveNote}
            disabled={saving}
            className={`px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 ${
              saving
                ? "bg-[var(--color-muted)] text-[var(--color-background)] cursor-not-allowed"
                : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] hover:scale-[1.03] active:scale-[0.98]"
            }`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Floating Notice Popup */}
      {notice.message && (
        <NoticePopup
          id={`notice-${notice.type}`}
          type={notice.type}
          message={notice.message}
          duration={2000}
          onClose={() => setNotice({ type: "", message: "" })}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg flex flex-col gap-4">
            <h2 className="text-lg font-bold">Delete Note?</h2>
            <p className="text-gray-600">This action cannot be undone. Are you sure?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 rounded-xl border shadow hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteNote}
                className="px-4 py-2 rounded-xl bg-red-500 text-white shadow hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inputs */}
      <input
        type="text"
        placeholder="Title"
        value={note.title}
        onChange={(e) => setNote((n) => ({ ...n, title: e.target.value }))}
        className="w-full max-w-[1200px] p-4 mb-4 text-2xl font-extrabold rounded-xl border-2 border-[var(--color-muted)] bg-white/60 focus:border-[var(--color-accent)] outline-none"
      />
      <textarea
        placeholder="Write your note here..."
        value={note.content}
        onChange={(e) => setNote((n) => ({ ...n, content: e.target.value }))}
        className="w-full max-w-[1200px] p-4 flex-1 min-h-[50vh] rounded-xl border-2 border-[var(--color-muted)] bg-white/60 resize-none focus:border-[var(--color-accent)] outline-none text-lg"
      />
    </div>
  );
}
