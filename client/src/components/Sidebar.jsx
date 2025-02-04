//Components
import { Link } from "react-router-dom";
//Style
import "../styles/Sidebar.css";
//Icons
import { AiOutlineGlobal } from "react-icons/ai";
import { BsChatSquareTextFill } from "react-icons/bs";
import { MdGroups2 } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut } from "react-icons/io";

const SideBar = () => {
  return (
    <div className="sidebar">
      <div className="upper-options">
        <Link to="/" className="sidebar-option">
          <AiOutlineGlobal />
          <p>Global</p>
        </Link>
        <Link to="/chats" className="sidebar-option">
          <BsChatSquareTextFill />
          <p>Chats</p>
        </Link>
        <Link to="/groups" className="sidebar-option">
          <MdGroups2 />
          <p>Groups</p>
        </Link>
      </div>
      <div className="lower-options">
        <Link to="/profile" className="sidebar-option">
          <CgProfile />
          <p>Profile</p>
        </Link>
        <Link to="/logout" className="sidebar-option">
          <IoMdLogOut />
          <p>Logout</p>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
