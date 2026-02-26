import React, { useState } from 'react';
import { Alert, Button, Divider, Form, Input, message, Modal, Skeleton, Space } from 'antd';
import { refundPaymatCredential, RefundPayNow } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';
import '../../style/master.css'
import { FcUndo } from "react-icons/fc";

const ViewPaymentCredential = ({ returnAmount, userPaymentDetailsId, status, shhowAllOrderRefundList }) => {
    const [form] = Form.useForm();


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPayDone, setISPayDone] = useState(false)
    const [refundData, setRefundData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const { token } = useAuth()
    const showModal = () => {
        setIsModalOpen(true);
        showRefundCredentialData()
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    async function showRefundCredentialData() {
        setIsLoading(true)
        try {
            await refundPaymatCredential(token, userPaymentDetailsId)
                .then((res) => {
                    console.log("fetch refund details", res)
                    if (res.status === 200) {
                        setRefundData(res.data.data)
                        setIsLoading(false)

                    }
                }).catch((err) => {
                    console.log(err)
                })
        } catch (error) {
            console.log(error)
            setIsLoading(false)

        }
    }

    const handleFinishFeild = (value) => {
        console.log(value)
    }

    const handleCodPayment = async (value) => {
        setISPayDone(true)
        try {
            await RefundPayNow(token, { ...value, userPaymentDetailsId: userPaymentDetailsId })
                .then((res) => {
                    console.log("patment refund", res)
                    if (res.status === 201) {
                        setISPayDone(false)
                        message.success(res.data.message)
                        setIsModalOpen(false)
                        form.resetFields()
                        shhowAllOrderRefundList()
                    }
                }).catch((err) => {
                    console.log(err)
                    setISPayDone(false)

                })

        } catch (error) {
            console.log(error)
            setISPayDone(false)
        }
    }
    const handleOnlinePayment = async () => {
        const body = {
            refundTxnId: "",
            userPaymentDetailsId: userPaymentDetailsId
        }
        setISPayDone(true)
        try {
            await RefundPayNow(token, body)
                .then((res) => {
                    console.log("patment refund", res)
                    if (res.status === 201) {
                        setISPayDone(false)
                        message.success(res.data.message)
                        setIsModalOpen(false)
                        form.resetFields()
                        shhowAllOrderRefundList()
                    }
                }).catch((err) => {
                    console.log(err)
                    setISPayDone(false)

                })

        } catch (error) {
            console.log(error)
            setISPayDone(false)
        }
    }
    return (
        <>
            <Button shape="round" disabled={status === "SUCCESS"} className="view_details" onClick={showModal} >Pay Now </Button>

            <Modal footer={false} title="Return Credential" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {isLoading ? <Skeleton active /> : <>

                    {refundData.bankDetails ? <div className='bank_details'>
                        <div className="retunr_amt">
                            <h1>₹{returnAmount || 0}</h1>
                        </div>
                        <Alert message={<div>
                            <p>Account Holder Name : {refundData.bankDetails?.bankAccountHolder || "N/A"} </p>
                            <p>Bank Name : {refundData.bankDetails?.bankName || "N/A"}</p>
                            <p>Account No. : {refundData.bankDetails?.bankAccountNo || "N/A"}</p>
                            <p>IFSC Code :{refundData.bankDetails?.ifscCode || "N/A"}</p>
                        </div>} type="info" showIcon={false} />
                        <Divider dashed />
                        <Form
                            form={form}
                            onFinish={handleCodPayment}
                            onFinishFailed={handleFinishFeild}
                            layout='vertical'
                        >

                            <Form.Item
                                label="Refund Transaction Id"
                                name="refundTxnId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Transaction ID",
                                    },
                                ]}
                            >
                                <Input placeholder='Enter Transaction Id' />
                            </Form.Item>
                            <Form.Item>
                                <div className="pay_now_btn">
                                    <Button loading={isPayDone} htmlType='submit' shape='round' type='primary'>Pay Now</Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </div> : refundData.upiDetails ? <div>
                        <div className="retunr_amt">
                            <h1>₹{returnAmount || 0}</h1>
                        </div>

                        <Alert message={<div>
                            <p>UPI ID : {refundData.upiDetails?.upiId}</p>
                        </div>} type="info" showIcon />
                        <Divider dashed />
                        <Form
                            form={form}
                            onFinish={handleCodPayment}
                            onFinishFailed={handleFinishFeild}
                            layout='vertical'>

                            <Form.Item
                                label="Refund Transaction Id"
                                name="refundTxnId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Transaction ID",
                                    },
                                ]}
                            >
                                <Input placeholder='Enter Transaction Id' />
                            </Form.Item>
                            <Form.Item>
                                <div className="pay_now_btn">
                                    <Button loading={isPayDone} htmlType='submit' shape='round' type='primary'>Pay Now</Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </div> : <div className='online_credential'>
                        <div className="retunr_amt">
                            <h1>₹{returnAmount || 0}</h1>
                        </div>

                        <Alert message={refundData.onlinePaymentCredential?.message} type="info" showIcon />
                        <div className="pay_now_btn">
                            <Button loading={isPayDone} onClick={handleOnlinePayment} shape='round' type='primary'>Pay Now</Button>
                        </div>
                    </div>}
                </>}
            </Modal>
        </>
    );
};

export default ViewPaymentCredential