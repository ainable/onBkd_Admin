import React, { useEffect, useState } from "react";
import { Button, DatePicker, Drawer, Form, Input, Select, Typography, message } from "antd";
import { Col } from "react-bootstrap";
import moment from "moment";
import { AddNewCouponData, Discount, DiscountType, EditCoupon, EligibleCustomer, EligibleCustomerType, fetchAllUserList, fetchCouponDetails } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";

const { Text } = Typography;

function AddNewCoupon({ couponId, ShowAllCouponList }) {
    const { token } = useAuth()
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [discountType, setDiscountType] = useState(null)
    const [eligibilityType, setEligibilityType] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [isAddLoading, setIsAddLoading] = useState(false);
    const [userData, setUserData] = useState([]);
    const [validFromDate, setValidFromDate] = useState(null);
    const [couponDetails, setCouponDetails] = useState({});

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onFinish = async (value) => {
        const formattedStartDate = value.validFrom?.format("YYYY-MM-DD");
        const formattedEndDate = value.validTo?.format("YYYY-MM-DD");
        setIsAddLoading(true);

        try {
            if (couponId) {
                await EditCoupon({ ...value, validFrom: formattedStartDate, validTo: formattedEndDate, }, couponId, token)
                    .then((res) => {
                        if (res.status === 200) {
                            message.success(res.data.message);
                            setIsAddLoading(false);
                            setOpen(false);
                            onReset();
                            ShowAllCouponList()
                        }
                    })
                    .catch((err) => {
                        message.error(err.message);
                        setIsAddLoading(false);
                    });
            } else {
                await AddNewCouponData({ ...value, validFrom: formattedStartDate, validTo: formattedEndDate, }, token)
                    .then((res) => {
                        if (res.status == 201) {
                            message.success(res.data.message);
                            setIsAddLoading(false);
                            setOpen(false);
                            onReset();
                            ShowAllCouponList()

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
        return current && current < moment().startOf('day');
    };

    const current = 1
    const items = 10000
    const fetchAllUsers = async () => {
        try {
            const res = await fetchAllUserList(token, current, items);
            if (res.status === 200) {
                setUserData(res.data.data.data);
                setIsLoading(true);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            setIsLoading(true);
        }
    };

    useEffect(() => {
        fetchAllUsers()
    }, [])

    const CouponDetails = async (couponId) => {
        try {
            const res = await fetchCouponDetails(couponId, token);
            if (res.status === 200) {
                setCouponDetails(res.data.data);
                setIsLoading(true);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            setIsLoading(true);
        }
    };

    useEffect(() => {
        if (couponId) {
            CouponDetails(couponId)
        }
    }, [couponId])

    useEffect(() => {
        if (couponDetails) {
            const formattedValues = {
                ...couponDetails,
                validFrom: couponDetails.validFrom ? moment(couponDetails.validFrom) : null,
                validTo: couponDetails.validTo ? moment(couponDetails.validTo) : null,
                users: couponDetails.users ? couponDetails.users.map(user => user._id) : [],
            };
            form.setFieldsValue(formattedValues);
            setDiscountType(couponDetails?.discountType)
            setEligibilityType(couponDetails?.eligibleCustomerType)
        }
    }, [couponDetails, form]);

    return (
        <div className="modal_section">

            {couponId ?
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
                title={couponId ? "Update Coupon" : "Add New Coupon"}
                placement="right"
                width={360}
                onClose={onClose}
                open={open}
            >
                <div className="add_category_form">
                    {!isLoading ?
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
                                    label="Coupon Code"
                                    name="couponCode"
                                    rules={[{ required: true, message: "Please Enter Coupon Code" }]}
                                >
                                    <Input placeholder="Enter Coupon Code" />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Eligible Customer"
                                    name="eligibleCustomerType"
                                    rules={[{ required: true, message: "Please Select Eligible Customer Type" }]}
                                >
                                    <Select
                                        placeholder="Select Eligible Customer Type"
                                        onChange={(value) => setEligibilityType(value)}
                                    >
                                        {EligibleCustomerType.map((opt) => (
                                            <Select.Option key={opt.key} value={opt.values}>{opt.label}</Select.Option>
                                        ))}

                                    </Select>
                                </Form.Item>
                            </Col>
                            {eligibilityType === EligibleCustomer.SELECTED_USERS && <Col md={12}>
                                <Form.Item
                                    label="Users"
                                    name="users"
                                    rules={[{ required: true, message: "Please Select Users" }]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select Users"
                                    >
                                        {userData.map((opt) => (
                                            <Select.Option key={opt.key} value={opt._id}>{opt.fullName}</Select.Option>
                                        ))}

                                    </Select>
                                </Form.Item>
                            </Col>}
                            <Col md={12}>
                                <Form.Item
                                    label="Discount Type"
                                    name="discountType"
                                    rules={[{ required: true, message: "Please Enter Discount Type" }]}
                                >
                                    <Select
                                        placeholder="Select Discount Type"
                                        onChange={(value) => setDiscountType(value)}
                                    >
                                        {DiscountType.map((opt) => (
                                            <Select.Option key={opt.key} value={opt.values}>{opt.label}</Select.Option>
                                        ))}

                                    </Select>
                                </Form.Item>
                            </Col>
                            {discountType === Discount.DISCOUNT && <Col md={12}>
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
                            </Col>}
                            {discountType === Discount.CASHBACK && <Col md={12}>
                                <Form.Item
                                    label="Cashback Value"
                                    name="discountValue"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Cashback Value",
                                        },
                                        {
                                            pattern: /^[0-9]*$/,
                                            message: 'Please Enter only Numbers!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter Cashback Value" suffix="₹" />
                                </Form.Item>
                            </Col>}
                            {discountType === Discount.FREE_DELIVERY && <Col md={12}>
                                <Form.Item
                                    label="Free Delivery"
                                    name="discountValue"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Free Deliverys Count",
                                        },
                                        {
                                            pattern: /^[0-9]*$/,
                                            message: 'Please Enter only Numbers!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter Free Deliverys Count" />
                                </Form.Item>
                            </Col>}
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
                                    label="Usage Limit"
                                    name="usageLimit"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Usage Limit",
                                        },
                                        {
                                            pattern: /^[0-9]*$/,
                                            message: 'Please Enter only Numbers!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter Usage Limit" />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Valid From"
                                    name="validFrom"
                                    rules={[{ required: true, message: "Please choose Valid From" }]}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        disabledDate={disabledDate}
                                        style={{ width: "100%" }}
                                        onChange={(date) => setValidFromDate(date)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Valid To"
                                    name="validTo"
                                    rules={[{ required: true, message: "Please choose Valid To" }]}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        style={{ width: "100%" }}
                                        disabledDate={(current) =>
                                            current &&
                                            (current < moment().startOf("day") ||
                                                (validFromDate && current < validFromDate.startOf("day")))
                                        }
                                    />
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
                                    {couponId ? "Update" : "Submit"}
                                </Button>
                            </div>
                        </Form>
                    }
                </div>
            </Drawer>
        </div>
    );
}

export default AddNewCoupon