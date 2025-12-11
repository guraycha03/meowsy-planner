// lib/localNotes.js

export function getAllNotes(userId) {
  if (!userId) return [];
  const notes = localStorage.getItem(`notes_${userId}`);
  return notes ? JSON.parse(notes) : [];
}

export function createNote(userId) {
  if (!userId) return null;
  const notes = getAllNotes(userId);
  const newNote = {
    id: crypto.randomUUID(),
    title: "New Note",
    content: "",
    stickers: [], // initialize empty stickers array
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  notes.push(newNote);
  localStorage.setItem(`notes_${userId}`, JSON.stringify(notes));
  return newNote;
}

export function getNote(id, userId) {
  if (!userId || !id) return null;
  const notes = getAllNotes(userId);
  const note = notes.find((n) => n.id === id) || null;
  if (note && !note.stickers) note.stickers = []; // ensure stickers array exists
  return note;
}

export function updateNote(id, updatedNote, userId) {
  if (!userId || !id) return;
  const notes = getAllNotes(userId);
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return;
  // make sure stickers array is included
  notes[index] = { ...notes[index], ...updatedNote, updatedAt: Date.now() };
  localStorage.setItem(`notes_${userId}`, JSON.stringify(notes));
}

export function deleteNote(id, userId) {
  if (!userId || !id) return;
  let notes = getAllNotes(userId);
  notes = notes.filter((n) => n.id !== id);
  localStorage.setItem(`notes_${userId}`, JSON.stringify(notes));
}
