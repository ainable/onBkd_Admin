import React, { useEffect, useState } from "react";
import { Button, Col, Drawer, Form, Input, Upload, message } from "antd";
import "../../style/banner.css"
import { useAuth } from "../../authentication/context/authContext";
import { updateOfferBanner } from "../../service/api_services";
import { MdOutlineEdit } from "react-icons/md";

function UpdateOfferImage({ bannerItem, ShowAllBannerList }) {
    const { token } = useAuth()
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(new FormData());
    const [uploder, setUploader] = useState(null)
    const [newImage, setNewImage] = useState(null)

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onFinish = async (value) => {
        try {
            newImage != null && formData.append("bannerImage", value.logoFile.file);
            formData.append("imageTitle", value.imageTitle);

            await updateOfferBanner(token, formData)
                .then((res) => {
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset();
                        setFormData(new FormData());
                        ShowAllBannerList()
                        setUploader(null)
                    } else if (res.status == 200) {
                        message.error(res.data.message);
                    }
                })
                .catch((err) => {
                    message.error(err.message);
                    setFormData(new FormData());

                });
        } catch (error) {
            console.log(error);
            setFormData(new FormData());
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    const handlerImage = (file) => {
        setNewImage(file.file)
        setUploader(file.fileList)
    }

    useEffect(() => {
        form.setFieldsValue({
            imageTitle: bannerItem?.imageTitle,
        });
    }, [bannerItem])

    return (
        <div className="modal_section">
            <MdOutlineEdit className="remove_icon" onClick={showDrawer} />
            <Drawer
                title="Edit Offer Image"
                placement="right"
                width={360}
                onClose={onClose}
                open={open}
            >
                <div className="add_category_form">
                    <Form
                        form={form}
                        layout="vertical"
                        name="add-image"
                        className="images"
                        initialValues={{
                            placement: "BANNER"
                        }}
                        onFinish={onFinish}
                    >
                        <Col md={24}>
                            <Form.Item
                                label="Image Title"
                                name="imageTitle"
                                rules={[{ required: true, message: "Please Enter Image Title" }]}
                            >
                                <Input placeholder="Enter Image Title" />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                name="logoFile"
                                label={uploder?.length != 1 ? "Choose  Image" : "If you want to choose other image, remove exit Image"}
                            >
                                <Upload
                                    multiple={false}
                                    listType="picture-circle"
                                    accept=".jpg"
                                    onChange={handlerImage}
                                    beforeUpload={() => false}
                                >
                                    {uploder?.length != 1 ? <img src={bannerItem?.bannerImage} className="image_hold" /> : null}
                                </Upload>
                            </Form.Item>
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

export default UpdateOfferImage;