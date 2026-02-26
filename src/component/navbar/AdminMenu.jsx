import { Avatar, Badge, Button, Divider, Dropdown, Image, List, Menu, Space } from 'antd';

import { useAuth } from '../../authentication/context/authContext';
import "./navbar.css"
import { AiOutlineLogout } from "react-icons/ai";
import {
    UserOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { FetchAdimProfile } from '../../service/api_services';

function AdminMenu() {
    const { logout, token, getPermissions, getRole } = useAuth()
    const [profileData, setProfileData] = useState([])

    const showAdinProfile = async () => {
        try {
            await FetchAdimProfile(token).then((res) => {
                console.log("fetch profile", res)
                if (res.status === 200) {
                    const fetchData = res.data.data
                    setProfileData(fetchData)
                    localStorage.setItem('role', fetchData?.roleName);
                    getRole(fetchData?.roleName);
                    localStorage.setItem('permissions', JSON.stringify(fetchData.permissions));
                    getPermissions(fetchData.permissions);
                }
            }).catch((err) => {
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        showAdinProfile()
    }, [])

    const menu = (
        <Menu
            className="custom-profile-dropdown"
            items={[
                {
                    key: '1',
                    disabled: true,
                    label: (
                        <div className='profile'>

                            <List
                                className="px-2"
                                itemLayout="horizontal"

                            >
                                <List.Item >
                                    <List.Item.Meta

                                        avatar={
                                            <Badge status="success"> <Avatar size="large" icon={<UserOutlined />} /></Badge>
                                        }

                                        title={
                                            <div className="item_title">
                                                <p>{profileData?.fullName}</p>
                                            </div>
                                        }
                                        description={
                                            <div className="order_datas">
                                                <p>{profileData?.email}</p>
                                                <p>{profileData?.type}</p>
                                            </div>
                                        }
                                    />

                                </List.Item>


                            </List>
                            {/* <Divider dashed/> */}
                        </div>
                    ),
                },

                {
                    key: '5',
                    label: (
                        <div className='text-center'>

                            <Button size='large' type='link' danger icon={<AiOutlineLogout />} onClick={() => logout()} style={{ marginBottom: 0, }}>
                                Logout
                            </Button>
                        </div>
                    ),
                },


            ]}
        />
    );


    return (

        <div >
            <Space direction="vertical">
                <Space wrap>
                    <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}  >
                        {<Avatar
                            className='user_icons'
                            icon={<UserOutlined />}
                        />
                        }
                    </Dropdown>
                </Space>
            </Space>
        </div>
    )
}


export default AdminMenu;