
import { useEffect, useState } from "react";
import Notes from "./pages/Notes.jsx";

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check whether the user is logged in
        const res = await fetch(`${API_URL}/check`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to check session");
        }

        const data = await res.json();

        setLoggedIn(data.loggedIn);

        if (data.username) {
          setUsername(data.username);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // While checking the session
  if (loading) {
    return (
      <div className="text-white p-5">
        Checking session...
      </div>
    );
  }

  // User is not logged in
  if (!loggedIn) {
    window.location.href = `${API_URL}/login`;
    return null;
  }

  // User is logged in
  return <Notes username={username} />;
}

export default App;
