import React, { useEffect, useState } from "react";
import {

    AutoComplete,
    Button,
    Card,

    Checkbox,

    Drawer,
    Form,
    Input,

    Select,

    Upload,
    message,
} from "antd";

import { Col, Row } from "react-bootstrap"
import "../../../style/master.css"
import { useAuth } from "../../../authentication/context/authContext";
import { AddBranchRole, AddRoleAccessKey, RoleTypes, branchRoleType, fetchAllBranchList, fetchAllRoles, fetchBranchRole } from "../../../service/api_services";
import routes, { BranchRoutes } from "../../sidebar/SideBarRoute";

// import routes from "../../component/sidebar/SideBarRoute";



const AddBranchRoleAccess = ({ ShowAdminAccessKeyList }) => {
    const [open, setOpen] = useState(false);
    const { token, logout } = useAuth()
    const [isLoading, setIsLoading] = useState("")
    const [form] = Form.useForm();

    const showDrawer = () => {
        setOpen(true);
    };

    const cartClose = () => {
        setOpen(false);
    };


    // const ShowAllRoleList = async () => {
    //     setIsLoading(true)
    //     try {
    //         await fetchBranchRole(token)
    //             .then((res) => {
    //                 console.log("role list ------------>new", res);
    //                 if (res.status == 200) {
    //                     setRoleData(res.data.data);
    //                     setIsLoading(false);
    //                 } else if (res.data.code == 283) {
    //                     message.error(res.data.message)
    //                     logout()
    //                 }
    //             })
    //             .catch((err) => {
    //                 console.log(err.response.msg);
    //                 setIsLoading(false);
    //             });
    //     } catch (error) {
    //         console.log(error);
    //         setIsLoading(false);
    //     }
    // };

    const onFinish = async (value) => {
        setIsLoading(true)
        try {
            await AddBranchRole(token, value)
                .then((res) => {
                    console.log("add vendor ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset()
                        setIsLoading(false)
                        ShowAdminAccessKeyList()
                    }
                })
                .catch((err) => {
                    message.warning(err.response.data.message);
                    console.log(err);
                }).finally(() => {
                    setIsLoading(false)

                })
        } catch (error) {
            console.log(error);

        }
    };

    const onReset = () => {
        form.resetFields();
    };
    const onFinishFailed = (value) => {
        console.log(value)
    }


    return (
        <>
            <div className="Add_Addre">
                <Button type="primary" onClick={showDrawer} shape="round" >
                    Add Role
                </Button>
            </div>
            <Drawer
                title="Add Role"
                onClose={cartClose}
                open={open}
                placement="right"
            >
                <div className="add_form">
                    <Form
                        form={form}
                        layout="vertical"
                        name="basic"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Col md={12}>
                            <Form.Item
                                label="Select Role"
                                name="rolename"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Select Role",
                                    },
                                ]}
                            >
                                <Select placeholder="Select Role Type">
                                    {branchRoleType.map((item) => (
                                        <Select.Option key={item._id} value={item.value}>{item.label}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label="Select Sidebar Pannel"
                                name="permissions"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select at least 1 access key",
                                    },
                                ]}
                            >

                                <Checkbox.Group

                                >
                                    <ul className="role_data">
                                        {BranchRoutes.slice(1).map((route, index) => (
                                            <li key={route.keys}>
                                                <h6>
                                                    <Checkbox value={route.persission} className="check_box" />
                                                    {route.label}
                                                </h6>
                                            </li>
                                        ))}
                                    </ul>
                                </Checkbox.Group>
                            </Form.Item>
                        </Col>

                        <Form.Item>
                            <div className="add_address_btn">
                                <Button loading={isLoading} type="primary" htmlType="submit" shape="round">
                                    Submit
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Drawer>
        </>
    );
};



export default AddBranchRoleAccess