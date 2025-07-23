import { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_NOTES_API_URL || '';

/**
 * Simple API helper
 */
async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// PUBLIC_INTERFACE
/**
 * React hook for loading and managing notes list.
 * Returns { notes, search, setSearch, filteredNotes, createNote, updateNote, deleteNote, loading, error, fetchNotes }
 */
function useNotes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Load notes on mount or refresh
  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiFetch('/api/notes');
      setNotes(result.notes || result || []);
    } catch (e) {
      setError(e.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // PUBLIC_INTERFACE
  const createNote = async (noteData) => {
    try {
      const created = await apiFetch('/api/notes', {
        method: 'POST',
        body: JSON.stringify(noteData),
      });
      await fetchNotes();
      return created;
    } catch (e) {
      setError(e.message);
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      await apiFetch(`/api/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(noteData),
      });
      await fetchNotes();
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteNote = async (id) => {
    try {
      await apiFetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });
      await fetchNotes();
    } catch (e) {
      setError(e.message);
    }
  };

  // Filter notes by search string in title/content
  const filteredNotes =
    !search.trim()
      ? notes
      : notes.filter(
          (n) =>
            (n.title && n.title.toLowerCase().includes(search.toLowerCase())) ||
            (n.content && n.content.toLowerCase().includes(search.toLowerCase()))
        );

  return {
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
  };
}

export default useNotes;
