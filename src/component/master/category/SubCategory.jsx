import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Button, Card, Form, Image, Select, Statistic, Typography } from "antd";
import '../../../style/master.css'
import { useLocation } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { useAuth } from "../../../authentication/context/authContext";
import { CategoryHook } from "../../../pages/CustomHooks";
import { FetchAllCategorItemList, FetchAllCategoryList, FetchAllSubCategorList } from "../../../service/api_services";
import { FaRegUser } from "react-icons/fa";
import { Col, Row } from "react-bootstrap";



const { Title } = Typography;
const columns = [
    {
        title: 'Item Category ID',
        dataIndex: 'subCategoryId',
        key: 'subCategoryId',
        ellipsis: true,

        // render: (_, { brnadID }) => (<Tag color="blue">{brnadID}</Tag>)
        render: subCategoryId => <Tag color="blue"><strong>{subCategoryId}</strong></Tag>

    },
    {
        title: 'Image',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: (_, { imageUrl }) => (
            <div className="show_cat_img" >
                {imageUrl != null ? <Image src={imageUrl} width={40} height={40} style={{ borderRadius: "100%", objectFit: "contain", background: "lightGray" }} /> : <Avatar size={40} icon={<FaRegUser style={{ marginTop: "-.5rem" }} />} />}

            </div>
        )
    },
    {
        title: ' Sub Category Name',
        dataIndex: 'subCategoryName',
        key: 'subCategoryName',
        ellipsis: true,

    },
    {
        title: 'Sub Category Code',
        dataIndex: 'subCategoryCode',
        key: 'subCategoryCode',
        ellipsis: true,
        render: subCategoryCode => <strong>{subCategoryCode}</strong>


    },

];


function SubCategory() {
    const location = useLocation();
    const [form] = Form.useForm();
    const { token } = useAuth()
    const { categoryList, defaultCatId } = CategoryHook(token)
    const [defaultItemCatId, setDefaultItemCatId] = useState(null)
    const [categoryId, setCategoryId] = useState(null)
    const [categoryItemList, setCategoryItemList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [current, setCurrent] = useState(1)
    const [categoryItemId, setCategoryItemId] = useState(null)
    const [subCategoryList, setSubCategoryList] = useState([])




    const handleCategoryChange = (value) => {
        setCategoryId(value)
    }
    const handleItemCategoryChange = (value) => {
        setCategoryItemId(value)
    }




    const shhowAllCaytegoryItemList = async () => {
        try {
            await FetchAllCategorItemList(token, categoryId, defaultCatId)
                .then((res) => {
                    console.log(" all category item list ", res);
                    if (res.status == 200) {
                        setCategoryItemList(res.data.data);
                        setDefaultItemCatId(res.data.data[0].itemCategoryId);
                        setIsLoading(true)
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setIsLoading(true)

                });
        } catch (error) {
            console.log(error);
            setIsLoading(true)

        }
    };



    const shhowSubCaytegoryList = async () => {
        try {
            await FetchAllSubCategorList(token, categoryItemId, defaultItemCatId)
                .then((res) => {
                    console.log(" sub category  list ", res);
                    if (res.status == 200) {
                        setSubCategoryList(res.data.data);
                        setIsLoading(true)
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setIsLoading(true)

                });
        } catch (error) {
            console.log(error);
            setIsLoading(true)

        }
    };
    useEffect(() => {

        if (defaultCatId != null) {
            form.setFieldsValue({
                categoryId: categoryId == null ? defaultCatId : categoryId,
            });
        }

        if (defaultItemCatId != null) {
            form.setFieldsValue({
                categoryItemId: categoryItemId == null ? defaultItemCatId : categoryItemId,
            });
        }
        if (categoryList != null) {
            shhowAllCaytegoryItemList()
        }
        if (categoryItemList != null) {
            shhowSubCaytegoryList()
        }
    }, [categoryId, categoryList, categoryItemId])



    return (
        <section className="main_Section">
            <div className="section_title">
                <div className="section_title_left">
                    <Breadcrumb
                        items={[
                            {
                                title: "Dashboard",
                            },
                            {
                                title: location.pathname,
                            },
                        ]}
                    />
                    <div className="section_actions">
                        <Space>

                            <Title level={4}>Sub Category List</Title>

                            <Form form={form}>

                                <Row>
                                    <Col md={6}>

                                        <Form.Item
                                            name="categoryId"

                                        >
                                            <Select
                                                showSearch
                                                placeholder="Select Category "
                                                optionFilterProp="children"
                                                onChange={handleCategoryChange}
                                                style={{ width: "200px" }}
                                            >
                                                {categoryList?.map((option) => (
                                                    <Select.Option
                                                        key={option.categoryID}
                                                        level={option.categoryName}
                                                        value={option.categoryID}
                                                    >
                                                        {option.categoryName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col md={6}>

                                        <Form.Item
                                            name="categoryItemId"

                                        >
                                            <Select
                                                showSearch
                                                placeholder="Select Item Category "
                                                optionFilterProp="children"
                                                onChange={handleItemCategoryChange}
                                                style={{ width: '200px' }}
                                            >
                                                {categoryItemList?.map((option) => (
                                                    <Select.Option
                                                        key={option.itemCategoryId}
                                                        level={option.itemCategoryName}
                                                        value={option.itemCategoryId}
                                                    >
                                                        {option.itemCategoryName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Space>
                    </div>
                </div>


            </div>

            <div className="content_title">

                <div className="content">
                    <div className="shoo_recent_order">
                        {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                            <Table columns={columns} dataSource={subCategoryList} scroll={{ x: true }} />}
                    </div>
                </div>


            </div>

        </section>
    );
}





export default SubCategory