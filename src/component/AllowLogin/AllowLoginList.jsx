import React, { useCallback, useEffect, useState } from "react";
import { Breadcrumb, Button, Dropdown, Form, Input, Pagination, Space, Typography, message } from "antd";
import { Table } from 'antd';
import { CloseOutlined, EditFilled, MoreOutlined, SearchOutlined } from '@ant-design/icons';
import { DeleteRestrictedLogin, fetchRestrictedLoginList } from "../../service/api_services";
import DeleteModal from "../../kit/DeleteModal/DeleteModal";
import { useAuth } from "../../authentication/context/authContext";
import AddUpdateAllowLogin from "./AddUpdateAllowLogin";

const { Title } = Typography;

function AllowLoginList() {
    const { token, logout } = useAuth()
    const [current, setCurrent] = useState(1)
    const [totalPage, setTotalPage] = useState([])
    const [allowLoginData, setAllowLoginData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [selectedAllowLogin, setSelectedAllowLogin] = useState()
    const [searchInput, setSearchInput] = useState("");

    const onChange = (page) => {
        setCurrent(page);
        setIsLoading(true);
    };

    const toggleDeleteAllowLoginDrawer = () => setShowDeleteDialog(!showDeleteDialog)

    const toggleDeleteAttributeDialog = (item) => {
        setSelectedAllowLogin(item)
        toggleDeleteAllowLoginDrawer()
    }

    function DropdownItem(record) {
        return [
            {
                key: '1',
                icon: <CloseOutlined />,
                label: (
                    <span onClick={() => toggleDeleteAttributeDialog(record)}>
                        Delete
                    </span>
                ),
            },
            {
                key: '2',
                icon: <EditFilled />,
                label: (
                    <AddUpdateAllowLogin record={record} ShowAllAllowLoginList={ShowAllAllowLoginList} />
                ),
            },
        ];
    }

    const columns = [
        {
            title: "User Name",
            dataIndex: "userName",
            key: "userName",
            render: (_, { userName }) => (
                <span>{userName}</span>
            ),
            ellipsis: true,
        },
        {
            title: "User Reference",
            dataIndex: "userReference",
            key: "userReference",
            render: (_, { userReference }) => (
                <span>{userReference}</span>
            ),
            ellipsis: true,
        },
        {
            title: "Comments",
            dataIndex: "comments",
            key: "comments",
            render: (_, { comments }) => (
                <span>{comments}</span>
            ),
            ellipsis: true,
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            render: (_, { phoneNumber }) => (
                <span>{phoneNumber}</span>
            ),
            ellipsis: true,
        },
        {
            title: 'Action',
            key: '_id',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Dropdown
                        trigger={["click"]}
                        menu={{
                            items: DropdownItem(record),

                        }}
                    >
                        <Button icon={<MoreOutlined />} shape="circle" />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const ShowAllAllowLoginList = async () => {
        try {
            await fetchRestrictedLoginList(token, current, searchInput)
                .then((res) => {
                    if (res.status == 200) {
                        setAllowLoginData(res.data.data.data);
                        setTotalPage(res.data.data.totalPages);
                        setIsLoading(true)
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()
                    }
                })
                .catch((err) => {
                    message.error(err.message);
                    setIsLoading(true)
                });
        } catch (error) {
            message.error(error);
            setIsLoading(true)
        }
    };

    useEffect(() => {
        ShowAllAllowLoginList()
    }, [current, searchInput])

    const deleteRestrictedLoginHandle = async () => {
        setIsDeleteLoading(true)
        try {
            await DeleteRestrictedLogin(selectedAllowLogin?._id, token)
                .then((res) => {
                    if (res?.data?.code === 200) {
                        message.success(res.data.message);
                        setIsDeleteLoading(false)
                        toggleDeleteAllowLoginDrawer()
                        ShowAllAllowLoginList();
                    }
                })
                .catch((err) => {
                    setIsDeleteLoading(false)
                    message.error(err.response.msg);
                });
        } catch (error) {
            message.error(error);
            setIsDeleteLoading(false)
        }
    };

    const debounceSearch = useCallback(
        debounce((value) => {
            setSearchInput(value);
        }, 1000),
        []
    );

    const handleSearchChange = (e) => {
        debounceSearch(e.target.value);
    };

    return (
        <>
            <section className="main_Section">
                <Breadcrumb
                    items={[
                        {
                            title: <a style={{ textDecoration: 'none' }} href="/dashboard">Dashboard</a>,
                        },
                        {
                            title: "Allow Login List",
                        },
                    ]}
                />
                <div className="content_title">
                    <div className="content_head">
                        <div className="content_title">
                            <Title level={4}>Allow Login List</Title>
                        </div>
                        <div className="content_add">
                            <Space>
                                <Form.Item name="Search Brand">
                                    <Input
                                        style={{ width: '220px' }}
                                        allowClear
                                        placeholder="Search User Name"
                                        suffix={<SearchOutlined />}
                                        onChange={handleSearchChange}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <AddUpdateAllowLogin ShowAllAllowLoginList={ShowAllAllowLoginList} />
                                </Form.Item>
                            </Space>
                        </div>
                    </div>
                    <div className="content">
                        <div className="shoo_recent_order">
                            {!isLoading ?
                                <div className="loader_main"><span class="loader2"></span></div>
                                :
                                <Table
                                    columns={columns}
                                    dataSource={allowLoginData}
                                    scroll={{ x: true }}
                                    pagination={false}
                                    footer={() =>
                                        <div className="pagination">
                                            <Pagination current={current} onChange={onChange} total={totalPage * 10} />
                                        </div>
                                    }
                                />
                            }
                        </div>
                    </div>
                </div>
            </section>

            {showDeleteDialog &&
                <DeleteModal
                    isOpen={showDeleteDialog}
                    onClose={toggleDeleteAllowLoginDrawer}
                    onDelete={deleteRestrictedLoginHandle}
                    item={selectedAllowLogin}
                    isBtnLoading={isDeleteLoading}
                    title='Allow Login'
                />
            }
        </>
    );
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default AllowLoginList
