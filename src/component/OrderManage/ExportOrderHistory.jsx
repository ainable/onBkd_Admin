
import React, { useState } from 'react';
import { Button, DatePicker, Form, message, Modal } from 'antd';
import moment from "moment";
import { deleteStoreExcel, exportOrderHistory } from '../../service/api_services';
import {  Row } from 'react-bootstrap';
import { useAuth } from '../../authentication/context/authContext';
import "../../style/vendor.css"

const ExportOrderHistory = () => {
    const { RangePicker } = DatePicker;
    const [form] = Form.useForm();
    const { token, logout } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState(""); // Either 'date' or 'month'

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);

    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    
    const ExportUserData = async () => {
        try {
            const res = await exportOrderHistory(token,startDate,endDate);
            console.log("res", res)
            if (res.status === 200) {
                const fileUrl = res.data.data.orderHistoryExcel
                form.resetFields();
                handleCancel();
                window.open(fileUrl, '_blank');
                await deleteStoreExcel(fileUrl, token).then((res) => {
                    console.log("remove excel file", res)
                    if (res.status === 201) {
                        message.info(res.data.message)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            } else if (res.data.code === 283) {
                message.error(res.data.message);
                logout();
            } else {
                message.error("Failed to export data");
            }
        } catch (error) {
            console.log(error);
            message.error("An error occurred during export");
        }
    };

    const handelDatePicker = (dates, dateStrings) => {
        console.log('Selected dates:', dateStrings);
        setStartDate(dateStrings[0])
        setEndDate(dateStrings[1])
    };

    const disabledDate = (current) => {
        // Disable future dates
        return current && current > moment().endOf('day');
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Export
            </Button>
            <Modal title="Export Order History" width={350} footer={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="user_export">
                    <Form form={form} onFinish={ExportUserData} onFinishFailed={(value) => console.log(value)}>
                        <Row>
                            
                            <Form.Item
                                name="rangedate"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Choose date ",
                                    },
                                ]}
                            >

                                <RangePicker onChange={handelDatePicker} disabledDate={disabledDate} format="DD/MM/YYYY" />
                            </Form.Item>
                            <Form.Item >
                                <div className="export_data">
                                    <Button danger onClick={handleCancel}>Cancel</Button>
                                    <Button htmlType='submit'>Export</Button>
                                </div>
                            </Form.Item>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    );
};



export default ExportOrderHistory