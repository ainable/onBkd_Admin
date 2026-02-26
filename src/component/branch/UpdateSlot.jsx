import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { updateMaxSlot } from '../../service/api_services';
import { AiOutlineEdit } from "react-icons/ai";
import { useAuth } from '../../authentication/context/authContext';
const UpdateSlot = ({ slotId, shhowAllBranchSlote, maxDelivery }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const { token } = useAuth()
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        form.setFieldsValue({
            maxDelivery
        })
    }, [maxDelivery])
    const handleSubmit = async (value) => {


        try {
            await updateMaxSlot(token, { ...value, branchSlotId: slotId, })
                .then((res) => {
                    console.log("add branch member", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        handleCancel();
                        shhowAllBranchSlote()
                    }

                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    };
    const handleFaiild = (value) => {
        console.log(value)
    }
    return (
        <>
            <Button type="primary"shape="round"   onClick={showModal}>
                Edit
            </Button>
            <Modal width={350} title="Edit Maximum Delivery" footer={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={handleSubmit}
                    onFinishFailed={handleFaiild}
                >
                    <Form.Item name="maxDelivery"
                        label="Maximum Delivery "
                        rules={[
                            {
                                required: true,
                                message: "Please Enter  Mobile No "

                            },
                            {
                                pattern: /^[0-9]*$/,
                                message: 'Please Enter only Numbers!',
                            },
                        ]}>
                        <Input maxLength={10} placeholder='Enter  Mobile No. ' />
                    </Form.Item>
                    <Form.Item>
                        <div className='submit_btn'>

                            <Button shape="round" type='primary' htmlType='submit'>Submit</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateSlot