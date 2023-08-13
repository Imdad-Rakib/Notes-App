import React from "react"
import Sidebar from "./Sidebar"
import Editor from "./Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
import './App.css'
import { onSnapshot, addDoc, doc, deleteDoc, setDoc} from "firebase/firestore"
import { notesCollection, db} from "./firebase"

export default function App() {
  const [notes, setNotes] = React.useState([])
  const [currentNoteId, setCurrentNoteId] = React.useState("")
  const [tempNoteText, setTempNoteText] = React.useState("")
  const currentNote = notes.find(note => {
    return note.id === currentNoteId
  }) || notes[0]
  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function(snapshot){
      const notesArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setNotes(notesArr.sort(function (a, b) {
        if (a.updatedAt > b.updatedAt) return -1
        else if (a.updateNote < b.updatedAt) return 1
        else return 0
      }))
    })
    return unsubscribe
  }, [])
  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id)
    }
  }, [notes])
  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body)
    }
  }, [currentNote])
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateNote(tempNoteText)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [tempNoteText])
  async function createNewNote() {
    const newNote = {
      body: `Note ${notes.length + 1}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    const newNoteRef = await addDoc(notesCollection, newNote)
    setCurrentNoteId(newNoteRef.id)
  }
  async function updateNote(text) {
    try{
      const docRef = doc(db, "notes", currentNoteId)
      await setDoc(
          docRef, 
          {
            body: text,
            updatedAt: Date.now()
          }, 
          {merge: true}
      )
    }
    catch(err){
      console.log(err)
    }
  }
  
  async function deleteNote(id) {
    const docRef = doc(db, "notes", id)
    await deleteDoc(docRef)
  }

  return (
    <main>
      {
        notes.length > 0
          ?
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className="split"
          >
            <Sidebar
              notes={notes}
              currentNote={currentNote}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              deleteNote = {deleteNote}
            />
            {
              // currentNoteId &&
              // notes.length > 0 &&
              <Editor
                tempNoteText={tempNoteText}
                setTempNoteText={setTempNoteText}
              />
            }
          </Split>
          :
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button
              className="first-note"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>

      }
    </main>
  )
}
