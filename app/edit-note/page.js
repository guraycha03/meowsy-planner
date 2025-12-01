// app/edit-note/page.js
import dynamic from "next/dynamic";

// Dynamically import the client-only component
const EditNotePageClient = dynamic(
  () => import("./EditNotePageClient"),
  { ssr: false } // Disable server-side rendering
);

export default function Page() {
  return <EditNotePageClient />;
}
