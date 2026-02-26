import React, { useEffect, useState } from "react";
import {

    AutoComplete,
    Button,
    Card,

    Drawer,
    Form,
    Input,

    Upload,
    message,
} from "antd";

import { Col, Row } from "react-bootstrap"

import { useAuth } from "../../authentication/context/authContext";
import { UpdateVendor } from "../../service/api_services";
const EditVendor = ({ showAllVendorList, vendorId }) => {
    const [open, setOpen] = useState(false);
    const { token } = useAuth()
    const [isLoading, setIsLoading] = useState("")
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


    const [form] = Form.useForm();


    const showDrawer = () => {
        setOpen(true);
    };

    const cartClose = () => {
        setOpen(false);
    };





    const onFinish = async (value) => {
        setIsLoading(true)
        try {
            await UpdateVendor(token, { ...value, vendorId: vendorId })
                .then((res) => {
                    console.log("add vendor ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset()
                        setIsLoading(false)

                        showAllVendorList()
                    } else if (res.status == 200) {
                        message.warning(res.data.message);
                        setIsLoading(false)

                    }

                })
                .catch((err) => {
                    console.log(err);
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
                <span onClick={showDrawer}  >
                    Edit
                </span>
            </div>
            <Drawer
                title="Add Vehicle Number"
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
                                label="Enter Vehicle No."
                                name="vehicleNo"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Vehicle No.",
                                    },
                                ]}
                                normalize={(value) => value?.toUpperCase()}
                            >
                                <Input placeholder="Enter Vehicle No." />
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



export default EditVendor