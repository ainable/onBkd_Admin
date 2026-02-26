import React, { useEffect, useState, useRef, useCallback } from "react";
import { AutoComplete, Avatar, Breadcrumb, Button, Card, Form, Image, Pagination, Select, Statistic, Typography, message, Table, Tag, Input, Space } from "antd";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../authentication/context/authContext";
import { Col, Row } from "react-bootstrap";
import { FaRegUser } from "react-icons/fa";
import { fetchAllBranchList, FetchAllCategorItemList, FetchAllProductList } from "../../service/api_services";
import SelectBrandData from "./SelectBrandData";
import '../../style/product.css';
import { SearchOutlined } from '@ant-design/icons';
import CategoryFilter from "./CategoryFilter";
import ExportProductList from "./ExportProductList";

const { Title } = Typography;

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

];

function Products() {
    const [form] = Form.useForm();
    const { token, logout } = useAuth();
    const [branchData, setBranchData] = useState([]);
    const [branchId, setBranchId] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [brandId, setBrandId] = useState(null);
    const [itemCategoryId, setItemCategoryId] = useState(null);
    const [filterProduct, setFilterProduct] = useState([]);
    const [catgoryItem, setCategoryItem] = useState([]);
    const [current, setCurrent] = useState(1);
    const [firstLoadDone, setFirstLoadDone] = useState(false);

    const [isMoreLoading, setIsMoreLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


    const filtersRef = useRef({
        categoryId: null,
        brandId: null,
        itemCategoryId: null,
        branchId: null,
        searchInput: ""
    });


    useEffect(() => {
        filtersRef.current = {
            categoryId,
            brandId,
            itemCategoryId,
            branchId,
            searchInput
        };
    }, [categoryId, brandId, itemCategoryId, branchId, searchInput]);


    console.log("brandId", brandId)
    const observer = useRef();
    const lastProductElementRef = useRef();

    const location = useLocation();



    const getAllCategoryItem = async () => {
        try {
            const res = await FetchAllCategorItemList(token,
                categoryId,
                current,
                searchInput,
            );
            if (res.status === 200) {
                setCategoryItem(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (categoryId != null) {
            getAllCategoryItem();
        }
    }, [categoryId]);

    const getAllBranchList = async () => {
        try {
            const res = await fetchAllBranchList(token);
            if (res.status === 200) {
                setBranchData(res.data.data.data);
                setBranchId(res.data.data.data[0].branchCode);
                form.setFieldsValue({
                    branchCode: branchId != null ? branchId : res.data.data.data[0].branchCode,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllBranchList();
    }, []);



    const ShowAllProductsList = async (page = 1) => {
        const { categoryId, brandId, itemCategoryId, branchId, searchInput } = filtersRef.current;
        if (page === 1) {
            setIsLoading(true);
        } else {
            setIsMoreLoading(true);
        }

        try {
            const res = await FetchAllProductList(token, page, categoryId, itemCategoryId, brandId, branchId, searchInput);
            if (res.status === 200) {
                setFilterProduct(prevProducts => (page === 1 ? res.data.data : [...prevProducts, ...res.data.data]));
                setHasMore(res.data.data.length > 0); // Check if more products are available
            }
        } catch (error) {
            console.log(error);
        } finally {
            if (page === 1) setIsLoading(false);
            else setIsMoreLoading(false);
        }
    };

    // Fetch product list when parameters change and reset current to 1
    useEffect(() => {
        setCurrent(1); // Reset current to 1
        setFilterProduct([]); // Clear previous product list
        if (branchId) {
            ShowAllProductsList(1).then(() => setFirstLoadDone(true));
        }
    }, [branchId, categoryId, itemCategoryId, brandId, searchInput]);

    // Infinite scroll functionality
    useEffect(() => {
        if (!firstLoadDone) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isMoreLoading) {
                setCurrent(prevPage => {
                    const nextPage = prevPage + 1;
                    ShowAllProductsList(nextPage); // Fetch next page of products
                    return nextPage;
                });
            }
        });
        if (lastProductElementRef.current) observer.current.observe(lastProductElementRef.current);
    }, [hasMore, isMoreLoading, firstLoadDone]);

    const debounceSearch = useCallback(
        debounce((value) => {
            setSearchInput(value);
        }, 1000),
        []
    );

    const handleSearchChange = (e) => {
        debounceSearch(e.target.value);
    };

    return (
        <section className="main_Section">
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
                    <div className="content_titles">
                        <div className="hear_title">
                            <Title level={4}> Product List</Title>
                        </div>

                    </div>
                    <div className="content_add">
                        <Space>
                            <Form.Item name="Search Brand">
                                <Input
                                    style={{ width: '220px' }}
                                    allowClear
                                    placeholder="Search Product Name"
                                    suffix={<SearchOutlined />}
                                    onChange={handleSearchChange}
                                />
                            </Form.Item>
                            <Form.Item>
                                <ExportProductList />

                            </Form.Item>
                        </Space>
                    </div>
                </div>
                <div className="pro_selector">
                    <Form
                        form={form}
                        layout="vertical"
                        name="filter-product"
                        className="filter"
                    >
                        <Space>
                            <Form.Item name="branchCode">
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Branch"
                                    optionFilterProp="children"
                                    onChange={(value) => setBranchId(value)}
                                    style={{ width: '220px' }}
                                >
                                    {branchData?.map((option) => (
                                        <Select.Option
                                            key={option.branchCode}
                                            level={option.branchName}
                                            value={option.branchCode}
                                        >
                                            {capitalize(option.branchName)}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <CategoryFilter setCategoryId={setCategoryId} setCurrent={setCurrent} brandId={brandId} />
                            <Form.Item name="categoryItemId">
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Category Item"
                                    optionFilterProp="children"
                                    onChange={(value) => setItemCategoryId(value)}
                                    style={{ width: '220px' }}
                                >
                                    {catgoryItem?.map((option) => (
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

                            <SelectBrandData setBrandId={setBrandId} brandId={brandId} />
                        </Space>
                    </Form>
                </div>
                <div className="content">
                    <div className="shoo_recent_order">
                        {isLoading ? (
                            <div className="loader_main"><span className="loader2"></span></div>
                        ) : (
                            <Table
                                pagination={false}
                                columns={columns}
                                dataSource={filterProduct}
                                scroll={{ x: true }}
                                rowKey={record => record.productCode}
                            />
                        )}
                        <div ref={lastProductElementRef}>
                            {isMoreLoading && <div className="loader_main"><span className="loader2"></span></div>}
                        </div>
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

export default Products;
