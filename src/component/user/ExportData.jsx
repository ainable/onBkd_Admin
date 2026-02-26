
import React, { useState } from 'react';
import { Button, DatePicker, Form, message, Modal, Select, Space } from 'antd';
import moment from "moment";
import { MdFilterList } from "react-icons/md";
import { deleteStoreExcel, exportCustomerDetails, filterOption } from '../../service/api_services';
import { Col, Row } from 'react-bootstrap';
import { useAuth } from '../../authentication/context/authContext';
import "../../style/vendor.css"

const ExportData = () => {

    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const [isLoading, setIsLoading] = useState(false)
    const { token, logout } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [filterType, setFilterType] = useState(""); // Either 'date' or 'month'

    console.log("filterType", filterType)
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
        setIsLoading(true)
        try {
            const res = await exportCustomerDetails(token, startDate, endDate);
            console.log("res", res)
            if (res.status === 200) {
                const fileUrl = res.data.data.orderHistoryExcel
                form.resetFields();
                handleCancel();
                setIsLoading(false)

                // Trigger file download
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
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error);
            message.error("An error occurred during export");
            setIsLoading(false)
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
            <Modal title="Export Customer Details" width={350} footer={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="user_export">
                    <Form form={form} onFinish={ExportUserData} onFinishFailed={(value) => console.log(value)}>
                        <Row>

                            <Form.Item
                                name="filter_type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter offer Title",
                                    },
                                ]}
                            >
                                <RangePicker onChange={handelDatePicker} disabledDate={disabledDate} format="DD/MM/YYYY" />

                            </Form.Item>

                            <Form.Item >
                                <div className="export_data">
                                    <Button danger onClick={handleCancel}>Cancel</Button>
                                    <Button loading={isLoading} htmlType='submit'>Export</Button>
                                </div>
                            </Form.Item>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default ExportData;
