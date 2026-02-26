import React, { useState } from "react";
import {
    Button,
    Col,
    Divider,
    Drawer,
    Form,
    Input,
    Radio,
    Select,
    Space,
    Upload,
    message,
} from "antd";

import "../../../style/location.css";
import { useAuth } from "../../../authentication/context/authContext";
import { cmsTyps, InsertFAQ } from "../../../service/api_services";

function AddFaq({ ShowAllFAQList }) {
    const { token } = useAuth()
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const onFinish = async (value) => {
        setIsLoading(true)
        try {
            await InsertFAQ(token,value)
                .then((res) => {
                    console.log(" add new Faq", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset();
                        ShowAllFAQList()
                        setIsLoading(false)

                    } else if (res.status == 200) {
                        message.error(res.data.message);
                    }
                })
                .catch((err) => {
                    message.error(err.message);
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

    return (
        <>
            <div className="Add_btn">
                <Button
                    type="primary"
                    onClick={showDrawer}
                    shape="round"
                >
                    Add
                </Button>
            </div>
            <Drawer
                title="Add New Faq"
                placement="right"
                // width={300}
                onClose={onClose}
                open={open}
            >
                <div className="add_category_form">
                    <Form
                        form={form}
                        layout="vertical"
                        name="add-image"
                        className="images"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Col md={24}>
                            <Form.Item
                                label="Select Faq Type"
                                name="for"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Select Faq",
                                    },
                                ]}
                            >
                                <Select placeholder="Select Faq Type">
                                    {cmsTyps.map((opt) => (
                                        <Select.Option key={opt.key} value={opt.values}>{opt.values}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={24}>
                            <Form.Item
                                label="Question"
                                name="question"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter  Question",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter Question" />
                            </Form.Item>
                        </Col>
                        <Col md={24}>
                            <Form.Item
                                label="Answer"
                                name="answer"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Answer",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter Answer" />
                            </Form.Item>
                        </Col>
                        <div className="add_address_btn">
                            <Space>

                                <Button shape="round" onClick={onClose} danger>
                                    Cancel
                                </Button>
                                <Button
                                    shape="round"
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                >
                                    Submit
                                </Button>
                            </Space>
                            
                        </div>
                    </Form>
                </div>
            </Drawer>
        </>
    );
}


export default AddFaq