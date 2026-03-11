
import "./sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assest/chat/logo1.png";
import routes from "./SideBarRoute";
import { Divider, Menu, Skeleton } from "antd";
import { useAuth } from "../../authentication/context/authContext";
import { useScreen } from "../../authentication/context/AuthScreen";
import { useState } from "react";

const SidebarContent = ({ setDrawerOpen }) => {
    const { screenWidth } = useScreen();
    const isMobile = screenWidth < 768;
    const navigate = useNavigate();
    const { role, permissions } = useAuth()
    const [openKeys, setOpenKeys] = useState([]);

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

    const filteredRoutes = role === "SuperAdmin" ? routes : filterRoutesByPermissions(routes, permissions).slice(0, -1);

    return (
        <div className="sidebar_container" style={{ height: isMobile ? '94vh' : '100vh' }}>
            <div className="side_log">
                <img src={Logo} width={160} onClick={() => navigate("/dashboard")} />
            </div>
            <Divider style={{ margin: "0" }} />
            <div className="menu_scroll">
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
                                            <NavLink
                                                to={subRoute.path}
                                                onClick={() => setDrawerOpen && setDrawerOpen(false)}
                                            >
                                                {subRoute.label}
                                            </NavLink>
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
                                    <NavLink
                                        to={route.path}
                                        onClick={() => setDrawerOpen && setDrawerOpen(false)}
                                    >
                                        {route.label}
                                    </NavLink>
                                </Menu.Item>
                            </>
                        );
                    })}
                </Menu>
            </div>
        </div>
    );
};

export default SidebarContent;
