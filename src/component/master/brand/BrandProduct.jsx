// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { AutoComplete, Avatar, Breadcrumb, Button, Card, Form, Image, Pagination, Select, Statistic, Typography, message, Table, Tag, Input, Space } from "antd";
// import { useLocation, useParams } from "react-router-dom";
// import { useAuth } from "../../../authentication/context/authContext";
// import { FaRegUser } from "react-icons/fa";
// import { fetchAllBranchList, FetchAllCategorItemList, FetchAllProductList } from "../../../service/api_services";
// import '../../../style/product.css';


// const { Title } = Typography;

// const columns = [
//     {
//         title: 'productCode',
//         dataIndex: 'productCode',
//         key: 'productCode',
//         render: (_, { productCode }) => (
//             <Tag color="blue">{productCode}</Tag>
//         ),
//     },
//     {
//         title: 'Image',
//         dataIndex: 'imageUrl',
//         key: 'imageUrl',
//         render: (_, { imageUrl }) => (
//             <div className="show_cat_img" >
//                 {imageUrl[0] != null ?
//                     <Image src={imageUrl[0]} />
//                     : <Avatar icon={<FaRegUser style={{ marginTop: "-.5rem" }} />} />}
//             </div>
//         )
//     },
//     {
//         title: 'Name',
//         dataIndex: 'productName',
//         key: 'productName',
//         ellipsis: true,
//         render: (_, { productName }) => (
//             <span>{productName.substr(0, 30)}.</span>
//         ),
//     },
//     {
//         title: 'Brand',
//         dataIndex: 'brandName',
//         key: 'brandName',
//         ellipsis: true,
//     },
//     {
//         title: 'Category',
//         dataIndex: 'categoryName',
//         key: 'categoryName',
//         ellipsis: true,
//     },
//     {
//         title: 'Sub-Category',
//         dataIndex: 'subCategoryName',
//         key: 'subCategoryName',
//         ellipsis: true,

//     },
//     {
//         title: 'Pack Size',
//         dataIndex: 'packSize',
//         key: 'packSize',
//         ellipsis: true,
//     },
//     {
//         title: 'MRP Price',
//         dataIndex: 'price',
//         key: 'price',
//         ellipsis: true,
//         render: (_, { price }) => (
//             <span>₹ {price}</span>
//         )
//     },
//     {
//         title: 'BKD Amount',
//         dataIndex: 'bkdAmount',
//         key: 'bkdAmount',
//         ellipsis: true,
//         render: (_, { bkdAmount }) => (
//             <span>₹ {bkdAmount}</span>
//         )
//     },
//     {
//         title: 'Product Type',
//         dataIndex: 'productType',
//         key: 'productType',
//         ellipsis: true,
//     },
//     {
//         title: 'Stock',
//         dataIndex: 'stockQty',
//         key: 'stockQty',

//     },
//     {
//         title: 'Status',
//         key: 'status',
//         dataIndex: 'stockQty',
//         render: (_, { stockQty }) => (
//             <>
//                 {stockQty > 0 ? <Tag color="green">
//                     Stock
//                 </Tag> : <Tag color="red">
//                     Out of Stock
//                 </Tag>}
//             </>
//         ),
//     },

// ];

// function BrandProduct() {
//     const [form] = Form.useForm();
//     const { token, logout } = useAuth();
//     const [branchData, setBranchData] = useState([]);
//     const [branchId, setBranchId] = useState(null);
//     const [categoryId, setCategoryId] = useState(null);
//     const [brandId, setBrandId] = useState(null);
//     const [itemCategoryId, setItemCategoryId] = useState(null);
//     const [filterProduct, setFilterProduct] = useState([]);
//     const [catgoryItem, setCategoryItem] = useState([]);
//     const [current, setCurrent] = useState(1);
//     const [firstLoadDone, setFirstLoadDone] = useState(false);
//     const {id}=useParams()
//     const [isMoreLoading, setIsMoreLoading] = useState(false)
//     const [isLoading, setIsLoading] = useState(false);
//     const [hasMore, setHasMore] = useState(true);
//     const [searchInput, setSearchInput] = useState("");


//     console.log("brandId", brandId)

//     const observer = useRef();
//     const lastProductElementRef = useRef();

//     const location = useLocation();


//     const getAllBranchList = async () => {
//         try {
//             const res = await fetchAllBranchList(token);
//             if (res.status === 200) {
//                 setBranchData(res.data.data.data);
//                 setBranchId(res.data.data.data[0].branchCode);
//                 form.setFieldsValue({
//                     branchCode: branchId != null ? branchId : res.data.data.data[0].branchCode,
//                 });
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         getAllBranchList();
//     }, []);



//     const ShowAllProductsList = async (page = 1) => {
//         if (page === 1) {
//             setIsLoading(true);
//         } else {
//             setIsMoreLoading(true);
//         }

//         try {
//             const res = await FetchAllProductList(token, page, categoryId, itemCategoryId, id, branchId, searchInput);
//             if (res.status === 200) {
//                 setFilterProduct(prevProducts => (page === 1 ? res.data.data : [...prevProducts, ...res.data.data]));
//                 setHasMore(res.data.data.length > 0); // Check if more products are available
//             }
//         } catch (error) {
//             console.log(error);
//         } finally {
//             if (page === 1) setIsLoading(false);
//             else setIsMoreLoading(false);
//         }
//     };

//     // Fetch product list when parameters change and reset current to 1
//     useEffect(() => {
//         setCurrent(1); // Reset current to 1
//         setFilterProduct([]); // Clear previous product list
//         if (branchId) {
//             ShowAllProductsList(1).then(() => setFirstLoadDone(true));
//         }
//     }, [branchId, brandId]);

//     // Infinite scroll functionality
//     useEffect(() => {
//         if (!firstLoadDone) return;
//         if (observer.current) observer.current.disconnect();
//         observer.current = new IntersectionObserver(entries => {
//             if (entries[0].isIntersecting && hasMore && !isMoreLoading) {
//                 setCurrent(prevPage => {
//                     const nextPage = prevPage + 1;
//                     ShowAllProductsList(nextPage); // Fetch next page of products
//                     return nextPage;
//                 });
//             }
//         });
//         if (lastProductElementRef.current) observer.current.observe(lastProductElementRef.current);
//     }, [hasMore, isMoreLoading,firstLoadDone]);





//     return (
//         <section className="main_Section">
//             <Breadcrumb
//                 items={[
//                     {
//                         title: "Dashboard",
//                     },
//                     {
//                         title: location.pathname,
//                     },
//                 ]}
//             />
//             <div className="content_title">
//                 <div className="content_head">
//                     <div className="content_titles">
//                         <div className="hear_title">
//                             <Title level={4}>Brand Product List</Title>
//                         </div>

//                     </div>
//                     {/* <div className="content_add">
//                         <Space>
//                             <Form.Item name="Search Brand">
//                                 <Input
//                                     style={{ width: '220px' }}
//                                     allowClear
//                                     placeholder="Search Product Name"
//                                     suffix={<SearchOutlined />}
//                                     onChange={handleSearchChange}
//                                 />
//                             </Form.Item>
//                             <Form.Item>
//                                 <ExportProductList />

//                             </Form.Item>
//                         </Space>
//                     </div> */}
//                 </div>
//                 <div className="pro_selector">
//                     <Form
//                         form={form}
//                         layout="vertical"
//                         name="filter-product"
//                         className="filter"
//                     >
//                         <Space>
//                             <Form.Item name="branchCode">
//                                 <Select
//                                     showSearch
//                                     allowClear
//                                     placeholder="Select Branch"
//                                     optionFilterProp="children"
//                                     onChange={(value) => setBranchId(value)}
//                                     style={{ width: '220px' }}
//                                 >
//                                     {branchData?.map((option) => (
//                                         <Select.Option
//                                             key={option.branchCode}
//                                             level={option.branchName}
//                                             value={option.branchCode}
//                                         >
//                                             {option.branchName}
//                                         </Select.Option>
//                                     ))}
//                                 </Select>
//                             </Form.Item>

//                         </Space>
//                     </Form>
//                 </div>
//                 <div className="content">
//                     <div className="shoo_recent_order">
//                         {isLoading ? (
//                             <div className="loader_main"><span className="loader2"></span></div>
//                         ) : (
//                             <Table
//                                 pagination={false}
//                                 columns={columns}
//                                 dataSource={filterProduct}
//                                 scroll={{ x: true }}
//                                 rowKey={record => record.productCode}
//                             />
//                         )}
//                         <div ref={lastProductElementRef}>
//                             {isMoreLoading && <div className="loader_main"><span className="loader2"></span></div>}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }




// export default BrandProduct

import React, { useEffect, useState, useRef } from "react";
import {
    Avatar,
    Breadcrumb,
    Form,
    Image,
    Select,
    Table,
    Tag,
    Typography,
    Space,
    message,
    Button,
} from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../authentication/context/authContext";
import { FaRegUser } from "react-icons/fa";
import { fetchAllBranchList, FetchAllProductList } from "../../../service/api_services";
import '../../../style/product.css';
import { MdKeyboardBackspace } from "react-icons/md";

const { Title } = Typography;

const columns = [
    {
        title: 'Product Code',
        dataIndex: 'productCode',
        key: 'productCode',
        render: (_, { productCode }) => <Tag color="blue">{productCode}</Tag>,
    },
    {
        title: 'Image',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: (_, { imageUrl }) => (
            <div className="show_cat_img">
                {imageUrl?.[0] ? (
                    <Image src={imageUrl[0]} />
                ) : (
                    <Avatar icon={<FaRegUser style={{ marginTop: "-.5rem" }} />} />
                )}
            </div>
        ),
    },
    {
        title: 'Name',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
        render: (_, { productName }) => <span>{productName?.slice(0, 30)}.</span>,
    },
    { title: 'Brand', dataIndex: 'brandName', key: 'brandName', ellipsis: true },
    { title: 'Category', dataIndex: 'categoryName', key: 'categoryName', ellipsis: true },
    { title: 'Sub-Category', dataIndex: 'subCategoryName', key: 'subCategoryName', ellipsis: true },
    { title: 'Pack Size', dataIndex: 'packSize', key: 'packSize', ellipsis: true },
    {
        title: 'MRP Price',
        dataIndex: 'price',
        key: 'price',
        ellipsis: true,
        render: (_, { price }) => <span>₹ {price}</span>,
    },
    {
        title: 'BKD Amount',
        dataIndex: 'bkdAmount',
        key: 'bkdAmount',
        ellipsis: true,
        render: (_, { bkdAmount }) => <span>₹ {bkdAmount}</span>,
    },
    { title: 'Product Type', dataIndex: 'productType', key: 'productType', ellipsis: true },
    { title: 'Stock', dataIndex: 'stockQty', key: 'stockQty' },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'stockQty',
        render: (_, { stockQty }) =>
            stockQty > 0 ? <Tag color="green">Stock</Tag> : <Tag color="red">Out of Stock</Tag>,
    },
];

function BrandProduct() {
    const [form] = Form.useForm();
    const { token, logout } = useAuth();
    const { id: brandId } = useParams();
    const location = useLocation();
    const navigate = useNavigate()
    const [branchData, setBranchData] = useState([]);
    const [branchId, setBranchId] = useState(null);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [firstLoadDone, setFirstLoadDone] = useState(false);

    const observer = useRef();
    const lastProductRef = useRef();

    // Fetch Branch List
    const getAllBranchList = async () => {
        try {
            const res = await fetchAllBranchList(token);
            if (res.status === 200) {
                const data = res.data.data.data;
                setBranchData(data);
                setBranchId(data?.[0]?.branchCode);
                form.setFieldsValue({ branchCode: data?.[0]?.branchCode });
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllBranchList();
    }, []);

    const fetchProductList = async (page = 1) => {
        if (!branchId) return;
        if (page === 1) setIsLoading(true);
        else setIsMoreLoading(true);

        try {
            const res = await FetchAllProductList(token, page, null, null, brandId, branchId, "");
            if (res.status === 200) {
                const data = res.data.data;
                setProducts(prev => (page === 1 ? data : [...prev, ...data]));
                setHasMore(data.length > 0);
            } else if (res.data.code === 283) {
                message.error(res.data.message);
                logout();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setIsMoreLoading(false);
        }
    };

    // Reset and fetch on filter change
    useEffect(() => {
        setProducts([]);
        setCurrentPage(1);
        if (branchId) {
            fetchProductList(1).then(() => setFirstLoadDone(true));
        }
    }, [branchId, brandId]);

    // Infinite Scroll
    useEffect(() => {
        if (!firstLoadDone) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isMoreLoading) {
                const nextPage = currentPage + 1;
                fetchProductList(nextPage);
                setCurrentPage(nextPage);
            }
        });

        if (lastProductRef.current) {
            observer.current.observe(lastProductRef.current);
        }
    }, [firstLoadDone, hasMore, isMoreLoading, currentPage]);

    return (
        <section className="main_Section">
            <Breadcrumb
                items={[
                    { title: "Dashboard" },
                    { title: location.pathname },
                ]}
            />
            <div className="content_title">
                <div className="content_head">
                    <div className="content_titles">
                        <Space>
                            <Button type="circle" onClick={() => navigate(-1)}> <MdKeyboardBackspace className="back_icon" /></Button>

                            <Title level={4}>Brand Product List</Title>
                        </Space>
                    </div>
                    <Form form={form} layout="vertical" className="filter">
                        <Space>
                            <Form.Item name="branchCode">
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Branch"
                                    onChange={value => setBranchId(value)}
                                    style={{ width: 220 }}
                                >
                                    {branchData.map(option => (
                                        <Select.Option key={option.branchCode} value={option.branchCode}>
                                            {option.branchName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
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
                                dataSource={products}
                                scroll={{ x: true }}
                                rowKey={record => record.productCode}
                            />
                        )}
                        <div ref={lastProductRef}>
                            {isMoreLoading && <div className="loader_main"><span className="loader2"></span></div>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BrandProduct;
