import React, { useState } from "react";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Radio,
    Select,
    Typography,
    message,
    Row,
    Col,
    Card
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createReferralReward } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

function AddReferralReward({ showAllReferralRewards }) {
    const { token } = useAuth();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rewardType, setRewardType] = useState("FREE_DELIVERIES");

    const showModal = () => {
        setIsModalOpen(true);
        form.resetFields();
        setRewardType("FREE_DELIVERIES");
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleRewardTypeChange = (value) => {
        setRewardType(value);
        // Clear type-specific fields when type changes
        if (value === "FREE_DELIVERIES") {
            form.setFieldsValue({
                discountPercentage: undefined,
                minOrderAmount: undefined,
                referralUserRewardCount: 1
            });
        } else {
            form.setFieldsValue({
                freeDeliveryCount: undefined,
                referralUserRewardCount: 1
            });
        }
    };

    // Handle expiry date change - auto calculate days
    const handleExpiryDateChange = (date) => {
        if (date) {
            const currentDate = dayjs();
            const selectedDate = dayjs(date);
            const daysDifference = selectedDate.diff(currentDate, 'day');

            // Update expiry days field
            form.setFieldsValue({
                expiryDays: daysDifference > 0 ? daysDifference : 1
            });
        }
    };

    // Handle expiry days change - auto calculate date
    const handleExpiryDaysChange = (days) => {
        if (days && days > 0) {
            const futureDate = dayjs().add(days, 'day');

            // Update expiry date field
            form.setFieldsValue({
                expiryDate: futureDate
            });
        }
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);

            // Format the expiry date
            const formattedValues = {
                ...values,
                expiryDate: values.expiryDate ? dayjs(values.expiryDate).format('YYYY-MM-DD') : null,
            };

            // Remove fields that are not relevant for the selected reward type
            if (rewardType === "FREE_DELIVERIES") {
                delete formattedValues.discountPercentage;
                delete formattedValues.minOrderAmount;
            } else {
                delete formattedValues.freeDeliveryCount;
            }

            const response = await createReferralReward(formattedValues, token);

            if (response.status === 201 || response.status === 200) {
                message.success(response.data.message || "Referral reward created successfully!");
                setIsModalOpen(false);
                form.resetFields();
                showAllReferralRewards();
            } else {
                message.error(response.data.message || "Failed to create referral reward");
            }
        } catch (error) {
            console.error("Create referral reward error:", error);
            message.error(error.response?.data?.message || "Failed to create referral reward");
        } finally {
            setLoading(false);
        }
    };

    const validateDiscountPercentage = (_, value) => {
        if (rewardType === "DISCOUNTS") {
            if (!value) {
                return Promise.reject(new Error('Discount percentage is required for discount type'));
            }
            if (value < 0 || value > 100) {
                return Promise.reject(new Error('Discount percentage must be between 0 and 100'));
            }
        }
        return Promise.resolve();
    };

    const validateFreeDeliveryCount = (_, value) => {
        if (rewardType === "FREE_DELIVERIES") {
            if (!value) {
                return Promise.reject(new Error('Free delivery count is required for free delivery type'));
            }
            if (value < 1) {
                return Promise.reject(new Error('Free delivery count must be at least 1'));
            }
        }
        return Promise.resolve();
    };

    const validateMinOrderAmount = (_, value) => {
        if (rewardType === "DISCOUNTS") {
            if (!value) {
                return Promise.reject(new Error('Minimum order amount is required for discount type'));
            }
            if (value < 0) {
                return Promise.reject(new Error('Minimum order amount must be positive'));
            }
        }
        return Promise.resolve();
    };

    const validateMaxOrderLimit = (_, value) => {
        if (value && value < 1) {
            return Promise.reject(new Error('Max order limit must be at least 1'));
        }
        return Promise.resolve();
    };

    const validateRewardCounts = (_, value) => {
        if (value && value < 0) {
            return Promise.reject(new Error('Reward count cannot be negative'));
        }
        return Promise.resolve();
    };

    const validateExpiryDays = (_, value) => {
        if (value && value < 1) {
            return Promise.reject(new Error('Expiry days must be at least 1'));
        }
        return Promise.resolve();
    };

    return (
        <>
            <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
                Add New Referral Reward
            </Button>

            <Modal
                title={<Title level={4}>Add New Referral Reward</Title>}
                open={isModalOpen}
                onCancel={handleCancel}
                width={800}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        rewardType: "FREE_DELIVERIES",
                        referralUserRewardCount: 1,
                        expiryDays: 30,
                        expiryDate: dayjs().add(30, 'day')
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="rewardName"
                                label="Reward Name"
                                rules={[
                                    { required: true, message: "Please enter reward name" },
                                    { min: 3, message: "Reward name must be at least 3 characters" }
                                ]}
                            >
                                <Input placeholder="Enter reward name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="rewardType"
                                label="Reward Type"
                                rules={[{ required: true, message: "Please select reward type" }]}
                            >
                                <Select
                                    placeholder="Select reward type"
                                    onChange={handleRewardTypeChange}
                                >
                                    <Select.Option value="FREE_DELIVERIES">Free Deliveries</Select.Option>
                                    <Select.Option value="DISCOUNTS">Discounts</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="rewardDescription"
                        label="Description"
                        rules={[
                            { required: true, message: "Please enter description" },
                            { min: 10, message: "Description must be at least 10 characters" }
                        ]}
                    >
                        <TextArea rows={3} placeholder="Enter reward description" />
                    </Form.Item>

                    {/* Conditional fields based on reward type */}
                    {rewardType === "FREE_DELIVERIES" && (
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="freeDeliveryCount"
                                    label="Free Delivery Count"
                                    rules={[{ validator: validateFreeDeliveryCount }]}
                                >
                                    <InputNumber
                                        min={1}
                                        style={{ width: "100%" }}
                                        placeholder="Enter free delivery count"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="referralUserRewardCount"
                                    label="Referral Free Delivery Count"
                                    rules={[
                                        { required: true, message: "Please enter referral free delivery count" },
                                        { validator: validateRewardCounts }
                                    ]}
                                >
                                    <InputNumber
                                        min={1}
                                        style={{ width: "100%" }}
                                        placeholder="Enter referral free delivery count"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    {rewardType === "DISCOUNTS" && (
                        <>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="discountPercentage"
                                        label="Discount Percentage (%)"
                                        rules={[{ validator: validateDiscountPercentage }]}
                                    >
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            style={{ width: "100%" }}
                                            placeholder="Enter discount percentage"
                                            addonAfter="%"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="referralUserRewardCount"
                                        label="Referral Discount Percentage (%)"
                                        rules={[
                                            { required: true, message: "Please enter referral discount percentage" },
                                            { validator: validateDiscountPercentage }
                                        ]}
                                    >
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            style={{ width: "100%" }}
                                            placeholder="Enter referral discount percentage"
                                            addonAfter="%"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="minOrderAmount"
                                        label="Minimum Order Amount (₹)"
                                        rules={[{ validator: validateMinOrderAmount }]}
                                    >
                                        <InputNumber
                                            min={0}
                                            style={{ width: "100%" }}
                                            placeholder="Enter minimum order amount"
                                            addonBefore="₹"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    )}

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="maxOrderLimit"
                                label="Max Order Limit"
                                rules={[{ validator: validateMaxOrderLimit }]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: "100%" }}
                                    placeholder="Enter max order limit"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="expiryDays"
                                label="Expiry Days"
                                rules={[
                                    { required: true, message: "Please enter expiry days" },
                                    { validator: validateExpiryDays }
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: "100%" }}
                                    placeholder="Enter expiry days"
                                    onChange={handleExpiryDaysChange}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="expiryDate"
                        label="Expiry Date"
                        rules={[{ required: true, message: "Please select expiry date" }]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            placeholder="Select expiry date"
                            disabledDate={(current) => current && current < dayjs().endOf('day')}
                            onChange={handleExpiryDateChange}
                        />
                    </Form.Item>

                    <Form.Item
                        name="terms"
                        label="Terms and Conditions"
                    >
                        <TextArea rows={4} placeholder="Enter terms and conditions (optional)" />
                    </Form.Item>

                    <Form.Item>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Create Reward
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default AddReferralReward;