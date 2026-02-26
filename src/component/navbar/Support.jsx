import React, { useEffect, useState } from 'react';
import { Button, Drawer, Empty, Form, Input, message, Segmented, Select, Typography } from 'antd';
import "../navbar/navbar.css"
import { AddNewBranchManager, cmsTyps, FetchHelpSupport, InsertHelpSupport, UpdateHelpSupport } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';
import { BiSupport } from "react-icons/bi";
import AddSupport from './AddSupport';

function Support() {

    const [form] = Form.useForm();
    const { token, logout } = useAuth()
    const [open, setOpen] = useState(false);
    const [types, setTypes] = useState("USER")
    const [supportData, setSupportData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const showDrawer = () => {
        setOpen(true);
        showHelpSupport()
    };
    const onClose = () => {
        setOpen(false);
    };

    const showHelpSupport = async () => {
        try {
            await FetchHelpSupport(token, types)
                .then((res) => {
                    console.log(" all about list ", res);
                    if (res.status == 200) {

                        const fetchData = res.data.data
                        setSupportData(fetchData)
                        form.setFieldsValue({
                            for: fetchData.for,
                            mobileNo: fetchData.mobileNo,
                            email: fetchData.email,
                        })
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()

                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        showHelpSupport();
    }, [types]);



    const onFinish = async (value) => {
        const body = {
            mobileNo: value.mobileNo,
            email: value.email,
            helpSupportId: supportData?._id,
        }
        setIsLoading(true)
        try {
            await UpdateHelpSupport(token, body)
                .then((res) => {
                    console.log("help", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset()
                        setIsLoading(false)
                        showHelpSupport()

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
        <div className='add_support'>
            <BiSupport className='suport_icons' onClick={showDrawer} />

            <Drawer title="Help & Support" onClose={onClose} open={open}>
                <div className="mb-2">

                    <Segmented options={["USER", "VENDOR"]} block onChange={(value) => setTypes(value)} />
                </div>
                {!supportData ? <div className="add_about">
                    <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        styles={{
                            image: {
                                height: 60,
                            },
                        }}
                        description={
                            <Typography.Text>
                                About not found !
                            </Typography.Text>
                        }
                    >
                        <AddSupport showHelpSupport={showHelpSupport} />
                    </Empty>
                </div> :
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
                                label="Number" rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Number!",
                                    },
                                ]}>
                                <Input placeholder='Enter User Name' />
                            </Form.Item>
                            <Form.Item name="email" label="Email" rules={[
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
                                        loading={isLoading}
                                    >
                                        Update
                                    </Button>
                                </div>

                            </Form.Item>
                        </Form>
                    </div>}
            </Drawer>
        </div>
    );
}







export default Support