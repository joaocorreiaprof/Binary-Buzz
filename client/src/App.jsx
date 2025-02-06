//Packages
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

//Components
import Sidebar from "./components/Sidebar";
import GlobalChat from "./components/GlobalChat";
import GlobalChatDisplay from "./components/GlobalChatDisplay";
import Chats from "./components/Chats";
import ChatsDisplay from "./components/ChatsDisplay";
import Groups from "./components/Groups";
import GroupsDisplay from "./components/GroupsDisplay";
import ManageProfile from "./components/ManageProfile";
import ManageProfileDisplay from "./components/ManageProfileDisplay";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";

//Style & fonts
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
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
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
            {/* Public Routes */}
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/log-in" element={<LogIn setUser={setUser} />} />

            {/* Protected Routes */}
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
              path="/chats"
              element={
                user ? (
                  <>
                    <Chats user={user} />
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
              path="/profile"
              element={
                user ? (
                  <>
                    <ManageProfile user={user} />
                    <ManageProfileDisplay user={user} />
                  </>
                ) : (
                  <Navigate to="/log-in" />
                )
              }
            />

            {/* Redirect unknown routes */}
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
