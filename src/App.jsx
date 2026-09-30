import { useEffect, useState } from "react";
import Notes from "./pages/Notes.jsx";

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  console.log("API_URL:", API_URL);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_URL}/check`, {
          credentials: "include",
        });

        console.log("CHECK STATUS:", res.status);

        if (!res.ok) {
          throw new Error("Failed to check session");
        }

        const data = await res.json();

        console.log("CHECK RESPONSE:", data);

        setLoggedIn(data.loggedIn);
        setUsername(data.username || "");
      } catch (error) {
        console.error("Session check error:", error);
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="text-white p-5">
        Checking session...
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

