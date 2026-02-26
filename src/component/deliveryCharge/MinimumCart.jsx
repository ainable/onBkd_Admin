import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Popover, Switch } from 'antd';
import { MdOutlineSettings } from 'react-icons/md';
import { AddNewGeneralSetting, EditGeneralSetting, fetchGeneralSetting } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';
import { Col, Row } from 'react-bootstrap';
import "../../style/master.css"


const MinimumCart = () => {
    const [form] = Form.useForm();
    const { token, logout } = useAuth()
    const [open, setOpen] = useState(false);
    const [setting, setSetting] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [switchValue, setSwitchValue] = useState(false);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showGeneralSetting = async () => {
        try {
            await fetchGeneralSetting(token)
                .then((res) => {
                    console.log(" general setting ", res);
                    if (res.status == 200) {
                        setSetting(res.data.data);
                        setSwitchValue(res.data.data.isRemoveAllow)
                        form.setFieldsValue({
                            freeDeliveryMaxCart: res.data.data.freeDeliveryMaxCart,

                        });
                        handleCancel()

                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        showGeneralSetting()
    }, [])


    const AddSettingHandler = async (value) => {
        setIsLoading(true)

        try {

            await AddNewGeneralSetting({ ...value, isRemoveAllow: switchValue }, token)
                .then((res) => {
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset()
                        showGeneralSetting()
                        setIsLoading(false)

                    } else if (res.status == 200) {
                        message.warning(res.data.message);
                    }

                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false)

                });
        } catch (error) {
            console.log(error);
            setIsLoading(false)

        }
    };

    const EditSettingHandler = async (value) => {
        setIsLoading(true)

        try {
            await EditGeneralSetting({ ...value, generalSettingId: setting?._id, isRemoveAllow: switchValue }, token)
                .then((res) => {
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset()
                        showGeneralSetting()
                        setIsLoading(false)

                    } else if (res.status == 200) {
                        message.warning(res.data.message);
                    }

                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false)

                });
        } catch (error) {
            console.log(error);
            setIsLoading(false)

        }
    };
    const onReset = () => {
        form.resetFields();
    };
    const onFinishFailed = (value) => {
        console.log(value)
    }


    return (
        <>
            <Button type="primary" shape="round" onClick={showModal}>
                Free Delivery Over
            </Button>
            <Modal width={340} footer={false} title="Free Delivery Over" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    onFinish={setting != null ? EditSettingHandler : AddSettingHandler}
                    onFinishFailed={onFinishFailed}
                >


                    <Form.Item
                        label="Free Delivery Over"
                        name="freeDeliveryMaxCart"
                        rules={[
                            {
                                required: true,
                                message: "Please Enter Free Delivery Over",
                            },
                            {
                                pattern: /^[0-9]*$/,
                                message: 'Please Enter Only Numbers!',
                            },
                        ]}
                    >
                        <Input placeholder="Enter Free Delivery Over" />
                    </Form.Item>
                    <Form.Item>
                        <div className="add_setting">
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

export default MinimumCart