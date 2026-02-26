import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Button, Card, Form, Image, Input, Pagination, Select, Statistic, Typography, message } from "antd";
import '../../../style/master.css'
import { useLocation } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { useAuth } from "../../../authentication/context/authContext";
import { CategoryHook } from "../../../pages/CustomHooks";
import { FetchAllCategorItemList, FetchAllCategorItemListDefault, FetchAllCategoryList } from "../../../service/api_services";
import { FaRegUser } from "react-icons/fa";
import { SearchOutlined } from '@ant-design/icons';


const { Title } = Typography;
const columns = [
    {
        title: 'Item Category ID',
        dataIndex: 'itemCategoryId',
        key: 'itemCategoryId',
        ellipsis: true,

        // render: (_, { brnadID }) => (<Tag color="blue">{brnadID}</Tag>)
        render: itemCategoryId => <Tag color="blue"><strong>{itemCategoryId}</strong></Tag>

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
        title: 'Item Category',
        dataIndex: 'itemCategoryName',
        key: 'itemCategoryName',
        ellipsis: true,

    },
    {
        title: 'Item CategoryCode',
        dataIndex: 'itemCategoryCode',
        key: 'itemCategoryCode',
        ellipsis: true,

    },

];


function CategoryItem() {
    const location = useLocation();
    const [form] = Form.useForm();
    const { token, logout } = useAuth()
    const { categoryList, defaultCatId } = CategoryHook(token)
    // const [categoryList, setCategoryList] = useState([])
    // const [defaultCatId, setDefaultCatId] = useState(null)
    const [categoryId, setCategoryId] = useState(null)
    const [categoryItemList, setCategoryItemList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchInput, setSearchInput] = useState("")
    const [current, setCurrent] = useState(1)

    const [totalPage, setTotalPage] = useState(null);

    const onChange = (page) => {
        setCurrent(page);
        setIsLoading(true);
        console.log("page", page);
    };

    const handleCategoryChange = (value) => {
        setCategoryId(value)
    }



    const shhowAllCaytegoryItemList = async () => {
        try {
            await FetchAllCategorItemListDefault(token, categoryId, defaultCatId, current,
                searchInput)
                .then((res) => {
                    console.log(" all category item list ", res);
                    if (res.status == 200) {
                        setCategoryItemList(res.data.data);
                        setTotalPage(res.data.data.totalPage);
                        setIsLoading(true)
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()

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
        if (categoryList != null) {
            shhowAllCaytegoryItemList()
        }
    }, [categoryId, categoryList, searchInput, current])


    return (
        <section className="main_Section">

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
                <div className="content_title">
                    <div className="content_head">
                        <div className="content_title">
                            <Title level={4}> Category Item List</Title>
                        </div>
                        <div className="content_add">

                            <Space>

                                <Form form={form}>
                                    <Form.Item
                                        name="categoryId"
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Select Category "
                                            optionFilterProp="children"
                                            onChange={handleCategoryChange}
                                            style={{ width: '220px' }}
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
                                </Form>

                            </Space>



                        </div>
                    </div>

                </div>
            </div>
            <div className="content_title">
                <div className="content">
                    <div className="shoo_recent_order">
                        {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                            <Table columns={columns} dataSource={categoryItemList} scroll={{ x: true }}
                            />}
                    </div>
                </div>
            </div>
        </section>
    );
}





export default CategoryItem