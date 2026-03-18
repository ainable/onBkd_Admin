import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Typography, message, Row, Col, AutoComplete, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../../authentication/context/authContext";
import ProductSelect from "../../banner/ProductSelect";
import { createRestrictedProduct, fetchAllBranchList } from "../../../service/api_services";
import { capitalize } from "lodash";

const { Title } = Typography;

function AddRestrictedProduct({ ShowAllProductsList }) {
    const { token } = useAuth();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [vendrList, setVendorList] = useState([])

    const selectedProduct = Form.useWatch("navigateToId", form);

    const showAllBranchList = async () => {
        try {
            await fetchAllBranchList(token)
                .then((res) => {
                    console.log(" branch list", res);
                    if (res.status == 200) {
                        setVendorList(res.data.data.data)

                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
        }
    }



    const showModal = () => {
        setIsModalOpen(true);
        showAllBranchList()
        form.resetFields();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const onFinish = async (values) => {
        const payload = {
            ...values,
            branchId: values.branchId,
        };
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

    const handleBranchChange = (values) => {
        const allIds = vendrList.map((b) => b._id);

        if (values.includes("ALL")) {
            const isAllSelected = values.length === allIds.length + 1;

            form.setFieldsValue({
                branchId: isAllSelected ? [] : allIds,
            });
        }
    };

    useEffect(() => {
        form.setFieldsValue({ branchId: [] });
    }, [selectedProduct]);

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
                        {/* {selectedProduct &&
                            <Col span={24}>
                                <Form.Item
                                    label="Select Branch"
                                    name="branchId"
                                    rules={[{ required: true, message: "Please select branch" }]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select Branch"
                                        showSearch
                                        optionFilterProp="label"
                                        onChange={(values) => handleBranchChange(values)}
                                        options={[
                                            {
                                                label: "Select All Branches",
                                                value: "ALL",
                                            },
                                            ...vendrList.map((item) => ({
                                                label: `${item.branchCode}-${capitalize(item.branchName)}`,
                                                value: item._id,
                                            })),
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        } */}
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