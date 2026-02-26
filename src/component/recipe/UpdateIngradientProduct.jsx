import React, { useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import {
    Form,
    Input,
    Select,
    Button,
    DatePicker,
    message,
    Image,
    Space,
    Card,
    Typography,
    Breadcrumb,
    Drawer,
} from "antd";
import { Collapse, theme } from 'antd';
import { useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import "../../style/product.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Upload } from "antd";
import { MdKeyboardBackspace, MdOutlineCloudUpload } from "react-icons/md";
import { CloseOutlined } from '@ant-design/icons';
import { useAuth } from "../../authentication/context/authContext";
import SelectProduct from "./SelectProduct";
import SelectIngradient from "./SelectIngradient";
import { InsertMoreRacipeIngradient, InsertNewRacipe } from "../../service/api_services";
import UpdateIngradient from "./UpdateIngradient";


function UpdateIngradientProduct({ showRacipeDetails }) {

    const [isLoading, setIsLoading] = useState(false)
    const [form] = Form.useForm();
    const { token } = useAuth();
    const [open, setOpen] = useState(false);

    const { id } = useParams()


    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const onFinishFailed = (errorInfo) => {
        message.error("All field is require !")
        console.log("Failed:", errorInfo);
    };

    const onFinish = async (value) => {
        try {
            await InsertMoreRacipeIngradient({ ...value, recipeId: id }, token)
                .then((res) => {
                    setIsLoading(false)
                    if (res.data.code == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset();
                        showRacipeDetails()
                    } else if (res.data.code == 202) {
                        message.error(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setIsLoading(false)
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
        <div className="Add_Addre">
            <Button type="primary" onClick={showDrawer} shape='round'>
                Add
            </Button>
            <Drawer title="Add Recipe Product" onClose={onClose} open={open}>
                <div className="Add_products">
                    <div className="add_pro_form">
                        <Form
                            form={form}
                            layout="vertical"
                            name="add-coupon"
                            className=" add_pro"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Col md={12}>
                                <UpdateIngradient />
                            </Col>
                            <div className="model_Submit">
                                <Button
                                    type="default"
                                    className="cancel_button"
                                    danger
                                    onClick={onClose}
                                    shape="round"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="submit"
                                    htmlType="submit"
                                    loading={isLoading}
                                    shape="round"
                                >
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div >
            </Drawer >
        </div>




    )
}




export default UpdateIngradientProduct