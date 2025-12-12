// app/edit-note/page.js

import { Suspense } from 'react';

import EditNotePageContent from './EditNotePage'; 

export default function EditNoteWrapper() {

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