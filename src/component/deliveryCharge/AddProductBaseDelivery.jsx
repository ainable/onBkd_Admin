import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Form, Input, Modal, Upload, message } from 'antd';
import "../../style/product.css"
import { AddProductBaseChages, ResendOrderToVendor, UploadPincodeExcel, UploadProductXls } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';
import { UploadOutlined } from '@ant-design/icons';


const AddProductBaseDelivery = ({ showProductDelvieryCharge }) => {
    const { token } = useAuth()
    const { form } = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState(new FormData());

    const [fileList, setFileList] = useState([]);


    const showModal = () => {
        setIsModalOpen(true);
        setFormData(new FormData())

    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const submitHandler = async (value) => {
        const isExcel =
            value.allowedDCProductsExcel.file.type === "application/vnd.ms-excel" || // .xls
            value.allowedDCProductsExcel.file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; // .xlsx
        console.log("isExcel", isExcel)
        console.log(" value.allowedDCProductsExcel.file", value.allowedDCProductsExcel.file)
        if (!isExcel) {
            message.error("You can only upload Excel files (.xls or .xlsx)!");
        } else {
            setIsLoading(true)
            try {
                formData.append("allowedDCProductsExcel", value.allowedDCProductsExcel.file);

                await AddProductBaseChages(token, formData)
                    .then((res) => {
                        console.log(" upload excel", res);
                        if (res.status == 201) {
                            message.success(res.data.message);
                            setIsModalOpen(false);
                            showProductDelvieryCharge()
                            setFileList([])
                            setFormData(new FormData())
                            form.resetFields();
                            setIsLoading(false)
                        } else if (res.status == 200) {
                            message.error(res.data.message);
                            setFileList([])


                        }
                    })
                    .catch((err) => {
                        console.log(err.message);
                        setFileList([])
                        setFormData(new FormData())

                        setIsLoading(false)

                    });
            } catch (error) {
                console.log(error);
                setFileList([])
                setFormData(new FormData())
                setIsLoading(false)
            }
        }

    }

    const onFinishFailed = (value) => {
        console.log(value)
    }


    return (
        <div className='upload_pincode_models'>
            <div className="import_file">
                <Button type="primary" onClick={showModal} shape='round'>Upload XLS</Button>
            </div>

            <Modal width={400} title="Upload Excel file" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
                <div className="excelfile_form">

                    <Form layout="vertical" form={form} onFinish={submitHandler} onFinishFailed={onFinishFailed}>
                        <Form.Item rules={[
                            {
                                required: true,
                                message: "Please Choose any .xls file!",
                            },
                        ]} name="allowedDCProductsExcel">
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
                        <Form.Item>
                            <div className="assign_pin_btn">
                                <Button loading={isLoading} htmlType='submit' type='primary' shape='round'>Submit</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};



export default AddProductBaseDelivery