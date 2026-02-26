import React, { useState } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { ReturnReplaceAction } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';
import { Col } from 'react-bootstrap';


const ReturnOrderCancel = ({ orderData, showReturnReplaceDetails }) => {
    const [form] = Form.useForm();
    const { token } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const onFinish = async (value) => {
        const body = {
            retOrRepId: orderData?._id,
            status: "REJECTED",
            reason: value.reason
        };
        setIsLoading(true)

        try {
            const res = await ReturnReplaceAction(token, body);
            if (res.status === 201) {
                message.success(res.data.message);
                showReturnReplaceDetails(); // Refresh the order list
                setIsModalOpen(false)
                form.resetFields()
                setIsLoading(false)


            } else {
                message.error(res.data.message);

            }
        } catch (error) {
            console.log(error.message);
            setIsLoading(false)


        }
    };

    const onFinishFailed = () => {
        message.warning("some field missing")
    }
    return (
        <>
            <Button type="primary" shape="round" danger onClick={showModal} disabled={orderData?.status !== "RETURNPENDING" && orderData?.status !== "REPLACEPENDING"}>Reject</Button>

            <Modal footer={false} title={`Reject the ${orderData?.type === "RETURN" ? "Return" : "Replace"}`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"

                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >

                    <Col md={12}>

                        <Form.Item
                            label="Reason"
                            name="reason"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Enter Any Reason!",
                                },
                            ]}
                        >
                            <Input.TextArea placeholder="Reason..." />
                        </Form.Item>
                    </Col>


                    <Form.Item>
                        <div className="submit_btn">
                            <Button loading={isLoading} type="primary" htmlType="submit" shape="round">
                                Submit
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ReturnOrderCancel