import React, { useState } from 'react';
import { Button, Drawer, Form, Input, message, Select } from 'antd';
import "../../style/location.css"
import { AddNewBranchManager, cmsTyps, InsertHelpSupport } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';

function AddSupport({ showHelpSupport }) {
    const [form] = Form.useForm();
    const { token } = useAuth()
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const onFinish = async (value) => {
        setIsLoading(true)

        try {
            await InsertHelpSupport(token, value)
                .then((res) => {
                    console.log("add branch member", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset()
                        showHelpSupport()
                        setIsLoading(false)

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


    const onFinishFailed = (value) => {
        console.log(value)
    }
    const onReset = () => {
        form.resetFields()
    }
    return (
        <div className='add_manager_btn'>
            <Button shape="round" onClick={showDrawer}>Add Support</Button>
            <Drawer title="Add Help & Support" onClose={onClose} open={open}>
                <div className="add_manage_form">
                    <Form
                        form={form}
                        layout='vertical'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            name="for"
                            label="Select Type"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Select Type",
                                },
                            ]}>
                            <Select placeholder='Select Type '>
                                {cmsTyps.map((item) => (
                                    <Select.Option key={item.key} value={item.values}>{item.values}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="mobileNo"
                            label="Number"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Enter Number!",
                                },
                            ]}>
                            <Input placeholder='Enter User Number' />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Enter Email!",
                                },
                            ]}>
                            <Input placeholder='Enter User Name' />
                        </Form.Item>

                        <Form.Item >
                            <div className="model_Submit">

                                <Button
                                    htmlType="submit"
                                    shape="round"
                                    loading={isLoading }
                                >
                                    Submit
                                </Button>
                            </div>

                        </Form.Item>
                    </Form>
                </div>
            </Drawer>
        </div>
    );
}








export default AddSupport