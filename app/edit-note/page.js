// app/edit-note/page.js
import dynamic from "next/dynamic";

// Dynamically import the client-only page
const EditNotePageClient = dynamic(() => import("./EditNotePageClient"), { ssr: false });

export default function Page() {
  return <EditNotePageClient />;
}
