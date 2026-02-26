import React, { useEffect, useState } from 'react';
import "./dashboard.css"
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Input, Layout, Menu, Space, theme } from 'antd';
import Logo from "../../assest/chat/logo.png"
import SideBarList from '../sidebar/SideBarList';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminMenu from '../navbar/AdminMenu';
import { MdNotificationsNone, MdOutlineSettings } from 'react-icons/md';
import { useAuth } from '../../authentication/context/authContext';
import GeneralSetting from '../setting/GeneralSetting';
import Support from '../navbar/Support';
import ElasticSearchProduct from '../elasticSearch/ElasticSearchProduct';
const { Header, Content, Footer, Sider } = Layout;
const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
  (icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
  }),
);


const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()


  const { Search } = Input;
  const { token, role, permissions } = useAuth()
  const [colorChange, setColorchange] = useState(false);
  const changeNavbarColor = () => {
    if (window.scrollY >= 20) {
      setColorchange(true);
    } else {
      setColorchange(false);
    }
  };
  useEffect(() => {
    changeNavbarColor()
  }, [window.scrollY])

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (!token) {
    return <Navigate replace to="/" />;
  } else {

    return (
      <div className='main_layout'>
        <Layout >
          <SideBarList />
          <Layout>
            <Header
              className={
                colorChange
                && "colorChange"

              }
              style={{
                position: 'sticky',
                top: "1rem",
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                padding: 0,
                background: colorBgContainer,
                margin: "1rem",
                borderRadius: 10
              }}
            >
              <div className="head_menu">
                <div className="head_title">
                  <Space>
                    <h5>Admin Dashboard</h5>
                    <ElasticSearchProduct />
                  </Space>
                </div>


                <div className="header_menu_icon">
                  <div className="hear_icon">
                    <Space>
                      {role === "SuperAdmin" ? <Support /> : null}
                      {role === "SuperAdmin" ? <GeneralSetting /> : null}
                      <AdminMenu />
                    </Space>

                  </div>
                </div>


              </div>
            </Header>
            <Content
              style={{
                margin: '0 16px',
                marginBottom: "1rem"
              }}
            >
              <div
                style={{
                  padding: 24,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                  minHeight: 500,

                }}
              >
                <Outlet />
              </div>
            </Content>

          </Layout>
        </Layout>
      </div>
    );
  }

};
export default MainLayout;