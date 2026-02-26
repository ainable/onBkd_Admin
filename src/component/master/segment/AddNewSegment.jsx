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
import DefaultImage from "../../../assest/icon/default-image.jpg"
import "../../../style/banner.css"
import { useAuth } from "../../../authentication/context/authContext";
import { AddCustomSegment } from "../../../service/api_services";
import { Col } from "react-bootstrap";
import ProductSelect from "./SelectProduct";
import { EyeOutlined, UploadOutlined } from '@ant-design/icons';
import ViewFormate from "../../../assest/png/segmet-review.jpg"
import ExcelFormate from "./ExcelFormate";

function AddNewSegment({ showAllCustomSegment }) {
    const { token, logout } = useAuth()
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)
    const [xlsfile, setXlsFile] = useState(null);
    const [formData, setFormData] = useState(new FormData());
    const [bannerUploder, setBannerUploader] = useState(null)
    const [uploder, setUploader] = useState(null)
    const options = Array.from({ length: 28 }, (_, i) => i + 1);
    const [segmentNumber, setSegmentNumber] = useState(null)
    const [childrenDrawer, setChildrenDrawer] = useState(false);
    const [fileList, setFileList] = useState([]);
    const showChildrenDrawer = () => {
        setChildrenDrawer(true);
    };
    const onChildrenDrawerClose = () => {
        setChildrenDrawer(false);
    };
    console.log("xlsfile", xlsfile)

    const handelSegmentNumber = (value) => {
        console.log(value)
        setSegmentNumber(value);
    };


    const showDrawer = () => {
        setOpen(true);
        setFormData(new FormData())
    };

    const onClose = () => {
        setOpen(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        message.error("All field is require !");
    };

    const onFinish = async (value) => {
        console.log(value)
        if (fileList.length != 0) {
            let isExcel =
                value.productCodeExcel.file.type === "application/vnd.ms-excel" || // .xls
                value.productCodeExcel.file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; // .xlsx

            if (!isExcel) {
                message.error("You can only upload Excel files (.xls or .xlsx)!");
            }
        }


        formData.append("bigBanner", value.bigBanner.file);
        ![1, 6, 12, 15, 20, 26].includes(segmentNumber) && formData.append([13, 14, 27, 28].includes(segmentNumber) ? "middleBanner" : "smallBanner", [13, 14, 27, 28].includes(segmentNumber) ? value.middleBanner.file : value.smallBanner.file);
        formData.append("title", value.title);
        formData.append("segmentNo", value.segmentNo);
        formData.append("productCode", JSON.stringify(value.productCode) || "");
        fileList.length != 0 && formData.append("productCodeExcel", value.productCodeExcel.file);

        console.log("value data", value)
        console.log("form data", formData)
        setIsLoading(true)
        try {
            await AddCustomSegment(token, formData)
                .then((res) => {
                    console.log(" add new segment", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset();
                        setFileList([])
                        setFormData(new FormData())
                        setUploader(null)
                        setBannerUploader(null)
                        showAllCustomSegment()
                        setIsLoading(false)

                    } else if (res.status == 200) {
                        message.error(res.data.message);
                        setFormData(new FormData())
                        setIsLoading(false)
                        setFileList([])


                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()

                    }

                })
                .catch((err) => {
                    message.error(err.message);
                    setFormData(new FormData())
                    setIsLoading(false)


                });
        } catch (error) {
            console.log(error);
            setFormData(new FormData())
            setIsLoading(false)


        }
    }


    const onReset = () => {
        form.resetFields();
    };


    const handlerImage = (info) => {
        const filteredList = info.fileList.filter((file) => {
            const isWebp = file.type === 'image/webp';
            if (!isWebp) {
                message.error(`${file.name} is not a WEBP image. Please upload only WEBP images.`);
            }
            return isWebp;
        });

        setUploader(filteredList);
    }

    const handlerBannerImage = (info) => {
        const filteredList = info.fileList.filter((file) => {
            const isWebp = file.type === 'image/webp';
            if (!isWebp) {
                message.error(`${file.name} is not a WEBP image. Please upload only WEBP images.`);
            }
            return isWebp;
        });
        setBannerUploader(filteredList)
    }

    const handleRemove = (file) => {
        setFileList([]);  // Remove the selected file
    };

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
                title={<div >
                    <p>Add New Segment</p>
                    <div className="add_segment_title">
                        <ExcelFormate title="segment" />
                        |
                        <Button type="link" variant="filled" icon={<EyeOutlined />} onClick={showChildrenDrawer}>View Format</Button>
                    </div>
                </div>}
                placement="right"
                width={420}
                onClose={onClose}
                open={open}
            >
                <Drawer
                    title="View Format"
                    width={600}
                    // closable={false}
                    onClose={onChildrenDrawerClose}
                    open={childrenDrawer}
                >
                    <div className="review_img">
                        <img src={ViewFormate} />
                    </div>
                </Drawer>
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
                            <Form.Item
                                label="Select Segment"
                                name="segmentNo"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please choose any 1 number",
                                    },
                                ]}
                            >
                                <Select placeholder="Select Segment Number" onChange={handelSegmentNumber}>
                                    {options.map((opt) => (
                                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col md={12}>
                            <Form.Item
                                label="Segment Title"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Segment Title",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter Segment Title" />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <ProductSelect xlsfile={xlsfile} />
                        </Col>
                        <Divider> OR </Divider>
                        <Col md={12}>
                            <div className="xls_file_uplaod">
                                <Form.Item name="productCodeExcel">
                                    <Upload
                                        fileList={fileList} // Controlled file list
                                        onChange={({ fileList }) => setFileList(fileList)}
                                        maxCount={1}
                                        listType="file"
                                        beforeUpload={() => false} // To prevent automatic upload
                                        accept=".xls,.xlsx" // Restrict file types in picker
                                        onRemove={handleRemove}
                                    >
                                        <div className='excelpUploders'>

                                            <Button icon={<UploadOutlined />} type='primary'>Upload XLS</Button>
                                        </div>
                                    </Upload>
                                </Form.Item>
                            </div>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                name="bigBanner"
                                label="Choose Banner Image"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Choose Banner Image",
                                    },
                                ]}
                            >
                                <Upload
                                    multiple={false}
                                    listType="picture-circle"
                                    beforeUpload={() => false} // To prevent automatic upload
                                    accept=".webp"
                                    onChange={(e) => handlerBannerImage(e)}
                                    fileList={bannerUploder}
                                // disabled={uploder?.length == 1}
                                >
                                    {bannerUploder?.length != 1 ? <img src={DefaultImage} className="image_hold" /> : null}
                                </Upload>

                            </Form.Item>

                        </Col>

                        {![1, 6, 12, 15, 20, 26].includes(segmentNumber) && (
                            <Col md={12}>
                                <Form.Item
                                    name={[13, 14, 27, 28].includes(segmentNumber) ? "middleBanner" : "smallBanner"}
                                    label="Choose Segment Image"
                                    rules={[{ required: true, message: "Please Choose Banner Image" }]}
                                >
                                    <Upload
                                        multiple={false}
                                        listType="picture-circle"
                                        beforeUpload={() => false} // Prevents automatic upload
                                        accept=".webp"
                                        onChange={handlerImage}
                                        fileList={uploder}
                                    >
                                        {uploder?.length !== 1 && <img src={DefaultImage} className="image_hold" />}
                                    </Upload>
                                </Form.Item>
                            </Col>
                        )}



                        <div className="model_Submit">
                            <Button onClick={onClose} shape="round" danger>
                                Cancel
                            </Button>
                            <Button
                                loading={isLoading}
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

export default AddNewSegment