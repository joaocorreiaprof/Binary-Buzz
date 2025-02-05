//Components
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
//Style
import "../styles/Sidebar.css";
//Icons
import { AiOutlineGlobal } from "react-icons/ai";
import { BsChatSquareTextFill } from "react-icons/bs";
import { MdGroups2 } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut } from "react-icons/io";
import { FaSignInAlt } from "react-icons/fa";
import { GiArchiveRegister } from "react-icons/gi";

const SideBar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
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
        {!user ? (
          <>
            <Link to="/sign-up" className="sidebar-option">
              <GiArchiveRegister />
              <p>Sign Up</p>
            </Link>
            <Link to="/log-in" className="sidebar-option">
              <FaSignInAlt />
              <p>Log In</p>
            </Link>
          </>
        ) : (
          <>
            <p>@{user.username || "User"}</p>
            <Link to="/profile" className="sidebar-option">
              <CgProfile />
              <p>Profile</p>
            </Link>
            <button onClick={handleLogout} className="sidebar-option">
              <IoMdLogOut />
              <p>Log Out</p>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

SideBar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
  setUser: PropTypes.func.isRequired,
};

export default SideBar;
