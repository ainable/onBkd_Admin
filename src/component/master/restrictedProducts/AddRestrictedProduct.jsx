import React, { useState } from "react";
import { Button, Form, Modal, Typography, message, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../../authentication/context/authContext";
import ProductSelect from "../../banner/ProductSelect";
import { createRestrictedProduct } from "../../../service/api_services";

const { Title } = Typography;

function AddRestrictedProduct({ ShowAllProductsList }) {
    const { token } = useAuth();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
        form.resetFields();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);

            const formattedValues = {
                ...values,
            };

            const response = await createRestrictedProduct(formattedValues, token);

            if (response.status === 201 || response.status === 200) {
                message.success(response.data.message || "Product restricted list added successfully!");
                ShowAllProductsList()
                setIsModalOpen(false);
                form.resetFields();
            } else {
                message.error(response.data.message || "Failed to create referral reward");
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to create referral reward");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
                Add Restricted Product
            </Button>

            <Modal
                title={<Title level={4}>Add Restricted Product</Title>}
                open={isModalOpen}
                onCancel={handleCancel}
                width={800}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <ProductSelect />
                        </Col>
                    </Row>

                    <Form.Item>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <Button onClick={handleCancel} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Add Restricted Product
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default AddRestrictedProduct;