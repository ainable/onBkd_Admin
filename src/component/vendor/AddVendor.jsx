import React, { useEffect, useState } from "react";
import {

    AutoComplete,
    Button,
    Card,

    Drawer,
    Form,
    Input,

    Upload,
    message,
} from "antd";

import { Col, Row } from "react-bootstrap"

import { useAuth } from "../../authentication/context/authContext";
import { InsertNewBranch, InsertNewVendor, fetchAllBranchList } from "../../service/api_services";
import { MdOutlineSearch } from "react-icons/md";
const AddVendor = ({ showAllVendorList }) => {
    const [open, setOpen] = useState(false);
    const { token } = useAuth()
    const [isLoading, setIsLoading] = useState("")
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


    const [form] = Form.useForm();

    const [branchList, setBranchList] = useState([])
    const [branchId, setBranchId] = useState("")
    const showDrawer = () => {
        setOpen(true);
    };

    const cartClose = () => {
        setOpen(false);
    };

    const showAllBranchList = async () => {
        try {
            await fetchAllBranchList(token)
                .then((res) => {
                    console.log(" branch list", res);
                    if (res.status == 200) {
                        setBranchList(res.data.data.data)


                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        showAllBranchList()
    }, [])



    const onFinish = async (value) => {
        setIsLoading(true)
        try {


            await InsertNewVendor(token, { ...value, branchId: branchId })
                .then((res) => {
                    console.log("add vendor ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset()
                        setIsLoading(false)

                        showAllVendorList()
                    } else if (res.status == 200) {
                        message.warning(res.data.message);
                        setIsLoading(false)

                    }

                })
                .catch((err) => {
                    console.log(err);
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

    const validateMaxLength = (_, value) => {
        if (value && value.length > 10) {
            return Promise.reject(new Error('Please Enter Valid Number or more then 10 digit!'));
        }
        return Promise.resolve();
    };
    const handleSelect = (value, id) => {
        console.log(value)
        setBranchId(id.id)
        // setVendorId(key)
    }

    return (
        <>
            <div className="Add_Addre">
                <Button type="primary" onClick={showDrawer} shape="round" >
                    Add
                </Button>
            </div>
            <Drawer
                title="Add Delivery Partner"
                onClose={cartClose}
                open={open}
                placement="right"
            >


                <div className="add_form">
                    <Form
                        form={form}
                        layout="vertical"
                        name="basic"

                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >

                        <Col md={12}>

                            <Form.Item
                                label="full Name"
                                name="fullName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter your full Name!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter Full Name" />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label="Mobile No"
                                name="mobileNo"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter your Mobile No!",
                                    },
                                    {
                                        pattern: /^[0-9]*$/,
                                        message: 'Please Enter only Numbers!',
                                    },
                                    { validator: validateMaxLength }
                                ]}
                            >
                                <Input maxLength={10} placeholder="Enter  Mobile No" />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item

                                rules={[
                                    {
                                        required: true,
                                        message: "Please Select Any Branch!",
                                    },
                                ]} name="branchId" label="Select Assign Branch">
                                <AutoComplete

                                    options={branchList?.map(option => ({
                                        value: `${capitalize(option.branchName)}-(${option.branchCode})`,
                                        id: option._id
                                    }))}
                                    suffixIcon={<MdOutlineSearch className='vendor_search' />}

                                    placeholder="Search Branch"
                                    onSelect={handleSelect}
                                    filterOption={branchList?.map(option => ({ value: option.branchName.toUpperCase().indexOf(option.branchName.toUpperCase()) !== -1, id: option._id }))}

                                />


                            </Form.Item>
                        </Col>
                        <Form.Item>
                            <div className="add_address_btn">
                                <Button loading={isLoading} type="primary" htmlType="submit" shape="round">
                                    Submit
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Drawer>
        </>
    );
};


export default AddVendor