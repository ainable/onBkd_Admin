import React, { useState } from "react";
import {
    Button,
    DatePicker,
    Drawer,
    Form,
    Input,
    Select,
    Space,
    Upload,
    message,
} from "antd";
import { Row, Col } from "react-bootstrap";
import moment from "moment";
import { AddNewDiscountData, DiscountType } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";



function AddNewDiscount({ ShowAllDiscountList }) {
    const { token } = useAuth()
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [validDate, setValidDate] = useState(null)
    const [expDate, setExpDate] = useState(null)
    const [discountType, setDiscountType] = useState(null)

    const startDeteHandle = (date, dateString) => {
        console.log("stringDate", dateString)
        setValidDate(dateString)
    }
    const endDeteHandle = (date, dateString) => {
        console.log("stringDate", dateString)
        setExpDate(dateString)

    }

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

        try {
            await AddNewDiscountData({ ...value, startDate: validDate, expiredDate: expDate }, token)
                .then((res) => {
                    console.log(" add new discount", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset();
                        ShowAllDiscountList()

                    } else if (res.status == 200) {
                        message.error(res.data.message);
                    }
                })
                .catch((err) => {
                    message.error(err.message);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    const validateMaxLength = (_, value) => {
        if (value && value > 100) {
            return Promise.reject(new Error('Please Enter Valid % value less then 100 !'));
        }
        return Promise.resolve();
    };

    const disabledDate = (current) => {
        // Disable dates before today
        return current && current < moment().startOf('day');
    };


    return (
        <div className="modal_section">

            <Button
                type="primary"
                shape="round"
                onClick={showDrawer}
            >
                Add
            </Button>

            <Drawer
                title="Add New Discount"
                placement="right"
                width={360}
                onClose={onClose}
                open={open}
            >
                <div className="add_category_form">
                    <Form
                        form={form}
                        layout="vertical"
                        name="add-image"
                        className="images"
                        initialValues={{
                            code: "CN",
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Col md={12}>
                            <Form.Item
                                label="Discount Code"
                                name="discountCode"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Discount Code",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter Discount Code" />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label="Discount Name"
                                name="discountName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Discount Name",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter Discount Name" />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label="Discount Type"
                                name="discountType"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Discount Type",
                                    },
                                ]}
                            >
                                <Select placeholder="Select Discount Type" onChange={(value) => setDiscountType(value)}>
                                    {DiscountType.map((opt) => (
                                        <Select.Option key={opt.key} value={opt.values}>{opt.values}</Select.Option>
                                    ))}

                                </Select>
                            </Form.Item>
                        </Col>
                        {discountType != "FLAT" ? <Col md={12}>
                            <Form.Item
                                label="Discount Value"
                                name="discountValue"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Discount Value",
                                    },
                                    {
                                        pattern: /^[0-9]*$/,
                                        message: 'Please Enter only Numbers!',
                                    },
                                    { validator: validateMaxLength }
                                ]}
                            >
                                <Input placeholder="Enter Discount Value" suffix="%" />
                            </Form.Item>
                        </Col> : <Col md={12}>
                            <Form.Item
                                label="Discount Value"
                                name="discountValue"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Discount Value",
                                    },
                                    {
                                        pattern: /^[0-9]*$/,
                                        message: 'Please Enter only Numbers!',
                                    },
                                    // { validator: validateMaxLength }
                                ]}
                            >
                                <Input placeholder="Enter Discount Value" suffix="₹" />
                            </Form.Item>
                        </Col>}

                        <Col md={12}>
                            <Form.Item
                                label="Start Date"
                                name="startDate"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please choose  Start date",
                                    },

                                ]}
                            >
                                <DatePicker onChange={startDeteHandle} format="DD/MM/YYYY" disabledDate={disabledDate} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label="Expire  Date"
                                name="expiredDate"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please choose  Expire date",
                                    },
                                ]}
                            >
                                <DatePicker format="DD/MM/YYYY" onChange={endDeteHandle} disabledDate={disabledDate} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label="Minimum Cart Amount"
                                name="minCartAmount"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Min Cart Amount",
                                    },
                                    {
                                        pattern: /^[0-9]*$/,
                                        message: 'Please Enter only Numbers!',
                                    },
                                ]}
                            >
                                <Input placeholder="Enter Min. cart Amount" />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label="Usage Limit Per User"
                                name="usageLimitPerUser"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter use Limit Per User",
                                    },
                                    {
                                        pattern: /^[0-9]*$/,
                                        message: 'Please Enter only Numbers!',
                                    },
                                ]}
                            >
                                <Input placeholder="Enter Usage Limit Per User" />
                            </Form.Item>
                        </Col>
                        <div className="model_Submit">
                            <Button onClick={onClose} shape="round" danger>
                                Cancel
                            </Button>
                            <Button
                                htmlType="submit"
                                shape="round"
                            >
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>
            </Drawer>
        </div>
    );
}



export default AddNewDiscount