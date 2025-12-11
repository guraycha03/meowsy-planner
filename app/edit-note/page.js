// app/edit-note/page.js

import { Suspense } from 'react';
// Assuming your client component is now renamed or imported correctly
import EditNotePageContent from './EditNotePage'; 

export default function EditNoteWrapper() {
  // 🌟 FIX: The Suspense boundary allows the page to be statically rendered (SSR/build) 
  // while deferring the component using useSearchParams() (EditNotePageContent)
  // until the client takes over.
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen bg-[#f7f5f2]">
        <p className="text-xl text-gray-500 font-bold">Loading Note Editor...</p>
      </div>
    }>
      <EditNotePageContent /> 
    </Suspense>
  );
}