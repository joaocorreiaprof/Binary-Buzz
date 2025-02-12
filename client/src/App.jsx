import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Components
import Sidebar from "./components/Sidebar";
import GlobalChat from "./components/GlobalChat";
import GlobalChatDisplay from "./components/GlobalChatDisplay";
import ChatsDisplay from "./components/ChatsDisplay";
import Groups from "./components/Groups";
import GroupsDisplay from "./components/GroupsDisplay";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";

// Styles
import "./styles/App.css";
import "@fontsource/inter";
import "@fontsource/nunito";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = decodedUser.exp * 1000; // Expiration time in milliseconds
        const currentTime = Date.now();

        // If the token has expired, log the user out
        if (expirationTime < currentTime) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser(decodedUser); // Token is valid, so set the user
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null); // No token, so set user to null
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="main-content">
        {user && <Sidebar user={user} setUser={setUser} />}
        <div className="content-area">
          <Routes>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/log-in" element={<LogIn setUser={setUser} />} />

            <Route
              path="/"
              element={
                user ? (
                  <>
                    <GlobalChat user={user} />
                    <GlobalChatDisplay user={user} />
                  </>
                ) : (
                  <Navigate to="/log-in" />
                )
              }
            />
            <Route
              path="/chats/:userId/:receiverId"
              element={
                user ? (
                  <>
                    <GlobalChat user={user} />
                    <ChatsDisplay user={user} />
                  </>
                ) : (
                  <Navigate to="/log-in" />
                )
              }
            />
            <Route
              path="/groups"
              element={
                user ? (
                  <>
                    <Groups user={user} />
                    <GroupsDisplay user={user} />
                  </>
                ) : (
                  <Navigate to="/log-in" />
                )
              }
            />
            <Route
              path="*"
              element={<Navigate to={user ? "/" : "/log-in"} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
