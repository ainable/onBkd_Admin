import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Form, Modal, Select, Space, Typography, message } from "antd";
import '../../style/master.css'
import { AiOutlineSync } from "react-icons/ai";
import { elasticSyncBranch, elasticSyncProduct, fetchAllBranchList } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";




function ElasticSearchProduct() {
    const { form } = Form.useForm()

    const [isProduct, setIsProduct] = useState(false)
    const { token, logout } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBranch, setIsBranch] = useState(false);
    const [branchData, setBranchData] = useState([])

    const showModal = () => {
        setIsModalOpen(true);
        showAllBranchList()
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showAllBranchList = async () => {
        try {
            await fetchAllBranchList(token)
                .then((res) => {
                    console.log(" branch list", res);
                    if (res.status == 200) {
                        setBranchData(res.data.data.data)
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
        }
    }

    const handlleSyncProduct = async () => {
        setIsProduct(true)
        try {
            await elasticSyncProduct(token)
                .then((res) => {
                    console.log(" sync product ", res);
                    if (res.status === 201) {
                        message.success(res.data.message)
                        setIsProduct(false)

                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setIsProduct(false)

                });
        } catch (error) {
            console.log(error);
            setIsProduct(false)

        }
    };

    const onFinish = async (value) => {
        setIsBranch(true)
        try {
            await elasticSyncBranch(token, value)
                .then((res) => {
                    console.log(" sync product ", res);
                    if (res.status === 201) {
                        message.success(res.data.message)
                        setIsBranch(false)
                        handleCancel()
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setIsBranch(false)

                });
        } catch (error) {
            console.log(error);
            setIsBranch(false)

        }
    };

    const onFinishFailed = (value) => {
        console.log(value)
    }


    return (
        <Space>
            <Button loading={isProduct} icon={<AiOutlineSync />} size="large" type="primary" ghost onClick={handlleSyncProduct}>Sync Product </Button>
            <Button icon={<AiOutlineSync />} size="large" type="primary" ghost onClick={showModal}>Sync Branch</Button>
            <>
                <Modal width={400} footer={false} title="Sync Branch" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Form
                        form={form}
                        layout="vertical"
                        name="basic"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            // label="Select Branches"
                            name="branchCodes"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select at least 1 branch.",
                                },
                            ]}
                        >
                            <Select mode="multiple" placeholder="Select Branches">
                                {branchData?.map((item) => (
                                    <Select.Option key={item.branchCode} value={item.branchCode}>{item.branchName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <div className="submit_btn">
                                <Button type="primary" loading={isBranch} htmlType="submit" shape="round">
                                    Submit
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        </Space>
    );
}




export default ElasticSearchProduct