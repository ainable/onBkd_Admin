import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Drawer, Form, Input, Modal, Upload, message } from 'antd';
import "../../style/product.css"
import { AddProductStockLimit, ResendOrderToVendor, UploadPincodeExcel, UploadProductXls } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';
import { UploadOutlined } from '@ant-design/icons';
import { Col } from 'react-bootstrap';


const AddStockLimit = ({ segmentId, showProductStockLimit }) => {
    const { token } = useAuth()
    const { form } = Form.useForm()
    const [formData, setFormData] = useState(new FormData());
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [fileList, setFileList] = useState([]);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };


    const submitHandler = async (value) => {
        const isExcel =
            value.productStockLimitExcel.file.type === "application/vnd.ms-excel" || // .xls
            value.productStockLimitExcel.file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; // .xlsx

        if (!isExcel) {
            message.error("You can only upload Excel files (.xls or .xlsx)!");
        } else {
            setIsLoading(true)
            try {
                formData.append("productStockLimitExcel", value.productStockLimitExcel.file);
                await AddProductStockLimit(token, formData)
                    .then((res) => {
                        console.log(" stock upload excel", res);
                        if (res.status === 201) {
                            message.success(res.data.message);
                            setOpen(false);
                            onReset()
                            setIsLoading(false)
                            setFormData(new FormData());
                            setFileList([])
                            showProductStockLimit()
                            setFormData(new FormData())
                        } else if (res.status == 200) {
                            message.error(res.data.message);
                            setIsLoading(false)
                            setFormData(new FormData());
                            setFileList([])


                        }
                    })
                    .catch((err) => {
                        console.log(err.message);
                        setFormData(new FormData())
                        setIsLoading(false)
                        setFileList([])


                    });
            } catch (error) {
                console.log(error);
                setFormData(new FormData())
                setIsLoading(false)
                setFileList([])



            }
        }
    }

    const onReset = () => {
        form.resetFields();
    };

    const onFinishFailed = (value) => {
        console.log(value)
    }


    return (
        <div className='upload_pincode_models'>
            <div className="primary_btns">

                <Button type='primary' onClick={showDrawer} shape='round'>Add </Button>
            </div>

            <Drawer title="Add Product Stock  Limit" onClose={onClose} open={open} footer={false}>
                <div className="excelfile_form">

                    <Form layout="vertical" form={form} onFinish={submitHandler} onFinishFailed={onFinishFailed}>
                        <Col md={12}>

                            <Form.Item label="Select XLS File"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Upload Excel File!",
                                    },
                                ]}
                                name="productStockLimitExcel">
                                <Upload
                                    fileList={fileList} // Controlled file list
                                    onChange={({ fileList }) => setFileList(fileList)}
                                    maxCount={1}
                                    listType="file"
                                    beforeUpload={() => false} // To prevent automatic upload
                                    accept=".xls,.xlsx" // Restrict file types in picker
                                >
                                    <div className='excelpUploder'>
                                        <p><UploadOutlined className='mx-2' /></p>
                                        <Button type='link'>Choose File To Upload</Button>
                                        <p> Excel file support</p>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Form.Item>
                            <div className="assign_pin_btn">
                                <Button loading={isLoading} htmlType='submit' type='primary' shape='round'>Submit</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Drawer>
        </div>
    );
};


export default AddStockLimit