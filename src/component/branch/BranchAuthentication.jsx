import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Switch, message } from 'antd';
import { BranchAction } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';
import '../../style/location.css'
const BranchAuthentication = ({ branchData, shhowAllBranchList }) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const { token } = useAuth()
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        shhowAllBranchList()
        console.log("fdskjfgdskfdsj")
    };
    console.log("branchData", branchData)


    const onFinish = async (value) => {
        setIsLoading(true)
        try {
            await BranchAction(token, { ...value, branchId: branchData._id })
                .then((res) => {
                    console.log(res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        shhowAllBranchList()
                        handleCancel()
                        form.resetFields();
                        setIsLoading(false)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    message.error(err.
                        response.data.message
                    );

                });
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    };

    const onFinishFailed = (value) => {
        console.log(value)
    }


    return (
        <>
            <Switch
                checkedChildren={branchData.status}
                unCheckedChildren={branchData.status}
                checked={branchData.status == "ACTIVE"}
                onClick={() => showModal()}
            />
            <Modal footer={false} title="Authentication Verify" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="auth_password">
                    <Form
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        layout="vertical"
                        name="basic"
                        labelCol={{
                            span: 12,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}

                        autoComplete="on"
                    >


                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Enput Autharize password!",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Enter Password"

                            />
                        </Form.Item>

                        <Form.Item

                        >
                            <div className="branch_auth">

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    shape="round"
                                >
                                    Submit
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
};
export default BranchAuthentication;