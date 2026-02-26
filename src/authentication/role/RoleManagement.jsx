import { Button, Card, Collapse, Form, Input, message, Popconfirm, Segmented, Spin, Switch, Tabs } from "antd";
import React from "react";
import "../../style/master.css";

import { Space, Table, Tag } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import AdminRoleProvide from "./AdminRoleProvide";
import CreateAdmin from "./CreateAdmin";
import { AdminRoleAccessKey, AdminUserStatusAction, DeleteAdminRole, DeleteAdminUser, DeleteRoleAccess, fetchAdminUser, fetchAllRoles } from "../../service/api_services";
import EditRole from "./EditRole";
import { Col, Row } from "react-bootstrap";
import AddRole from "./AddRole";
import EditAdminUser from "./EditAdminUser";


function RoleManagement() {
  const { token, logout } = useAuth()
  const [accessKeyData, setAccessKeyData] = useState([]);
  const [adminUserList, setAdminUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [roleData, setRoleData] = useState([])
  const [isDelete, setIsDeleted] = useState(false)

  const columns = [

    {
      title: "Role",
      dataIndex: "roleNameId",
      key: "roleNameId",
      render: (roleNameId) => <span>{roleNameId?.roleName || "N/A"}</span>,
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
      render: (_, { permissions, roleNameId, _id }) => (
        <Space>
          <Popconfirm
            title="Delete the access"
            description="Are you sure to delete this access?"
            onConfirm={() => handleRoleAccessDelete(_id)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button danger shape="round" disabled={roleNameId?.roleName === "SuperAdmin"}>Delete</Button>
          </Popconfirm>
          <EditRole ShowAdminAccessKeyList={ShowAdminAccessKeyList} editData={{ permissions: permissions, name: roleNameId?.roleName, id: _id }} />
        </Space>
      ),
    },


  ];
  const rolecolumns = [

    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
      render: (roleName) => <span>{roleName}</span>,
      width: "40%"
    },
    {
      title: "Status ",
      dataIndex: "status",
      key: "status",
      width: "20%",

      render: (status) => <Tag color={status != "ACTIVE" ? "red" : "green"}>{status}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "addedDate",
      key: "addedDate",
      width: "40%",

      render: (_, { addedDate }) => (
        <>{addedDate}</>
      ),
    },

    {
      title: "Action",
      key: "status",
      dataIndex: "status",
      render: (_, { _id }) => (
        <Popconfirm
          title="Delete the Role"
          description="Are you sure to delete this role?"
          onConfirm={() => handleRoleDelete(_id)}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <Button danger shape="round">Delete</Button>
        </Popconfirm>
      ),
    },


  ];


  const adminColumns = [

    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      ellipsis: true,

    },
    {
      title: "Email ",
      dataIndex: "email",
      key: "email",

    },
    {
      title: "Password ",
      dataIndex: "password",
      key: "password",
      render: (_, { password }) => (
        <span>{password ? password : "N/A"}</span>
      ),
    },
    {
      title: "Role ",
      dataIndex: "roleName",
      key: "roleName",
      render: (_, { roleName }) => (
        <span>{roleName ? roleName : "N/A"}</span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "addedDate",
      key: "addedDate",
      render: (_, { addedDate }) => (
        <>{addedDate}</>
      ),
    },


    {
      title: "Status",
      key: "_id",
      dataIndex: "_id",
      render: (_, { status, isActive, _id }) => (
        <Space>

          <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
          <Switch
            // loading={isStatusLoading}
            checkedChildren={isActive}
            unCheckedChildren={isActive}
            checked={status == "ACTIVE"}
            onClick={() => statusHandle(isActive, _id)}
          />
        </Space>
      ),
    },
    {
      title: "Action",
      key: "_id",
      dataIndex: "_id",
      fixed: "right",
      render: (_, { roleId, password, email, fullName, _id, permissions }) => (
        <Space>
          <EditAdminUser ShowAdminUserList={ShowAdminUserList} editData={{ roleId: roleId, password: password, email: email, fullName: fullName, id: _id, permissions: permissions }} roleData={roleData} />
          <Popconfirm
            title="Delete the user"
            description="Are you sure to delete this user?"
            onConfirm={() => handleUserDelete(_id)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button danger shape="round">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },


  ];

  const statusHandle = async (isActive, _id) => {
    const body = {
      adminId: _id,
      isActive: !isActive,
    }

    try {
      await AdminUserStatusAction(body, token)
        .then((res) => {
          console.log(res);
          if (res.status == 201) {
            message.success(res.data.message);
            ShowAdminUserList()
          }
        })
        .catch((err) => {
          console.log(err)
          message.error(err.response.data.message)
        });
    } catch (error) {
      console.log(error);

    }
  };

  const ShowAllRoleList = async () => {
    setIsLoading(true)
    try {
      await fetchAllRoles(token)
        .then((res) => {
          console.log("role list", res);
          if (res.status == 200) {
            setRoleData(res.data.data);
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
    ShowAllRoleList()
  }, [isSelected])


  const ShowAdminAccessKeyList = async () => {
    setIsLoading(true)
    try {
      await AdminRoleAccessKey(token)
        .then((res) => {
          console.log("access key list", res);
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
    ShowAdminAccessKeyList()
  }, [isSelected])

  const ShowAdminUserList = async () => {
    setIsLoading(true)
    try {
      await fetchAdminUser(token)
        .then((res) => {
          console.log("admin user list-------", res);
          if (res.status == 200) {
            setAdminUserList(res.data.data);
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
    ShowAdminUserList()
  }, [isSelected])




  const onChange = key => {
    console.log(key);
    setIsSelected((pre) => pre)

  };
  const items = [

    {
      key: '1',
      label: <h5>Role List</h5>,
      children: <Card title={<div className="text-end">
        <AddRole ShowAllRoleList={ShowAllRoleList} />
      </div>}>
        {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={rolecolumns} dataSource={roleData} scroll={{ x: true }} />}
      </Card>
    },

    {
      key: '2',
      label: <h5>Access Keys</h5>,
      children: <Card title={<div className="text-end"><AdminRoleProvide ShowAdminAccessKeyList={ShowAdminAccessKeyList} /></div>}>
        {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={columns} dataSource={accessKeyData} pagination={false} scroll={{ x: true }} />}
      </Card>,
    },
    {
      key: '3',
      label: <h5>Admin User</h5>,
      children: <Card title={<div className="text-end">
        <CreateAdmin ShowAdminUserList={ShowAdminUserList} accessKeyData={accessKeyData} roleData={accessKeyData} /></div>}>
        <Table columns={adminColumns} dataSource={adminUserList} scroll={{ x: true }} />
      </Card>,
    },
  ];


  const handleRoleDelete = async (id) => {
    setIsDeleted(true)
    try {
      const res = await DeleteAdminRole({ roleNameId: id }, token);
      if (res.status === 201) {
        message.success(res.data.message);
        ShowAllRoleList();
        setIsDeleted(false);

      }
    } catch (error) {
      console.log(error);
      setIsDeleted(false);
      message.error(error.response.data.message)

    }
  };


  const handleUserDelete = async (id) => {
    setIsDeleted(true)
    const body = {
      adminId: id,
      isActive: true
    }
    try {
      const res = await DeleteAdminUser(body, token);
      if (res.status === 201) {
        message.success(res.data.message);
        ShowAdminUserList();
        setIsDeleted(false);
      }
    } catch (error) {
      console.log(error);
      setIsDeleted(false);
      message.error(error.response.data.message)

    }
  };


  const handleRoleAccessDelete = async (id) => {
    setIsDeleted(true)
    const body = {
      roleAccessId: id,
    }
    try {
      const res = await DeleteRoleAccess(body, token);
      if (res.status === 201) {
        message.success(res.data.message);
        ShowAdminAccessKeyList();
        setIsDeleted(false);
      }
    } catch (error) {
      console.log(error);
      message.error(error.response.data.message)
      setIsDeleted(false);
    }
  };

  const cancel = e => {
    console.log(e);
    message.error('Click on No');
  };

  return (
    <section className="container">

      <div className="content">
        {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Tabs type="card" defaultActiveKey="1" items={items} onChange={onChange} />}
      </div>
    </section>
  );
}



export default RoleManagement