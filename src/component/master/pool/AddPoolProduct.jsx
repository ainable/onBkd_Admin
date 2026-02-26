import React, { useState } from "react";
import {
    AutoComplete,
    Button,
    Checkbox,
    Divider,
    Drawer,
    Form,
    Input,
    Select,
    Space,
    Upload,
    message,
} from "antd";
import "../../../style/banner.css"
import { useAuth } from "../../../authentication/context/authContext";
import { Col } from "react-bootstrap";
// import ProductSelect from "./SelectProduct";
import { EyeOutlined, UploadOutlined } from '@ant-design/icons';
import ProductSelect from "../segment/SelectProduct";
import ProdcutSelectPool from "./ProdcutSelectPool";
import { InsertNewProductPool } from "../../../service/api_services";

function AddPoolProduct({ showPoolSegment }) {
    const { token, logout } = useAuth()
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [xlsfile, setXlsFile] = useState(null);
    const [formData, setFormData] = useState(new FormData());
    const [selectedPool, setSelectedPool] = useState([])




    const showDrawer = () => {
        setOpen(true);
        setFormData(new FormData())
    };

    const onClose = () => {
        setOpen(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const onFinish = async (value) => {
        console.log("value", value)
        // formData.append("productCode", JSON.stringify(value.productCode) || "");
        // xlsfile && formData.append("productCodeExcel", value.productCodeExcel.file);

        // console.log("value data", value)
        // console.log("form data", formData)
        const body = {
            poolProducts: selectedPool,
        }
        try {
            await InsertNewProductPool(token, body)
                .then((res) => {
                    console.log(" add new segment", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset();
                        setFormData(new FormData())
                        setSelectedPool([])
                        showPoolSegment()
                    } else if (res.status == 200) {
                        message.error(res.data.message);
                        setFormData(new FormData())

                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()

                    }

                })
                .catch((err) => {
                    message.error(err.message);
                    setFormData(new FormData())


                });
        } catch (error) {
            console.log(error);
            setFormData(new FormData())

        }
    };

    const onReset = () => {
        form.resetFields();
    };



    const handleXlsFile = (file) => {
        console.log(file)// Get the file object
        setXlsFile(file.file); // Save it to state
    };


    console.log(selectedPool, "selectedPool")
    return (
        <div className="modal_section">

            <Button
                type="primary"
                className="primary_btn"
                shape="round"
                onClick={showDrawer}
            >
                Add
            </Button>

            <Drawer
                title={<div className="d-flex justify-content-between align-items-center">
                    <p>Add Pool Product</p>

                </div>}
                placement="right"
                // width={360}
                onClose={onClose}
                open={open}
            >
                <div className="add_category_form">
                    <Form
                        form={form}
                        layout="vertical"
                        name="add-image"
                        className="images"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >

                        <Col md={12}>
                            <ProdcutSelectPool xlsfile={xlsfile} setSelectedPool={setSelectedPool} />
                        </Col>
                        <Divider> OR </Divider>
                        <Col md={12}>
                            <div className="xls_file_uplaod">
                                <Form.Item name="productCodeExcel">
                                    <Upload
                                        multiple={false}
                                        listType="file"
                                        beforeUpload={() => false} // To prevent automatic upload
                                        accept="xlsx"
                                        onChange={(e) => handleXlsFile(e)}
                                    >
                                        <Button type='primary' block icon={<UploadOutlined />}> Upload Excel File</Button>
                                    </Upload>
                                </Form.Item>
                            </div>
                        </Col>

                        <div className="model_Submit">
                            <Button onClick={onClose} shape="round" danger>
                                Cancel
                            </Button>
                            <Button
                                htmlType="submit"
                                shape="round"
                            >
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>
            </Drawer>
        </div>
    );
}

export default AddPoolProduct