import React, { useEffect, useState } from 'react';
import { Button, Drawer, Form, Input, message, Select } from 'antd';
import "../../style/location.css"
import { AddNewBranchManager, fetchBranchRole } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';

function AddManager({ branchId, shhowAllBranchInfo }) {
    const [form] = Form.useForm();
    const { token } = useAuth()
    const [open, setOpen] = useState(false);
    const [isCreated, setIsCreated] = useState(false);
    const [brachRole, setBranchRole] = useState([])

    const filterRole = brachRole.filter((item) => item.rolename !== "BranchAdmin")

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const onFinish = async (value) => {
        setIsCreated(true)
        try {
            await AddNewBranchManager(token, { ...value, branchId: branchId, })
                .then((res) => {
                    console.log("add branch member", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset()
                        shhowAllBranchInfo()
                    } else if (res.status == 200) {
                        message.success(res.data.message);

                    }
                })
                .catch((err) => {
                    console.log(err);
                }).finally(() => {
                    setIsCreated(false)
                })
        } catch (error) {
            console.log(error);
            setIsCreated(false)

        }
    };


    const onFinishFailed = (value) => {
        console.log(value)
    }

    const onReset = () => {
        form.resetFields()
    }

    const shhowAllBranchRole = async () => {
        try {
            await fetchBranchRole(token)
                .then((res) => {
                    console.log("  branch role ", res);
                    if (res.status == 200) {
                        setBranchRole(res.data.data);
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
        shhowAllBranchRole();
    }, []);



    return (
        <div className='add_manager_btn'>
            <Button shape="round" onClick={showDrawer}>Add Manager</Button>
            <Drawer title="Assign Branch Manager" onClose={onClose} open={open}>
                <div className="add_manage_form">
                    <Form
                        form={form}
                        layout='vertical'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label="Select Role"
                            name="roleId"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Select Role",
                                },
                            ]}
                        >
                            <Select placeholder="Select Role Type" >
                                {filterRole.map((item) => (
                                    <Select.Option key={item._id} value={item._id} >{item.rolename}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="fullName" label="User Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Enter User Name!",
                                },
                            ]}>
                            <Input placeholder='Enter User Name' />
                        </Form.Item>
                        <Form.Item name="email" label="Email"
                            rules={[
                                // {
                                //     required: true,
                                //     message: "Please Enter Email!",
                                // },
                                { type: "email", message: "Please enter a valid email!" }
                            ]}>
                            <Input placeholder='Enter Email' />
                        </Form.Item>
                        <Form.Item name="password" label="Password" rules={[
                            {
                                required: true,
                                message: "Please Enter your Passwork!",
                            },
                        ]}>
                            <Input.Password placeholder='Enter Password' />
                        </Form.Item>

                        <Form.Item >
                            <div className="model_Submit">
                                <Button onClick={onClose} shape="round" danger>
                                    Cancel
                                </Button>
                                <Button
                                    htmlType="submit"
                                    shape="round"
                                    loading={isCreated}
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






export default AddManager