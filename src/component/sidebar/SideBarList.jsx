import "./sidebar.css";
import React, { useRef, useState } from "react";
import "./sidebar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";




import Logo from "../../assest/chat/logo1.png";
import routes from "./SideBarRoute";
import { Divider, Layout, Menu, Skeleton } from "antd";
import { useAuth } from "../../authentication/context/authContext";

const SideBarList = () => {
  const { Sider } = Layout;
  const { role, permissions } = useAuth()
  const [openKeys, setOpenKeys] = useState([]);
  // This ensures only one submenu is open at a time

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const filterRoutesByPermissions = (routes, permissions) => {
    return routes
      .filter(route => {
        if (!route.permission) return true;
        return permissions?.includes(route.permission);
      })
      .map(route => {
        if (route.children) {
          const filteredChildren = filterRoutesByPermissions(route.children, permissions);
          return {
            ...route,
            children: filteredChildren,
          };
        }
        return route;
      })
      .filter(route => !route.children || route.children.length > 0); // Remove empty submenus
  };


  const filteredRoutes = role === "SuperAdmin"
    ? routes
    : filterRoutesByPermissions(routes, permissions).slice(0, -1);

  // const filteredRoutes = filterRoutesByPermissions(routes, permissions);
  return (
    <div className="sidebarMenuItem">
      <Sider
        breakpoint="lg"
        id="sidebar"
        width={270}
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          // console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        style={{
          position: 'sticky',
          left: 0,
          top: 0,
        }}

      >

        <div className="side_log">
          <img src={Logo} width={160} />

        </div>
        <Divider style={{ margin: "0" }} />
        <Menu theme="light" mode="inline"
          defaultSelectedKeys={['1']}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        >
          {!filteredRoutes ? <Skeleton active /> : filteredRoutes.map((route, index) => {
            if (route.children) {
              return (

                <Menu.SubMenu
                  key={route.key}
                  title={<span className="side_sub_menu">{route.label}</span>}
                  icon={<span className="side_menu_icon">{route.icons}</span>}
                // onClick={() => handleSubMenuClick(route.key)}
                >
                  {route.children.map((subRoute, subIndex) => (
                    <Menu.Item
                      key={subRoute.keys}
                      icon={<span className="side_menu_icon">{subRoute.icons}</span>}

                    >
                      <Link to={subRoute.path} >{subRoute.label}</Link>

                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              );
            }
            return (
              <>

                <Menu.Item
                  key={route.key}
                  icon={<span className="side_menu_icon">{route.icons}</span>}

                >
                  <Link to={route.path} >{route.label}</Link>

                </Menu.Item>
              </>
            );
          })}
        </Menu>
      </Sider>
      ;
    </div>
  );
};

export default SideBarList;
