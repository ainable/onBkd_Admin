import React, { useEffect, useState } from "react";
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
import { AddNewDiscountData, DISCOUNTYPE, EditDiscount, fetchDiscountDetails } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";



function AddNewDiscount({ discountId, ShowAllDiscountList }) {
    const { token } = useAuth()
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [discountType, setDiscountType] = useState(null)
    const [discountDetails, setDiscountDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isAddLoading, setIsAddLoading] = useState(false);

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
        const payload = {
            ...value,
            startDate: value.startDate?.format("DD/MM/YYYY"),
            expiredDate: value.expiredDate?.format("DD/MM/YYYY"),
            ...(discountId && { discountId: discountId })
        };

        setIsAddLoading(true)
        try {
            if (discountId) {
                await EditDiscount(payload, token)
                    .then((res) => {
                        if (res.status === 201) {
                            message.success(res.data.message);
                            setIsAddLoading(false);
                            setOpen(false);
                            onReset();
                            ShowAllDiscountList()
                        }
                    })
                    .catch((err) => {
                        message.error(err.message);
                        setIsAddLoading(false);
                    });
            } else {
                await AddNewDiscountData(payload, token)
                    .then((res) => {
                        if (res.status == 201) {
                            message.success(res.data.message);
                            setIsAddLoading(false);
                            setOpen(false);
                            onReset();
                            ShowAllDiscountList()

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

    const DiscountDetails = async (discountId) => {
        setIsLoading(true);
        try {
            const res = await fetchDiscountDetails(discountId, token);
            if (res.status === 200) {
                setDiscountDetails(res.data.data);
                setIsLoading(false);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (discountId) {
            DiscountDetails(discountId)
        }
    }, [discountId])

    useEffect(() => {
        if (discountDetails) {
            const formattedValues = {
                ...discountDetails,
                startDate: discountDetails.startDate ? moment(discountDetails.startDate, "DD/MM/YYYY", true) : null,
                expiredDate: discountDetails.expiredDate ? moment(discountDetails.expiredDate, "DD/MM/YYYY", true) : null,
            };
            form.setFieldsValue(formattedValues);
            setDiscountType(discountDetails?.discountType);
        }
    }, [discountDetails, form]);

    return (
        <div className="modal_section">
            {discountId ?
                <Button
                    type="primary"
                    shape="round"
                    onClick={showDrawer}
                >
                    Edit
                </Button>
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
                title={`${discountId ? 'Edit' : 'Add New'} Discount`}
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
                                        {DISCOUNTYPE.map((opt) => (
                                            <Select.Option key={opt.key} value={opt.values}>{opt.label}</Select.Option>
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
                                    <DatePicker format="DD/MM/YYYY" disabledDate={disabledDate} style={{ width: "100%" }} />
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
                                    <DatePicker format="DD/MM/YYYY" disabledDate={disabledDate} style={{ width: "100%" }} />
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
                                    {discountId ? "Update" : "Submit"}
                                </Button>
                            </div>
                        </Form>
                    }
                </div>
            </Drawer>
        </div>
    );
}



export default AddNewDiscount