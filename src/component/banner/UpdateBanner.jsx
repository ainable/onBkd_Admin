import React, { useEffect, useState } from "react";
import {
    AutoComplete,
    Button,
    Col,
    Drawer,
    Form,
    Input,
    Radio,
    Select,
    Space,
    Upload,
    message,
} from "antd";
import "../../style/banner.css"
import { useAuth } from "../../authentication/context/authContext";
import { FetchAllBrandList, FetchAllCategoryList, updateBanner } from "../../service/api_services";
import BrandSelect from "./BrandSelect";
import ProductSelect from "./ProductSelect";
import CategorySelect from "./CategorySelect";
import { MdOutlineEdit } from "react-icons/md";



function UpdateBanner({ bannerItem, ShowAllBannerList }) {
    const { token } = useAuth()
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(new FormData());
    const [form] = Form.useForm();
    const [uploder, setUploader] = useState(null)
    const [navigateType, setNavigateType] = useState(null)
    const [current, setCurrent] = useState(1)
    const [newImage, setNewImage] = useState(null)
    const [brandData, setBrandData] = useState([])
    const [categoryData, setCategoryData] = useState([])
    const [values, setValues] = useState("NAVIGATE");
    const [view, setView] = useState("WEB")

    const handleChange = (e) => {
        console.log("Selected value:", e.target.value);
        setValues(e.target.value);
    };

    console.log("bannerItem", bannerItem)

    const bannerView = [
        {
            key: 1,
            values: "WEB"
        },
        {
            key: 2,
            values: "MOBILE"
        },
    ]
    const bannerNavigateType = [
        {
            key: 1,
            values: "CATEGORY"
        },
        {
            key: 2,
            values: "BRAND"
        },
        {
            key: 3,
            values: "PRODUCT"
        },
    ]



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
        console.log("value", value)
        try {
            newImage != null && formData.append("bannerImage", value.logoFile.file);
            formData.append("navigateTo", value.navigateTo || "");
            formData.append("navigateToId", value.navigateToId || "");
            formData.append("navigateToName", value.navigateToName);
            formData.append("bannerUrl", value.bannerUrl);
            formData.append("viewIn", value.viewIn);
            formData.append("options", values);
            formData.append("bannerId", bannerItem?._id);


            await updateBanner(token, formData)
                .then((res) => {
                    console.log(" add new banner", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setOpen(false);
                        onReset();
                        setFormData(new FormData());
                        ShowAllBannerList()
                        setUploader(null)
                        setNavigateType(null)
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
        // let fileList = [...file.fileList];

        // Filter out files that are not PNG
        // fileList = fileList.filter(file => {
        //   const isPNG = file.type === 'image/png';
        //   if (!isPNG) {
        //     message.error(`${file.name} is not a PNG file Please Change image`);
        //   }
        //   return isPNG;
        // });

    }

    useEffect(() => {
        setValues(bannerItem.options)
        form.setFieldsValue({
            navigateTo: bannerItem?.navigateTo,
            navigateToId: bannerItem?.navigateToId,
            navigateToName: bannerItem?.navigateToName,
            placement: bannerItem?.placement,
            viewIn: bannerItem?.viewIn,
            bannerUrl: bannerItem?.bannerUrl || "",
            options: bannerItem?.options,
        });
    }, [bannerItem])

    const getAllBrandList = async () => {
        try {
            const res = await FetchAllBrandList(token, current);
            if (res.status === 200) {
                setBrandData(res.data.data.paginatedData);

            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllBrandList();
    }, []);

    const getCategoryList = async () => {
        try {
            const res = await FetchAllCategoryList(token, current);
            if (res.status === 200) {
                setCategoryData(res.data.data.paginatedData);


            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategoryList();
    }, []);

    const getNavigateId = () => {

        if (navigateType === "CATEGORY") {
            return (

                <CategorySelect />

            )
        } else if (navigateType === "BRAND") {
            return (

                <BrandSelect />

            )
        } else if (navigateType === "PRODUCT") {
            return (

                <ProductSelect />
            )
        }

    }

    const handelView = (value) => {
        setView(value)
    }

    return (
        <div className="modal_section">

            <MdOutlineEdit className="remove_icon" onClick={showDrawer} />


            <Drawer
                title="Edit Banner"
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
                        onFinishFailed={onFinishFailed}
                    >

                        <Col md={24}>
                            <Form.Item
                                label="Banner View"
                                name="viewIn"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Select Any View",
                                    },
                                ]}
                            >
                                <Select placeholder="Select Banner View" onChange={handelView}>
                                    {bannerView.map((opt) => (
                                        <Select.Option key={opt.key} value={opt.values}>{opt.values}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={24}>
                            <Form.Item>
                                <Radio.Group onChange={handleChange} value={values}>
                                    <Radio value="NAVIGATE">Navigate </Radio>
                                    {(view === "WEB") ? <Radio disabled={bannerItem?.viewIn !== "WEB" && view !== "WEB"} value="URL">URL</Radio> : null}
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        {values === "NAVIGATE" ? <Col md={24}>
                            <Form.Item
                                label="Banner Navigate"
                                name="navigateTo"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Select Banner Navigate",
                                    },
                                ]}
                            >
                                <Select onChange={(value) => setNavigateType(value)} placeholder="Select Banner Navigate">
                                    {bannerNavigateType.map((opt) => (
                                        <Select.Option key={opt.key} value={opt.values}>{opt.values}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col> :
                            <Col md={24}>
                                <Form.Item
                                    name="bannerUrl"
                                    label="URL"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Url",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter Url" />
                                </Form.Item>
                            </Col>}
                        <Col md={24}>
                            {getNavigateId()}
                        </Col>


                        <Col md={24}>
                            <Form.Item
                                label="Navigate Title"
                                name="navigateToName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter offer Title",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter offer Title" />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item name="logoFile" label={uploder?.length != 1 ? "Choose  Image" : "If you want to choose other image, remove exit Image"}>
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

export default UpdateBanner;