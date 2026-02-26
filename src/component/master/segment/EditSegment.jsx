import React, { useEffect, useState } from "react";
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
import { AddCustomSegment, EditStaticSegment } from "../../../service/api_services";
import { Col } from "react-bootstrap";
import ProductSelect from "./SelectProduct";
import { EyeOutlined, UploadOutlined } from '@ant-design/icons';
import ViewFormate from "../../../assest/png/segmet-review.jpg"

function EditSegment({ showAllCustomSegment, editData }) {
    const { token, logout } = useAuth()
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [formData, setFormData] = useState(new FormData());
    const [bannerUploder, setBannerUploader] = useState(null)
    const [uploder, setUploader] = useState(null)

    const options = Array.from({ length: 28 }, (_, i) => i + 1);


    console.log("editData", editData)
    useEffect(() => {
        form.setFieldsValue({
            title: editData?.title,
            segmentNo: editData?.segmentNo,
        })
    }, [editData])


    const showDrawer = () => {
        setOpen(true);
        setFormData(new FormData())
        setUploader(null)
        setBannerUploader(null)
       
    };

    const onClose = () => {
        setOpen(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const onFinish = async (value) => {
        //   formData.append("branchImage", value.branchImage.file);

        bannerUploder && formData.append("bigBanner", value.bigBanner.file);

        ![1, 6, 12, 15, 20, 26].includes(editData?.segmentNo) && uploder && formData.append([13, 14, 26, 28].includes(editData?.segmentNo) ? "middleBanner" : "smallBanner", [13, 14, 26, 28].includes(editData?.segmentNo) ? value.middleBanner.file : value.smallBanner.file);
        formData.append("title", value.title);
        formData.append("staticCustomSegmentId", editData?._id);
        try {
            await EditStaticSegment(token, formData)
                .then((res) => {
                    console.log(" add new segment", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        setUploader(null)
                        setBannerUploader(null)
                        setFormData(new FormData())
                        showAllCustomSegment()
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


    const handlerImage = (file) => {
        setUploader(file.fileList)
    }

    const handlerBannerImage = (file) => {
        console.log("banner ----file", file)
        setBannerUploader(file.fileList)
    }


    return (
        <div className="modal_section">
            <span

                onClick={showDrawer}
            >
                Edit Segment
            </span>
            <Drawer
                title={<div className="d-flex justify-content-between align-items-center">
                    <p>Edit Segment</p>
                </div>}
                placement="right"
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
                                <Select placeholder="Select Segment Number" disabled>
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
                            <Form.Item
                                name="bigBanner"
                                label="Choose Banner Image"

                            >
                                <Upload
                                    multiple={false}
                                    listType="picture-circle"
                                    beforeUpload={() => false} // To prevent automatic upload
                                    accept="jpg/jpeg"
                                    onChange={(e) => handlerBannerImage(e)}
                                // disabled={uploder?.length == 1}
                                >
                                    {bannerUploder?.length != 1 ? <img src={editData?.bigBanner} className="image_hold" /> : null}

                                </Upload>

                            </Form.Item>

                        </Col>

                        {![1, 6, 12, 15, 20, 26].includes(editData?.segmentNo) && (
                            <Col md={12}>
                                <Form.Item
                                    name={[13, 14, 26, 26].includes(editData?.segmentNo) ? "middleBanner" : "smallBanner"}
                                    label="Choose Segment Image"

                                >
                                    <Upload
                                        multiple={false}
                                        listType="picture-circle"
                                        beforeUpload={() => false} // Prevents automatic upload
                                        accept="image/jpeg"
                                        onChange={handlerImage}
                                    >
                                        {uploder?.length !== 1 && <img src={editData?.smallBanner || editData?.middleBanner} className="image_hold" />}
                                    </Upload>
                                </Form.Item>
                            </Col>
                        )}

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


export default EditSegment