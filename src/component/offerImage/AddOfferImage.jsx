import React, { useState } from "react";
import { Button, Col, Drawer, Form, Image, Input, Upload, message } from "antd";
import "../../style/banner.css"
import { useAuth } from "../../authentication/context/authContext";
import { InsertOfferBanner } from "../../service/api_services";

function AddOfferImage({ ShowAllOfferBannerList }) {
    const { token } = useAuth()
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(new FormData());
    const [form] = Form.useForm();
    const [uploder, setUploader] = useState(null)
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onFinish = async (value) => {
        console.log("value", value)
        try {
            formData.append("imageTitle", value.imageTitle);
            formData.append("bannerImage", value.logoFile.file);

            await InsertOfferBanner(token, formData)
                .then((res) => {
                    console.log(" add new banner", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset();
                        setFormData(new FormData());
                        ShowAllOfferBannerList()
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
            message.error(error);
            setFormData(new FormData());
        }
    };

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
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    return (
        <>
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
                    title="Add New Offer Image"
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
                                        accept=".webp"
                                        onChange={handlerImage}
                                        beforeUpload={() => false}
                                        fileList={uploder}
                                        onPreview={handlePreview}
                                    >
                                        {uploder?.length != 1 ? <img src="https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg" className="image_hold" /> : null}
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

            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: visible => setPreviewOpen(visible),
                        afterOpenChange: visible => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
}

export default AddOfferImage;