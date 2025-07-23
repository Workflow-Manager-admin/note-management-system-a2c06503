import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
/**
 * Form-based editor for creating/editing notes.
 * @param {{note: object, onSave: function, onCancel: function}} props
 */
function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  // PUBLIC_INTERFACE
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim().length === 0 && content.trim().length === 0) return;
    onSave({
      ...(note ? { id: note.id } : {}),
      title: title.trim() || '(Untitled)',
      content: content.trim(),
    });
  };

  return (
    <form className="note-editor" onSubmit={handleSubmit}>
      <input
        className="note-editor-title"
        type="text"
        placeholder="Title"
        autoFocus
        maxLength={100}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="note-editor-content"
        placeholder="Write your note here..."
        rows={10}
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <div className="note-editor-actions">
        <button className="btn btn-primary" type="submit">{note ? 'Save' : 'Create'}</button>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default NoteEditor;
