import React from "react";
import "./navbar.css";
import AdminMenu from "./AdminMenu";
import { FiSearch } from "react-icons/fi";
import { Badge, Form, Input } from "antd";
import { AiOutlineHistory, AiOutlineSetting } from "react-icons/ai";
import { BsSliders } from "react-icons/bs";
import { MdNotificationsNone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../authentication/context/userContext";
import { MenuFoldOutlined } from "@ant-design/icons";
import { useCollapes } from "../../authentication/context/SidebarCollapes";
import { MdOutlineSettings } from "react-icons/md";


function Navbar() {
  const navigate = useNavigate();
  const { handleCollape } = useCollapes()
  return (
    <div className="navbarSection">
      <div className="navmenu">
        <div className="showCurrentUser">
          {/* <MenuFoldOutlined className="sidebar_side_icon" onClick={()=>handleCollape()}/> */}
        </div>
        <div className="headerMenu">
          
          <div className="navs">
            <AdminMenu />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
