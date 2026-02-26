import React, { useEffect, useState } from "react";
import { Button, Drawer, Form, Input, Typography, message } from "antd";
import { Col } from "react-bootstrap";
import { useAuth } from "../../authentication/context/authContext";
import { AddRestrictedLoginData, EditRestrictedLogin } from "../../service/api_services";

const { Text } = Typography;

function AddUpdateAllowLogin({ record, ShowAllAllowLoginList }) {
    const { token } = useAuth()
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isAddLoading, setIsAddLoading] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onFinish = async (value) => {
        setIsAddLoading(true);

        try {
            if (record) {
                await EditRestrictedLogin({ ...value }, record._id, token)
                    .then((res) => {
                        if (res.status === 200) {
                            message.success(res.data.message);
                            setIsAddLoading(false);
                            setOpen(false);
                            onReset();
                            ShowAllAllowLoginList()
                        }
                    })
                    .catch((err) => {
                        message.error(err.message);
                        setIsAddLoading(false);
                    });
            } else {
                await AddRestrictedLoginData({ ...value }, token)
                    .then((res) => {
                        if (res.status == 201) {
                            message.success(res.data.message);
                            setIsAddLoading(false);
                            setOpen(false);
                            onReset();
                            ShowAllAllowLoginList()

                        } else if (res.status == 200) {
                            message.error(res.data.message);
                            setIsAddLoading(false);
                        }
                    })
                    .catch((err) => {
                        message.error(err.message);
                        setIsAddLoading(false);
                    });
            }
        } catch (error) {
            message.error(error);
            setIsAddLoading(false);
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    useEffect(() => {
        setIsLoading(true)
        if (record) {
            const formattedValues = {
                userName: record?.userName,
                userReference: record?.userReference,
                comments: record?.comments,
                phoneNumber: record?.phoneNumber,
            };
            form.setFieldsValue(formattedValues);
        }
        setIsLoading(false)
    }, [record, form]);

    return (
        <div className="modal_section">

            {record ?
                <Text onClick={showDrawer}>Edit</Text>
                :
                <Button
                    type="primary"
                    shape="round"
                    onClick={showDrawer}
                >
                    Add
                </Button>
            }

            <Drawer
                title={record ? "Update Allow Login" : "Add Allow Login"}
                placement="right"
                width={360}
                onClose={onClose}
                open={open}
            >
                <div className="add_category_form">
                    {isLoading ?
                        <div className="loader_main"><span class="loader2"></span></div>
                        :
                        <Form
                            form={form}
                            layout="vertical"
                            name="add-image"
                            className="images"
                            initialValues={{
                                code: "CN",
                            }}
                            onFinish={onFinish}
                        >
                            <Col md={12}>
                                <Form.Item
                                    label="User Name"
                                    name="userName"
                                    rules={[{ required: true, message: "Please Enter User Name" }]}
                                >
                                    <Input placeholder="Enter User Name" />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="User Reference"
                                    name="userReference"
                                    rules={[{ required: true, message: "Please Enter User Reference" }]}
                                >
                                    <Input placeholder="Enter User Reference" />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Comments"
                                    name="comments"
                                    rules={[{ required: true, message: "Please Enter Comments" }]}
                                >
                                    <Input placeholder="Enter Comments" />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Phone Number"
                                    name="phoneNumber"
                                    rules={[
                                        { required: true, message: "Please Enter Phone Number" },
                                        { pattern: /^[0-9]*$/, message: "Please Enter only Numbers!" },
                                        { len: 10, message: "Phone number must be exactly 10 digits" },
                                    ]}
                                >
                                    <Input maxLength={10} placeholder="Enter Phone Number" />
                                </Form.Item>
                            </Col>
                            <div className="model_Submit">
                                <Button
                                    onClick={onClose}
                                    shape="round"
                                    danger
                                    disabled={isAddLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    htmlType="submit"
                                    shape="round"
                                    disabled={isAddLoading}
                                >
                                    {record ? "Update" : "Submit"}
                                </Button>
                            </div>
                        </Form>
                    }
                </div>
            </Drawer>
        </div>
    );
}

export default AddUpdateAllowLogin