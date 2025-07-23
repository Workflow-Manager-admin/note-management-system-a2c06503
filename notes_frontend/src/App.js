import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import useNotes from './hooks/useNotes';

// PUBLIC_INTERFACE
/**
 * Root App component
 * Implements layout: header, sidebar, main;
 * Manages current note state; passes down CRUD and search props/context.
 */
function App() {
  const {
    notes,
    search,
    setSearch,
    filteredNotes,
    createNote,
    updateNote,
    deleteNote,
    loading,
    error,
    fetchNotes,
  } = useNotes();

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Set initial selected note (first in filtered list)
  useEffect(() => {
    if (filteredNotes.length > 0) {
      setSelectedNoteId((id) =>
        id && filteredNotes.some((n) => n.id === id)
          ? id
          : filteredNotes[0].id
      );
    } else {
      setSelectedNoteId(null);
    }
  }, [filteredNotes]);

  // Handler to select a note
  const handleSelectNote = (id) => {
    setSelectedNoteId(id);
    setIsEditing(false);
  };

  // Handler to add new note
  const handleAddNote = () => {
    setIsEditing(true);
    setSelectedNoteId(null); // clears selection
  };

  // Handler to edit note
  const handleEditNote = (id) => {
    setSelectedNoteId(id);
    setIsEditing(true);
  };

  // Handler to save note (create or update)
  const handleSaveNote = async (note) => {
    if (note.id) {
      await updateNote(note.id, note);
      setSelectedNoteId(note.id);
    } else {
      const newNote = await createNote(note);
      if (newNote && newNote.id) setSelectedNoteId(newNote.id);
    }
    setIsEditing(false);
  };

  // Handler to delete
  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    setSelectedNoteId(null);
    setIsEditing(false);
  };

  // Compute currently selected note
  const selectedNote =
    filteredNotes.find((n) => n.id === selectedNoteId) ||
    notes.find((n) => n.id === selectedNoteId) ||
    null;

  return (
    <div className="notes-app-layout">
      <Header />
      <div className="notes-main-body">
        <Sidebar
          notes={filteredNotes}
          loading={loading}
          selectedId={selectedNoteId}
          onSelect={handleSelectNote}
          search={search}
          setSearch={setSearch}
          onAddNote={handleAddNote}
        />
        <main className="notes-main-content">
          {loading && <div className="notes-status">Loading...</div>}
          {error && (
            <div className="notes-status notes-error">
              Error: {error}
              <button onClick={fetchNotes} className="btn btn-refresh">
                Retry
              </button>
            </div>
          )}
          {!loading && !isEditing && selectedNote && (
            <div className="note-view-container">
              <NotesList
                notes={filteredNotes}
                selectedId={selectedNoteId}
                onSelect={handleSelectNote}
                style={{ display: "none" }} // no inline rendering needed here
              />
              <NoteViewer
                note={selectedNote}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            </div>
          )}
          {!loading && isEditing && (
            <NoteEditor
              note={selectedNote}
              onSave={handleSaveNote}
              onCancel={() => setIsEditing(false)}
            />
          )}
          {!loading && !isEditing && !selectedNote && filteredNotes.length === 0 && (
            <div className="notes-empty-state">
              <div>No notes found.</div>
              <button className="btn btn-primary" onClick={handleAddNote}>
                Create New Note
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Displays a note with actions.
 * @param {{note: object, onEdit: function, onDelete: function}} props
 */
function NoteViewer({ note, onEdit, onDelete }) {
  if (!note) return null;
  return (
    <div className="note-viewer">
      <div className="note-viewer-header">
        <h1>{note.title}</h1>
        <div>
          <button className="btn btn-secondary" onClick={() => onEdit(note.id)}>
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm('Delete this note?')) onDelete(note.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="note-viewer-body">
        <p>{note.content}</p>
      </div>
      <div className="note-viewer-meta">
        <span>Created: {new Date(note.created_at).toLocaleString()}</span>
        {note.updated_at && (
          <span>Updated: {new Date(note.updated_at).toLocaleString()}</span>
        )}
      </div>
    </div>
  );
}

export default App;
