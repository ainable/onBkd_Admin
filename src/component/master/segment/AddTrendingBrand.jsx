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
import { AddCustomSegment, AddTrenddBrand } from "../../../service/api_services";
import { Col } from "react-bootstrap";
import ProductSelect from "./SelectProduct";
import { EyeOutlined, UploadOutlined } from '@ant-design/icons';
import ViewFormate from "../../../assest/png/segmet-review.jpg"
import SearchBrand from "./SearchBrand";

function AddTrendingBrand({ showTrendingBrnad }) {

    const { token, logout } = useAuth()
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)
    const [brandData, setBrandData] = useState({
        brandId: "",
        brandName: "",
        brandCode: "",
    })

    const options = Array.from({ length: 50 }, (_, i) => i + 1);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const onFinish = async (value) => {
        setIsLoading(true)
        try {
            await AddTrenddBrand(token, { ...brandData, priority: value.priority })
                .then((res) => {
                    console.log(" add trand brand", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset();
                        showTrendingBrnad()
                        setIsLoading(false)

                    } else if (res.status == 200) {
                        message.error(res.data.message);
                        setIsLoading(false)


                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()
                    }
                })
                .catch((err) => {
                    message.error(err.message);
                });
        } catch (error) {
            console.log(error);
            setIsLoading(false)

        }
    };

    const onReset = () => {
        form.resetFields();
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
                title="Add Trending Brand"
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
                            <SearchBrand title="trending" setBrandData={setBrandData} />
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label="Select priority"
                                name="priority"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please choose any 1 number",
                                    },
                                ]}
                            >
                                <Select placeholder="Select Priority Number" >
                                    {options.map((opt) => (
                                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

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

export default AddTrendingBrand