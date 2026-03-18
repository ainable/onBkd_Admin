import React, { useEffect, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Checkbox,
    DatePicker,
    Divider,
    Drawer,
    Form,
    Input,
    Select,
    Skeleton,
    Space,
    TimePicker,
    Upload,
    message,
} from "antd";

import { Col, Row } from "react-bootstrap"
import GooglePlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from "react-google-places-autocomplete";
import { useAuth } from "../../authentication/context/authContext";
import { deliveryTypes, InsertNewBranch, InsertNewBranchSlote, SlotDeliveryTypes } from "../../service/api_services";
import { BranchHook } from "../../pages/CustomHooks";
import { MdDeleteOutline } from "react-icons/md";


const AddBranchSlot = ({ shhowAllBranchSlote }) => {
    const { token } = useAuth()
    const { branchList } = BranchHook(token)

    const [open, setOpen] = useState(false);
    const [totime, setToTime] = useState("")
    const [fromTime, setFromTime] = useState("")
    const [isSubmit, setIsSubmit] = useState(false)
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const [form] = Form.useForm();

    const showDrawer = () => {
        setOpen(true);
    };

    const cartClose = () => {
        setOpen(false);
    };






    const onFinish = async (value) => {

        const formattedSlots = value.slots.map((slot) => ({
            date: slot.date?.format("YYYY-MM-DD"),
            timeSlotFrom: slot.timeSlotFrom?.format("h:mm a"),
            timeSlotTo: slot.timeSlotTo?.format("h:mm a"),
        }));

        const payload = {
            ...value,
            timeSlotTo: totime,
            timeSlotFrom: fromTime,
            slots: formattedSlots,
        };

        setIsSubmit(true)
        try {


            await InsertNewBranchSlote(token, { ...value, timeSlotTo: totime, timeSlotFrom: fromTime })
                .then((res) => {
                    console.log("add branch  slote ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset()
                        shhowAllBranchSlote()
                        setIsSubmit(false)
                    } else if (res.status == 200) {
                        message.error(res.data.message);
                        setIsSubmit(false)


                    }

                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const onReset = () => {
        form.resetFields();
    };
    const onFinishFailed = (value) => {
        console.log(value)
    }


    const fromDateChange = (time, timeString) => {
        setFromTime(timeString)
        console.log("from", time, timeString);
    };

    const ToDateChange = (time, timeString) => {
        setToTime(timeString)
        console.log("to", time, timeString);
    };



    return (
        <>
            <div className="Add_Addre">
                <Button type="primary" onClick={showDrawer} shape="round" block>
                    Add
                </Button>
            </div>
            <Drawer
                title="Add New Branch Slot"
                onClose={cartClose}
                open={open}
                placement="right"
                width={360}
            >



                <div className="add_form">
                    <Form
                        form={form}
                        layout="vertical"
                        name="basic"

                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >

                        {/* <Col md={12}>

                            <Form.Item
                                label="Branch Code"
                                name="branchCode"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter your Branch Code!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter  Branch Code" />
                            </Form.Item>
                        </Col> */}
                        <Col md={12}>
                            <Form.Item
                                label="Select Branch"
                                name="branchId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Select Branch!",
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select Branch "
                                    optionFilterProp="children"
                                    // onChange={handleCategoryChange}
                                    style={{ width: '100%' }}
                                >
                                    {branchList?.map((option) => (
                                        <Select.Option
                                            key={option._id}
                                            level={option.branchName}
                                            value={option._id}
                                        >
                                         {capitalize(option.branchName)}-{option.branchCode}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                        </Col>



                        < Col md={12}>
                            <Form.Item
                                label="Select Delivery Option"
                                name="deliveryOption"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Select Delivery Option!",
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select Delivery Option "
                                    optionFilterProp="children"
                                    // onChange={handleCategoryChange}
                                    style={{ width: '100%' }}
                                >
                                    {SlotDeliveryTypes?.map((option) => (
                                        <Select.Option
                                            key={option.key}
                                            value={option.values}
                                        >
                                            {option.values}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                        </Col>
                        <Row>

                            <Col md={6}>

                                <Form.Item
                                    label="From Slot"
                                    name="timeSlotFrom"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Time Slot From!",
                                        },
                                    ]}
                                >
                                    <TimePicker  style={{ width: "100%" }} use12Hours format="h:mm a" onChange={fromDateChange} />
                                </Form.Item>
                            </Col>
                            <Col md={6}>

                                <Form.Item
                                    label="To Slot"
                                    name="timeSlotTo"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Time Slot to!",
                                        },
                                    ]}
                                >
                                    <TimePicker style={{ width: "100%" }} use12Hours format="h:mm a" onChange={ToDateChange} />
                                </Form.Item>
                            </Col>
                        </Row>

                        < Col md={12}>
                            <Form.Item name="maxDelivery"
                                label="Maximum Delivery "
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Maximum Delivery "

                                    },
                                    {
                                        pattern: /^[0-9]*$/,
                                        message: 'Please Enter only Numbers!',
                                    },
                                ]}
                                style={{ marginBottom: '0px' }}
                            >
                                <Input maxLength={10} placeholder='Enter Maximum Delivery ' />
                            </Form.Item>

                        </Col>

                        {/* <div style={{ margin: '16px 0px', borderBottom: "1px solid #eee" }} />

                        <Form.List name="slots" initialValue={[{}]}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <div key={field.key} className="position-relative border rounded bg-light p-3 mb-3">
                                            {fields.length > 1 && (
                                                <div
                                                    onClick={() => remove(field.name)}
                                                    className="position-absolute top-0 end-0 m-2 p-1 rounded-circle bg-light"
                                                    style={{ cursor: "pointer", zIndex: 10, }}
                                                >
                                                    <MdDeleteOutline className="text-danger fs-5" />
                                                </div>
                                            )}

                                            <Form.Item
                                                {...field}
                                                name={[field.name, "date"]}
                                                label="Select Date"
                                                rules={[{ required: true, message: "Please select date" }]}
                                            >
                                                <DatePicker style={{ width: "100%" }} />
                                            </Form.Item>

                                            <Row gutter={10}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, "timeSlotFrom"]}
                                                        label="From Slot"
                                                        rules={[{ required: true, message: "Required" }]}
                                                        style={{ marginBottom: '0px' }}
                                                    >
                                                        <TimePicker use12Hours format="h:mm a" style={{ width: "100%" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, "timeSlotTo"]}
                                                        label="To Slot"
                                                        rules={[{ required: true, message: "Required" }]}
                                                        style={{ marginBottom: '0px' }}
                                                    >
                                                        <TimePicker use12Hours format="h:mm a" style={{ width: "100%" }} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}

                                    <div style={{ marginBottom: 16, borderBottom: "1px solid #eee", paddingBottom: 10 }}>
                                        <Button type="dashed" onClick={() => add()} block >
                                            + Add Slot
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form.List> */}
                        <Form.Item>
                            <div className="add_address_btn">

                                <Space>
                                    <Button danger shape="round" onClick={() => setOpen(false)}>Cancel</Button>
                                    <Button loading={isSubmit} type="primary" htmlType="submit" shape="round">
                                        Submit
                                    </Button>
                                </Space>

                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Drawer>
        </>
    );
};

export default AddBranchSlot;