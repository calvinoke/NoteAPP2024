import "./App.css";
import { useState, useEffect } from "react";

const App = () => {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  
  //useEffect to fetch data from the database....
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/notes"
        );

        const notes: Note[] =
          await response.json();

        setNotes(notes);
      } catch (e) {
        console.log(e);
      }
    };

    //calling the fetchNotes function
    fetchNotes();
  }, []);
    



    //a reference function to handle form submission...
    const handleAddNote = async  (event: React.FormEvent) => {
      event.preventDefault();
      //console.log("title: ", title);
      //console.log("content: ", content);
      //const newNote = {
      //  id: notes.length + 1,
       // title: title,
       // content: content,
       //};
    
       //adding a new note to appear on top, then the rest of notes under...
       //setNotes([newNote, ...notes]);
       //clearing the form input data to be empty after adding the new note...
       //setTitle("");
       //setContent("");
       try {
        const response = await fetch(
          "http://localhost:5000/api/notes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              content,
            }),
          }
        );
  
        const newNote = await response.json();
  
        setNotes([newNote, ...notes]);
        setTitle("");
        setContent("");
      } catch (e) {
        console.log(e);
      }
    };

  //creating a new note object under const over Note function that will be used to add the notes to the backend..
  //const overNote = () => {
    //const newNote = {
    //id: notes.length + 1,
    //title: title,
   
   
   // content: content,
   //};

   //adding a new note to appear on top, then the rest of notes under...
   //setNotes([newNote, ...notes]);
   //clearing the form input data to be empty after adding the new note...
   //setTitle("");
   //setContent("");

//};

//Editting note function our notes handlers
const editNoteClick = (note: Note) => {
  setSelectedNote(note);
  setTitle(note.title);
  setContent(note.content);
};

//updating our note by saving function
const handleUpdateNote = (event: React.FormEvent) => {
  event.preventDefault();

  if (!selectedNote) {
    return;
  }

  const updatedNote = {
    id: selectedNote.id,
    title: title,
    content: content,
  };

  const updatedNotesList = (
    notes.map((note) => (
      note.id === selectedNote.id ? updatedNote : note)));

  setNotes(updatedNotesList);
  setTitle("");
  setContent("");
  setSelectedNote(null);
};

//handling cancel function..
const handleCancel = () => {
  setTitle("");
  setContent("");
  setSelectedNote(null);
};

//handling delete function to delete note from UI..
const deleteNote = async (
  event: React.MouseEvent,
  noteId: number
) => {
  event.stopPropagation();

  try {
    await fetch(
      `http://localhost:5000/api/notes/${noteId}`,
      {
        method: "DELETE",
      }
    );
    const updatedNotes = notes.filter(
      (note) => note.id !== noteId
    );

    setNotes(updatedNotes);
  } catch (e) {
    console.log(e);
  }
};


return (
    <div className="app-container">
    <form className="note-form" onSubmit={(event) => (selectedNote ? handleUpdateNote(event) : handleAddNote(event))}>

      <input
      value={title}
      onChange={(event) => setTitle(event.target.value)}
      placeholder="Title"
      required />

    <textarea
     value={content}
     onChange={(event) => setContent(event.target.value)}
     placeholder="Content"
     rows={10}
     required />

   {selectedNote ? (
    <div className="edit-buttons">
      <button type="submit">Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
    ) : (
    <button type="submit">Add Note</button>
  )}
  </form>
      
  <div className="notes-grid">
  {notes.map((note) => (
  <div key={note.id} className="note-item" onClick={() => editNoteClick(note)}>
  <div className="notes-header">
  <button onClick={(event) => deleteNote(event, note.id)}>x</button>
  </div>
  <h2>{note.title}</h2>
  <p>{note.content}</p>
  </div>

  ))};
  </div>;
        </div>
  );
}

export default App;