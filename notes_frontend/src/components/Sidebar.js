import React from 'react';

// PUBLIC_INTERFACE
/**
 * Sidebar with search, navigation, and note list
 * @param {{notes: array, loading: boolean, selectedId: string, onSelect: function, search: string, setSearch: function, onAddNote: function}} props
 */
function Sidebar({ notes, loading, selectedId, onSelect, search, setSearch, onAddNote }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="app-title">Note Manager</div>
        <button className="btn btn-primary btn-new" onClick={onAddNote}>
          + New Note
        </button>
      </div>
      <div className="sidebar-search">
        <input
          className="search-input"
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <nav className="sidebar-notes-list">
        {loading ? (
          <div className="sidebar-loading">Loading...</div>
        ) : notes.length === 0 ? (
          <div className="sidebar-empty">No notes</div>
        ) : (
          <ul>
            {notes.map(note => (
              <li
                key={note.id}
                className={selectedId === note.id ? "sidebar-note selected" : "sidebar-note"}
                onClick={() => onSelect(note.id)}
              >
                <span className="sidebar-note-title">{note.title || <em>(Untitled)</em>}</span>
                <small className="sidebar-note-date">{new Date(note.created_at).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
