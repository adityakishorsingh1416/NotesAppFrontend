import { useEffect, useState } from "react";

function Notes({ username }) {
  const [notes, setNotes] = useState([]);
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editHeading, setEditHeading] = useState("");
  const [editContent, setEditContent] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // ===============================
  // GET JWT TOKEN
  // ===============================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ===============================
  // FETCH NOTES
  // ===============================

  const fetchNotes = async () => {
    try {
      const token = getToken();

      if (!token) {
        window.location.href = `${API_URL}/login`;
        return;
      }

      const res = await fetch(`${API_URL}/api/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = `${API_URL}/login`;
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await res.json();

      setNotes(data);
    } catch (error) {
      console.error("Fetch notes error:", error);
    }
  };

  // ===============================
  // LOAD NOTES
  // ===============================

  useEffect(() => {
    fetchNotes();
  }, []);

  // ===============================
  // ADD NOTE
  // ===============================

  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!heading.trim() || !content.trim()) {
      alert("Please enter heading and content");
      return;
    }

    try {
      const token = getToken();

      const res = await fetch(`${API_URL}/api/notes`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          heading,
          content,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = `${API_URL}/login`;
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to create note");
      }

      const data = await res.json();

      setNotes((prevNotes) => [
        data.newNote,
        ...prevNotes,
      ]);

      setHeading("");
      setContent("");
    } catch (error) {
      console.error("Create note error:", error);
      alert("Failed to create note");
    }
  };

  // ===============================
  // DELETE NOTE
  // ===============================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = getToken();

      const res = await fetch(`${API_URL}/api/notes/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = `${API_URL}/login`;
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== id)
      );
    } catch (error) {
      console.error("Delete note error:", error);
      alert("Failed to delete note");
    }
  };

  // ===============================
  // START EDIT
  // ===============================

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditHeading(note.heading);
    setEditContent(note.content);
  };

  // ===============================
  // CANCEL EDIT
  // ===============================

  const cancelEdit = () => {
    setEditingId(null);
    setEditHeading("");
    setEditContent("");
  };

  // ===============================
  // UPDATE NOTE
  // ===============================

  const handleUpdate = async (id) => {
    if (!editHeading.trim() || !editContent.trim()) {
      alert("Heading and content are required");
      return;
    }

    try {
      const token = getToken();

      const res = await fetch(`${API_URL}/api/notes/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          heading: editHeading,
          content: editContent,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = `${API_URL}/login`;
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to update note");
      }

      const data = await res.json();

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === id ? data.updatedNote : note
        )
      );

      cancelEdit();
    } catch (error) {
      console.error("Update note error:", error);
      alert("Failed to update note");
    }
  };

  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {
    localStorage.removeItem("token");

    window.location.href = `${API_URL}/login`;
  };

  // ===============================
  // UI
  // ===============================

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            My Notes
          </h1>

          {username && (
            <p className="text-gray-400 mt-1">
              Welcome, {username}
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* ADD NOTE FORM */}
      <div className="max-w-5xl mx-auto mb-8">

        <form
          onSubmit={handleAddNote}
          className="bg-gray-800 p-6 rounded-xl shadow-lg"
        >

          <h2 className="text-xl font-semibold mb-4">
            Add New Note
          </h2>

          <input
            type="text"
            placeholder="Note heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-green-500"
          />

          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg font-semibold"
          >
            Add Note
          </button>

        </form>
      </div>

      {/* NOTES */}
      <div className="max-w-5xl mx-auto">

        {notes.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-400">
            No notes yet. Create your first note!
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">

            {notes.map((note) => (

              <div
                key={note._id}
                className="bg-gray-800 rounded-xl p-6 shadow-lg"
              >

                {editingId === note._id ? (

                  // ===============================
                  // EDIT MODE
                  // ===============================

                  <div>

                    <input
                      type="text"
                      value={editHeading}
                      onChange={(e) =>
                        setEditHeading(e.target.value)
                      }
                      className="w-full bg-gray-700 text-white p-3 rounded-lg mb-3 outline-none"
                    />

                    <textarea
                      value={editContent}
                      onChange={(e) =>
                        setEditContent(e.target.value)
                      }
                      rows="5"
                      className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4 outline-none"
                    />

                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          handleUpdate(note._id)
                        }
                        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
                      >
                        Save
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                ) : (

                  // ===============================
                  // VIEW MODE
                  // ===============================

                  <div>

                    <h2 className="text-xl font-bold mb-2">
                      {note.heading}
                    </h2>

                    <p className="text-gray-300 whitespace-pre-wrap mb-5">
                      {note.content}
                    </p>

                    <div className="flex gap-3">

                      <button
                        onClick={() => startEdit(note)}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(note._id)
                        }
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                )}

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

// IMPORTANT:
// App.jsx imports this component as:
// import Notes from "./pages/Notes.jsx";

export default Notes;

