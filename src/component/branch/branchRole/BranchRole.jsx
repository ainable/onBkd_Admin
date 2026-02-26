import { Button, Card, Collapse, Form, Input, message, Popconfirm, Segmented, Spin, Switch, Tabs, Typography } from "antd";
import "../../../style/master.css";

import { Space, Table, Tag } from "antd";
import { useState } from "react";
import { useEffect } from "react";
// import AdminRoleProvide from "./AdminRoleProvide";
// import CreateAdmin from "./CreateAdmin";
import { BranchRoleDelete, fetchBranchRole } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";
import AddBranchRoleAccess from "./AddBranchRoleAccess";
import EditBranchRole from "./EditBranchRole";



function BranchRole() {
    const { Title } = Typography
    const { token, logout } = useAuth()
    const [accessKeyData, setAccessKeyData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const columns = [

        {
            title: "Role",
            dataIndex: "rolename",
            key: "roleNameId",
            render: (rolename) => <span>{rolename || "N/A"}</span>,
        },
        {
            title: "Permissions ",
            dataIndex: "permissions",
            key: "permissions",
            render: (permissions) => (
                <>
                    {permissions?.length === 0 ? "All" : <ul>{permissions?.map((item) => <li>{item}</li>)}</ul>}
                </>
            )
        },
        {
            title: "Created At",
            dataIndex: "addedDate",
            key: "addedDate",
            render: (_, { addedDate }) => (
                <>{addedDate}</>
            ),
        },


        // {
        //   title: "Status",
        //   key: "status",
        //   dataIndex: "status",
        //   render: (_, { status }) => (
        //     <>{status}</>
        //   ),
        // },
        {
            title: "Action",
            key: "status",
            dataIndex: "status",
            render: (_, { permissions, rolename, _id }) => (
                <Space>
                    <EditBranchRole ShowBranchRole={ShowBranchRole} editData={{ permissions: permissions, name: rolename, id: _id }} />
                    <Popconfirm
                        title="Delete the role"
                        description="Are you sure to delete this role?"
                        onConfirm={() => handleUserRoleDelete(_id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger shape="round" disabled={rolename === "BranchAdmin"}>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },


    ];

    const cancel = e => {
        console.log(e);
        message.error('Click on No');
    };


    const handleUserRoleDelete = async (id) => {
        setIsDeleted(true)
        const body = {
            branchRoleAccessId: id,
        }
        try {
            const res = await BranchRoleDelete(body, token);
            if (res.status === 201) {
                message.success(res.data.message);
                ShowBranchRole();
                setIsDeleted(false);
            }
        } catch (error) {
            console.log(error);
            setIsDeleted(false);
            message.error(error.response.data.message)

        }
    };




    const ShowBranchRole = async () => {
        setIsLoading(true)
        try {
            await fetchBranchRole(token)
                .then((res) => {
                    console.log("branch role list", res);
                    if (res.status == 200) {
                        setAccessKeyData(res.data.data);
                        setIsLoading(false);
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()
                    }
                })

                .catch((err) => {
                    console.log(err.response.msg);
                    setIsLoading(false);

                });
        } catch (error) {
            console.log(error);
            setIsLoading(false);

        }
    };
    useEffect(() => {
        ShowBranchRole()
    }, [])




    // const items = [

    //     {
    //         key: '1',
    //         label: <h5>Role List</h5>,
    //         children: <Card title={<div className="text-end">
    //             {/* <AddRole ShowAllRoleList={ShowAllRoleList} /> */}
    //         </div>}>
    //             {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={rolecolumns} dataSource={roleData} scroll={{ x: true }} />}
    //         </Card>
    //     },

    //     {
    //         key: '2',
    //         label: <h5>Access Keys</h5>,
    //         children: <Card title={<div className="text-end">
    //             {/* <AdminRoleProvide ShowAdminAccessKeyList={ShowAdminAccessKeyList} /> */}
    //         </div>}>
    //             {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={columns} dataSource={accessKeyData} pagination={false} scroll={{ x: true }} />}
    //         </Card>,
    //     },
    //     {
    //         key: '3',
    //         label: <h5>Admin User</h5>,
    //         children: <Card title={<div className="text-end">
    //             {/* <CreateAdmin ShowAdminUserList={ShowAdminUserList} accessKeyData={accessKeyData} roleData={accessKeyData} /> */}
    //         </div>}>
    //             <Table columns={adminColumns} dataSource={adminUserList} scroll={{ x: true }} />
    //         </Card>,
    //     },
    // ];


    return (
        <section className="container">
            <div className="content_head">
                <Title level={4}>Branch Role</Title>
                <AddBranchRoleAccess ShowAdminAccessKeyList={ShowBranchRole} />
            </div>
            <div className="content">
                {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                    //  <Tabs type="card" defaultActiveKey="1" items={items} onChange={onChange} />
                    <Table columns={columns} dataSource={accessKeyData} pagination={false} scroll={{ x: true }} />}
            </div>
        </section>
    );
}



export default BranchRole