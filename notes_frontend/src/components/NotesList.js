import React from 'react';

// PUBLIC_INTERFACE
/**
 * List of notes selectable by user.
 * @param {{notes: array, selectedId: string, onSelect: function, style?: object}} props
 */
function NotesList({ notes, selectedId, onSelect, style }) {
  return (
    <div className="notes-list" style={style}>
      <ul>
        {notes.map(note => (
          <li
            key={note.id}
            className={selectedId === note.id ? "note-card selected" : "note-card"}
            onClick={() => onSelect(note.id)}
          >
            <div className="note-card-title">{note.title}</div>
            <div className="note-card-content line-clamp">
              {note.content ? note.content.replace(/\n/g, ' ').substr(0, 80) : ""}
            </div>
            <div className="note-card-date">{new Date(note.created_at).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotesList;
