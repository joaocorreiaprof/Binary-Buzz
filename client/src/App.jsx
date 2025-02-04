//Imported components
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import GlobalChat from "./components/GlobalChat";
import GlobalChatDisplay from "./components/GlobalChatDisplay";
import Chats from "./components/Chats";
import ChatsDisplay from "./components/ChatsDisplay";
import Groups from "./components/Groups";
import GroupsDisplay from "./components/GroupsDisplay";
import ManageProfile from "./components/ManageProfile";
import ManageProfileDisplay from "./components/ManageProfileDisplay";
import Logout from "./components/Logout";

//Style & fonts
import "./styles/App.css";
import "@fontsource/inter";
import "@fontsource/nunito";

function App() {
  return (
    <Router>
      <div className="main-content">
        <div className="content-sidebar">
          <Sidebar />
        </div>
        <div className="content-area">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <GlobalChat />
                  <GlobalChatDisplay />
                </>
              }
            />
            <Route
              path="/chats"
              element={
                <>
                  <Chats />
                  <ChatsDisplay />
                </>
              }
            />
            <Route
              path="/groups"
              element={
                <>
                  <Groups />
                  <GroupsDisplay />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <ManageProfile />
                  <ManageProfileDisplay />
                </>
              }
            />
            <Route
              path="/logout"
              element={
                <>
                  <Logout />
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
