//Packages
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
  }, []);

  return (
    <Router>
      <div className="main-content">
        <div className="content-sidebar">
          <Sidebar user={user} setUser={setUser} />
        </div>
        <div className="content-area">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <GlobalChat user={user} />
                  <GlobalChatDisplay user={user} />
                </>
              }
            />
            <Route
              path="/chats"
              element={
                <>
                  <Chats user={user} />
                  <ChatsDisplay user={user} />
                </>
              }
            />
            <Route
              path="/groups"
              element={
                <>
                  <Groups user={user} />
                  <GroupsDisplay user={user} />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <ManageProfile user={user} />
                  <ManageProfileDisplay user={user} />
                </>
              }
            />
            <Route
              path="/sign-up"
              element={
                <>
                  <SignUp />
                </>
              }
            />
            <Route
              path="/log-in"
              element={
                <>
                  <LogIn setUser={setUser} />
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
