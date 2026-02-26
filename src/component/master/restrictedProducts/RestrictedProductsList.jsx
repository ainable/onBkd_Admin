import React, { useEffect, useState, useCallback } from "react";
import { Avatar, Breadcrumb, Button, Form, Image, Pagination, Typography, message, Table, Tag, Input, Space, Popconfirm } from "antd";
import { useLocation } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import '../../../style/product.css';
import { SearchOutlined } from '@ant-design/icons';
import { useAuth } from "../../../authentication/context/authContext";
import { DeleteRestrictedProduct, FetchAllRestrictedProductList } from "../../../service/api_services";
import AddRestrictedProduct from "./AddRestrictedProduct";

const { Title } = Typography;

function RestrictedProductsList() {
    const { token, logout } = useAuth();
    const [filterProduct, setFilterProduct] = useState([]);
    const [current, setCurrent] = useState(1)
    const [totalPage, setTotalPage] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const columns = [
        {
            title: 'productCode',
            dataIndex: 'productCode',
            key: 'productCode',
            render: (_, { productCode }) => (
                <Tag color="blue">{productCode}</Tag>
            ),
        },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (_, { imageUrl }) => (
                <div className="show_cat_img" >
                    {imageUrl[0] != null ?
                        <Image src={imageUrl[0]} />
                        : <Avatar icon={<FaRegUser style={{ marginTop: "-.5rem" }} />} />}
                </div>
            )
        },
        {
            title: 'Name',
            dataIndex: 'productName',
            key: 'productName',
            ellipsis: true,
            render: (_, { productName }) => (
                <span>{productName.substr(0, 30)}.</span>
            ),
        },
        {
            title: 'Brand',
            dataIndex: 'brandName',
            key: 'brandName',
            ellipsis: true,
        },
        {
            title: 'Category',
            dataIndex: 'categoryName',
            key: 'categoryName',
            ellipsis: true,
        },
        {
            title: 'Sub-Category',
            dataIndex: 'subCategoryName',
            key: 'subCategoryName',
            ellipsis: true,

        },
        {
            title: 'Pack Size',
            dataIndex: 'packSize',
            key: 'packSize',
            ellipsis: true,
        },
        {
            title: 'MRP Price',
            dataIndex: 'price',
            key: 'price',
            ellipsis: true,
            render: (_, { price }) => (
                <span>₹ {price}</span>
            )
        },
        {
            title: 'BKD Amount',
            dataIndex: 'bkdAmount',
            key: 'bkdAmount',
            ellipsis: true,
            render: (_, { bkdAmount }) => (
                <span>₹ {bkdAmount}</span>
            )
        },
        {
            title: 'Product Type',
            dataIndex: 'productType',
            key: 'productType',
            ellipsis: true,
        },
        {
            title: 'Stock',
            dataIndex: 'stockQty',
            key: 'stockQty',

        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'stockQty',
            render: (_, { stockQty }) => (
                <>
                    {stockQty > 0 ? <Tag color="green">
                        Stock
                    </Tag> : <Tag color="red">
                        Out of Stock
                    </Tag>}
                </>
            ),
        },
        {
            title: " Action"
            ,
            dataIndex: "_id",
            key: "_id",
            fixed: "right",
            render: (_, { _id }) => (
                <div className="action">
                    <Popconfirm
                        title="Delete the Discount"
                        description="Are you sure to delete this Discount?"
                        onConfirm={() => deleteDiscountHandle(_id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" shape="round" danger>Delete</Button>
                    </Popconfirm>



                </div>

            ),
        },
    ];

    const onChange = (page) => {
        setCurrent(page);
        setIsLoading(true);
    };

    const location = useLocation();

    const ShowAllProductsList = async () => {
        setIsLoading(true);

        try {
            await FetchAllRestrictedProductList(token, current, searchInput)
                .then((res) => {
                    if (res.status == 200) {
                        setFilterProduct(res.data.data.data);
                        setTotalPage(res.data.data.totalPages);
                        setIsLoading(false)
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()
                    }
                })
                .catch((err) => {
                    message.error(err.message);
                    setIsLoading(false)
                });
        } catch (error) {
            message.error(error);
            setIsLoading(false)
        }
    };

    useEffect(() => {
        ShowAllProductsList()
    }, [current, searchInput]);

    const debounceSearch = useCallback(
        debounce((value) => {
            setSearchInput(value);
        }, 1000),
        []
    );

    const handleSearchChange = (e) => {
        debounceSearch(e.target.value);
    };

    const deleteDiscountHandle = async (id) => {
        try {
            let body = {
                discountId: id,
            };
            await DeleteRestrictedProduct(body, token)
                .then((res) => {
                    if (res.status == 200) {
                        message.success(res.data.message);
                        ShowAllProductsList();
                    }
                })
                .catch((err) => {
                    message.error(err.response.msg);
                });
        } catch (error) {
            message.error(error);
            setIsLoading(true);
        }
    };

    return (
        <section className="main_Section">
            <Breadcrumb
                items={[
                    {
                        title: <a style={{ textDecoration: 'none' }} href="/dashboard">Dashboard</a>,
                    },
                    {
                        title: "Restricted Products",
                    },
                ]}
            />
            <div className="content_title">
                <div className="content_head">
                    <div className="content_titles">
                        <div className="hear_title">
                            <Title level={4}>Restricted Product List</Title>
                        </div>

                    </div>
                    <div className="content_add">
                        <Space>
                            {/* <Form.Item name="Search Brand">
                                <Input
                                    style={{ width: '220px' }}
                                    allowClear
                                    placeholder="Search Product Name"
                                    suffix={<SearchOutlined />}
                                    onChange={handleSearchChange}
                                />
                            </Form.Item> */}
                            <Form.Item>
                                <AddRestrictedProduct ShowAllProductsList={ShowAllProductsList} />
                            </Form.Item>
                        </Space>
                    </div>
                </div>
                <div className="content">
                    <div className="shoo_recent_order">
                        {isLoading ?
                            <div className="loader_main"><span class="loader2"></span></div>
                            :
                            <Table
                                columns={columns}
                                dataSource={filterProduct}
                                scroll={{ x: true }}
                                pagination={false}
                                footer={() =>
                                    <div className="pagination">
                                        <Pagination current={current} onChange={onChange} total={totalPage * 10} />
                                    </div>
                                }
                            />
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default RestrictedProductsList;
