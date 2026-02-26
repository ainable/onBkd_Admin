import React, { useEffect, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Divider,
    Drawer,
    Form,
    Image,
    Input,
    Skeleton,
    Space,
    Upload,
    message,
} from "antd";

import { Col, Row } from "react-bootstrap"
import GooglePlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from "react-google-places-autocomplete";
import { useAuth } from "../../authentication/context/authContext";
import { InsertNewBranch, UpdateBranch } from "../../service/api_services";
import "../../style/location.css"



const EditBranch = ({ branchData, shhowAllBranchList }) => {
    const [open, setOpen] = useState(false);

    const { token } = useAuth()

    const [form] = Form.useForm();
    const [formData, setFormData] = useState(new FormData());
    const [uploder, setUploader] = useState(null)

    const showDrawer = () => {
        setOpen(true);
    };

    const cartClose = () => {
        setOpen(false);
    };


    const handlerImage = (file) => {
        setUploader(file.fileList)
    }
    console.log("branchData", branchData)

    useEffect(() => {
        form.setFieldsValue({
            branchImage: null,
            branchName: branchData.branchName,
            branchCode: branchData.branchCode,
            latitude: branchData?.location.coordinates[1],
            longitude: branchData?.location.coordinates[0],
            fullAddress: branchData.fullAddress,
            branchAlias: branchData.branchAlias,
            area: branchData.area,
            state: branchData.state
        })
    }, [branchData])


    const onFinish = async (value) => {

        try {
            value.branchImage != null && formData.append("branchImage", value.branchImage?.file);
            formData.append("branchName", value.branchName);
            formData.append("branchCode", value.branchCode);
            formData.append("latitude", value.latitude);
            formData.append("longitude", value.longitude);
            formData.append("fullAddress", value.fullAddress);
            formData.append("area", value.area);
            formData.append("state", value.state);
            formData.append("branchId", branchData._id);
            formData.append("branchAlias", value.branchAlias);


            await UpdateBranch(token, formData)
                .then((res) => {
                    console.log("add branch ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset()
                        shhowAllBranchList()
                        setFormData(new FormData())
                    }

                })
                .catch((err) => {
                    console.log(err);
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
    const onFinishFailed = (value) => {
        console.log(value)
    }

    // const handleSelect = async (value) => {
    //     try {
    //         const results = await geocodeByAddress(value.label);
    //         const latLng = await getLatLng(results[0]);
    //         console.log(value)
    //         setLatLng(latLng)
    //         form.setFieldsValue({
    //             area: value.value.structured_formatting.secondary_text,
    //             fullAddress: value.label,
    //         });
    //         setLat(latLng.lat);
    //         setLng(latLng.lng);

    //     } catch (error) {
    //         console.error('Error fetching location:', error);
    //     }
    // };



    // const handlerSelect = (place) => {
    //     setSelectedPlace(place);
    // };

    return (
        <>
            <div className="Add_Addre">
                <Button onClick={showDrawer} type="link">
                    Edit
                </Button>
            </div>
            <Drawer
                title="Update Branch"
                onClose={cartClose}
                open={open}
                placement="right"
                width={500}
            >


                <div className="add_form">
                    <Form
                        form={form}
                        layout="vertical"
                        name="basic"

                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Row>
                            <Col md={6}>

                                <Form.Item
                                    label="Branch Code"
                                    name="branchCode"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter your Branch Code!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter  Branch Code" />
                                </Form.Item>
                            </Col>
                            <Col md={6}>
                                <Form.Item
                                    label="Branch Name"
                                    name="branchName"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter your Branch Name!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter  Branch Name " />
                                </Form.Item>

                            </Col>
                        </Row>
                        {/* <div className="search_place">
              <GooglePlacesAutocomplete
                apiKey="AIzaSyDTqsRLPVAa5szoM4bH0OuHJ_ZJEneFbK8"
                value={selectedPlace}
                onSelect={handlerSelect}
                selectProps={{
                  placeholder: 'Search Branch Location...',
                  value,
                  onChange: (value) => handleSelect(value)
                }}
              />
            </div> */}
                        <Row>
                            <Col md={6}>

                                <Form.Item
                                    label="Latitude"
                                    name="latitude"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Latitude!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter  Latitude" />
                                </Form.Item>
                            </Col>
                            <Col md={6}>
                                <Form.Item
                                    label="Longitude"
                                    name="longitude"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Longitude!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter  Longitude " />
                                </Form.Item>

                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Item
                                    label="Area/Locality"
                                    name="area"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your Area/Location!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter Area / Location" />
                                </Form.Item>

                            </Col>
                            <Col md={6}>

                                <Form.Item
                                    label="State"
                                    name="state"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter your State!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter  State" />
                                </Form.Item>
                            </Col>
                        </Row>



                        <Row>
                            <Col md={6}>

                                <Form.Item
                                    label="Alias"
                                    name="branchAlias"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Alias!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter  Alias" />
                                </Form.Item>
                            </Col>
                            <Col md={6}>

                                <Form.Item
                                    label="Full Addres"
                                    name="fullAddress"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter your Full Addres",
                                        },
                                    ]}
                                >
                                    <Input.TextArea placeholder="Enter Full Addres" />
                                </Form.Item>
                            </Col>

                        </Row>



                        <Row>

                            <Col md={6}>
                                <Form.Item name="branchImage" label={uploder != null ? "If you want to change Image , please remove exiting Image" : "Choose Image"}>
                                    <Upload
                                        multiple={false}
                                        listType="picture-circle"
                                        beforeUpload={() => false} // To prevent automatic upload
                                        accept="jpg/jpeg/pdf"
                                        onChange={(e) => { handlerImage(e) }}
                                    // disabled={uploder?.length == 1}
                                    >
                                        {uploder?.length != 1 ? <img src={branchData.branchImage} id="upload_branch_img" /> : null}

                                    </Upload>

                                </Form.Item>

                            </Col>
                        </Row>

                        <Form.Item>
                            <div className="add_address_btn">
                                <Space>
                                    <Button danger shape="round" onClick={()=>setOpen(false)}>Cancel</Button>
                                    <Button type="primary" htmlType="submit" shape="round">
                                        Submit
                                    </Button>
                                </Space>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Drawer>
        </>
    );
};

export default EditBranch