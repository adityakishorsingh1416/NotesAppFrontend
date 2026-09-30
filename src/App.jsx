
import { useEffect, useState } from "react";
import Notes from "./pages/Notes.jsx";

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoggedIn(false);
          return;
        }

        const res = await fetch(`${API_URL}/check`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.loggedIn) {
          setLoggedIn(true);
          setUsername(data.username);
        } else {
          localStorage.removeItem("token");
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);

        localStorage.removeItem("token");
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="text-white p-5">
        Checking login...
      </div>
    );
  }

  if (!loggedIn) {
    window.location.href = `${API_URL}/login`;
    return null;
  }

  return <Notes username={username} />;
}

export default App;

