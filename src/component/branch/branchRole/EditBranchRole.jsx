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
import { UpdateBranchRole } from "../../../service/api_services";
import { BranchRoutes } from "../../sidebar/SideBarRoute";

const EditBranchRole = ({ ShowBranchRole, editData }) => {
    const [open, setOpen] = useState(false);
    const { token } = useAuth()
    const [isLoading, setIsLoading] = useState("")
    const [accessKey, setAccessKey] = useState([])
    const [form] = Form.useForm();


    const showDrawer = () => {
        setOpen(true);
    };

    const cartClose = () => {
        setOpen(false);
    };



    const handleCheckboxChange = (checkedValues) => {
        setAccessKey(checkedValues);
        console.log("Selected:", checkedValues);
    };

    useEffect(() => {
        // setAccessKey(editData.permissions)
        form.setFieldsValue({
            name: editData.name,
            permissions: editData.permissions
        })
    }, [editData])

    console.log("accessKey", accessKey)
    const onFinish = async (value) => {
        setIsLoading(true)
        try {
            await UpdateBranchRole(token, { ...value, branchRoleAccessId: editData?.id })
                .then((res) => {
                    console.log("add vendor ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset()
                        setIsLoading(false)
                        ShowBranchRole()

                    } else if (res.status == 200) {
                        message.warning(res.data.message);
                        setIsLoading(false)

                    }

                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false)

                });
        } catch (error) {
            console.log(error);
            setIsLoading(false)

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

                <Button type="primary" disabled={editData.name === "BranchAdmin"} onClick={showDrawer} shape="round" >
                    Edit
                </Button>
            </div>
            <Drawer
                title="Edit Role "
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
                                    defaultValue={accessKey}
                                    onChange={handleCheckboxChange}
                                >
                                    <ul className="role_data">
                                        {BranchRoutes.slice(1).map((route, index) => (
                                            <li key={route.key}>
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

export default EditBranchRole