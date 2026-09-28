
import React, { useEffect, useState } from "react";

const Notes = ({ username }) => {
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editHeading, setEditHeading] = useState("");
  const [editContent, setEditContent] = useState("");

  // Backend URL
  const API_URL = "http://localhost:5000";

  // LOGOUT
  const logout = () => {
    window.location.href = `${API_URL}/logout`;
  };

  // FETCH NOTES
  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notes`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await res.json();

      setNotes(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // FETCH NOTES WHEN COMPONENT LOADS
  useEffect(() => {
    fetchNotes();
  }, []);

  // ADD NOTE
  const submitNote = async (e) => {
    e.preventDefault();

    if (!heading.trim() || !content.trim()) {
      return alert("Fill both fields");
    }

    try {
      const res = await fetch(`${API_URL}/api/notes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heading: heading,
          content: content,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add note");
      }

      const data = await res.json();

      // Add newly created note to existing notes
      setNotes((prevNotes) => [...prevNotes, data.newNote]);

      // Clear form
      setHeading("");
      setContent("");
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // DELETE NOTE
  const deleteNote = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete note");
      }

      // Remove deleted note from UI
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== id)
      )
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // START EDITING
  const startEdit = (note) => {
    setEditId(note._id);
    setEditHeading(note.heading);
    setEditContent(note.content);
  };

  // SAVE EDIT
  const saveEdit = async () => {
    if (!editHeading.trim() || !editContent.trim()) {
      return alert("Fill both fields");
    }

    try {
      const res = await fetch(`${API_URL}/api/notes/${editId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heading: editHeading,
          content: editContent,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update note");
      }

      const data = await res.json();

      // Replace updated note in the array
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === editId ? data.updatedNote : note
        )
      );

      // Exit edit mode
      setEditId(null);
      setEditHeading("");
      setEditContent("");
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-xl bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/30">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-semibold">
            Welcome,{" "}
            <span className="text-pink-300 font-bold">
              {username}
            </span>
          </h2>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* ADD NOTE FORM */}
        <form onSubmit={submitNote} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter notes heading..."
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/70 focus:bg-white text-gray-700 shadow-md transition-all"
          />

          <input
            type="text"
            placeholder="Enter the details..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/70 focus:bg-white text-gray-700 shadow-md transition-all"
          />

          <button
            type="submit"
            className="px-4 py-3 mt-1 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold shadow-lg hover:shadow-2xl transition-all"
          >
            Add Notes
          </button>
        </form>

        {/* NOTES LIST */}
        <div className="mt-8 space-y-4">

          {notes.length === 0 ? (
            <p className="text-white/80 text-center">
              No notes found.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="p-5 rounded-2xl bg-white/20 backdrop-blur-lg shadow-lg border border-white/30"
              >

                {/* EDIT MODE */}
                {editId === note._id ? (
                  <div className="space-y-3">

                    <input
                      type="text"
                      className="p-3 rounded-lg w-full text-black"
                      value={editHeading}
                      onChange={(e) =>
                        setEditHeading(e.target.value)
                      }
                    />

                    <input
                      type="text"
                      className="p-3 rounded-lg w-full text-black"
                      value={editContent}
                      onChange={(e) =>
                        setEditContent(e.target.value)
                      }
                    />

                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg mr-3"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditHeading("");
                        setEditContent("");
                      }}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                    >
                      Cancel
                    </button>

                  </div>
                ) : (

                  /* NORMAL NOTE */
                  <div>
                    <h2 className="text-white font-bold text-xl">
                      {note.heading}
                    </h2>

                    <p className="text-white/90 mt-1">
                      {note.content}
                    </p>

                    <div className="flex gap-4 mt-3">

                      <button
                        onClick={() => startEdit(note)}
                        className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteNote(note._id)}
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow transition"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                )}

              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
};

export default Notes;
