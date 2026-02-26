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
import { useLocation, useNavigate } from "react-router-dom";
import { Upload } from "antd";
import { MdKeyboardBackspace, MdOutlineCloudUpload } from "react-icons/md";
import { CloseOutlined } from '@ant-design/icons';
import { useAuth } from "../../authentication/context/authContext";
import SelectProduct from "./SelectProduct";
import SelectIngradient from "./SelectIngradient";
import { DeleteRacipeImage, InsertNewRacipe, UpdateRacipe } from "../../service/api_services";
import UpdateIngradient from "./UpdateIngradient";


function EditRacipe({ recipeData, showRacipeDetails }) {


    const [uploder, setUploader] = useState(null)
    const [formData, setFormData] = useState(new FormData());
    const [fileList, setFileList] = useState([]);

    const [isLoading, setIsLoading] = useState(false)

    const [form] = Form.useForm();
    const { token } = useAuth();
    const [open, setOpen] = useState(false);
    const { recipeTitle, cookingTime, recipeDescription, cookingSteps, recipeImages, ingredients } = recipeData


    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setFileList(
            recipeImages?.map((url, index) => ({
                key: index,
                url: url
            }))
        );
        const formattedStep = cookingSteps?.map((step) => ({ steps: step }))
        form.setFieldsValue({
            recipeTitle,
            cookingTime,
            recipeDescription,
            cookingSteps: formattedStep,

        })
    }, [recipeData])

    const onFinishFailed = (errorInfo) => {
        message.error("All field is require !")
        console.log("Failed:", errorInfo);
    };

    const onFinish = async (value) => {
        const step = value.cookingSteps.map((item) => item.steps)
        setIsLoading(true)
        try {
           
            // uploder && fileList.forEach((file) => {
            //     formData.append("recipeImages", file.originFileObj);
            // });

            formData.append("cookingTime", value.cookingTime);
            formData.append("recipeTitle", value.recipeTitle);
            formData.append("recipeDescription", value.recipeDescription);
            formData.append("cookingSteps", JSON.stringify(step));
            formData.append("recipeId", recipeData._id);
            
            fileList.forEach((file) => {
                if (!file.url) {
                    formData.append("recipeImages", file.originFileObj);
                } 
            })
            await UpdateRacipe(formData, token)
                .then((res) => {
                    setIsLoading(false)

                    if (res.data.code == 201) {
                        message.success(res.data.message);
                        setOpen(false);

                        setFormData(new FormData());
                        setUploader(null)

                        showRacipeDetails()
                    } else if (res.data.code == 202) {
                        message.error(res.data.message);
                        setFormData(new FormData());
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setFormData(new FormData());
                    setIsLoading(false)


                });
        } catch (error) {
            console.log(error);
            setFormData(new FormData());
            setIsLoading(false)


        }
    };



    


    const handleChanges = ({ fileList }) => {
        setFileList(fileList);
        setUploader(fileList.file)
        console.log("fileList", fileList);
    };

    const beforeUpload = (file) => {
        if (fileList.length >= 5) {
            message.error('You can only upload up to 4 images.');
            return false;
        }
        return false;
    };

    const handleRemoveImage = async (file) => {
        console.log(file)
        const body = {
            recipeId: recipeData?._id,
            recipeImage: file.url
        }
        try {
            await DeleteRacipeImage(body, token)
                .then((res) => {
                    console.log("  image delete ", res);
                    if (res.data.code == 201) {
                        message.success(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="Add_Addre">
            <Button type="primary" onClick={showDrawer} shape='round'>
                Edit
            </Button>
            <Drawer title="Edit Recipe" onClose={onClose} open={open}>
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



                            {/* <Col md={12}>
                                <SelectProduct />
                            </Col> */}

                            <Col md={12}>
                                <Form.Item
                                    label=" Recipe Title"
                                    name="recipeTitle"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Recipe Title  !",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter Recipe title"

                                    />
                                </Form.Item>
                            </Col>

                            <Col md={12}>
                                <Form.Item
                                    label=" Cooking Time"
                                    name="cookingTime"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Cooking Time  !",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter Cooking Time"

                                    />
                                </Form.Item>
                            </Col>



                            <Col md={12}>
                                <Form.Item
                                    label=" Recipe Description"
                                    name="recipeDescription"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Recipe Description  !",
                                        },
                                    ]}
                                >
                                    <Input.TextArea
                                        placeholder="Enter Recipe Description"

                                    />
                                </Form.Item>
                            </Col>

                            {/* <Col md={12}>
                                <UpdateIngradient ingredients={ingredients} setIngradientData={setIngradientData} />
                            </Col> */}
                            <Row>

                                <Col md={12}>
                                    <Card
                                        title="Add Cooking Steps"
                                        size="small">

                                        <Form.List
                                            label="Step"
                                            name="cookingSteps"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Enter cooking steps  !",
                                                },
                                            ]}
                                        >
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(({ key, name, ...restField }, index) => (
                                                        <Col md={12}>
                                                            <Row>

                                                                <Col md={10}>
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'steps']}

                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: 'Steps is require',
                                                                            },
                                                                        ]}
                                                                    >
                                                                        <Input style={{ width: "100%" }} placeholder={`Step ${index + 1}`} />
                                                                    </Form.Item>
                                                                </Col>

                                                                <Col md={2}>

                                                                    <MinusCircleOutlined style={{ color: "red", fontSize: "1rem" }} onClick={() => remove(name)} />
                                                                </Col>
                                                            </Row>


                                                        </Col>
                                                    ))}
                                                    <Form.Item>
                                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                            Add Step
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Item name="recipeImages" rules={[
                                        {
                                            required: false,
                                            message: "Please select at least 1 Image !",
                                        },
                                    ]} label="Choose  Image">
                                        <Upload
                                            multiple
                                            onChange={handleChanges}
                                            valuePropName="fileList"
                                            fileList={fileList}
                                            listType="picture-circle"
                                            beforeUpload={beforeUpload} // To prevent automatic upload} // To prevent automatic upload
                                            accept="jpg/jpeg/png"
                                            maxCount={5}
                                            onRemove={(file) => handleRemoveImage(file)}

                                        >
                                            <img src="https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg" className="image_hold" />
                                        </Upload>
                                    </Form.Item>

                                </Col>

                            </Row>

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


export default EditRacipe