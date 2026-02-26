// import React, { useEffect, useState } from "react";
// import { Avatar, Breadcrumb, Button, Form, Image, Input, Pagination, Statistic, Typography, message } from "antd";
// import '../../../style/master.css'
// import { useLocation, useNavigate } from "react-router-dom";
// import { Space, Table, Tag } from 'antd';
// import { FetchAllBrandList } from "../../../service/api_services";
// import { useAuth } from "../../../authentication/context/authContext";
// import { FaUser } from "react-icons/fa";
// import { SearchOutlined } from '@ant-design/icons';



// const { Title } = Typography;
// const columns = [
//     {
//         title: 'Brand ID',
//         dataIndex: 'brandID',
//         key: 'brandID',
//         // render: (_, { brnadID }) => (<Tag color="blue">{brnadID}</Tag>)
//         render: brnadID => <Tag color="blue"><strong>{brnadID}</strong></Tag>

//     },
//     {
//         title: 'Image',
//         dataIndex: 'imageUrl',
//         key: 'imageUrl',
//         render: (_, { imageUrl }) => (
//             <div className="show_cat_img" >
//                 {imageUrl != null ? <Image src={imageUrl} width={50} height={50} style={{ borderRadius: "100%", objectFit: "contain", background: "lightGray" }} /> : <Avatar size={45} icon={<FaUser />} />}

//             </div>
//         )
//     },
//     {
//         title: 'Brand Name',
//         dataIndex: 'brandName',
//         key: 'brandName',
//     },


//     {
//         title: 'Brand Code',
//         dataIndex: 'brandCode',
//         key: 'brandCode',
//         render: brandCode => <strong>{brandCode}</strong>

//     },


// ];



// function BrandListing() {

//     const location = useLocation();
//     const navigate = useNavigate()
//     const { token, logout } = useAuth();
//     const [brandList, setBrandList] = useState([])
//     const [isLoading, setIsLoading] = useState(false);
//     const [searchInput, setSearchInput] = useState(null)

//     const [totalPage, setTotalPage] = useState(null);

//     const [current, setCurrent] = useState(1);

//     const onChange = (page) => {
//         setCurrent(page);
//         setIsLoading(true);
//         console.log("page", page);
//     };

//     const shhowAllBrandList = async () => {
//         try {
//             await FetchAllBrandList(token, current, searchInput)
//                 .then((res) => {
//                     console.log(" all brand list ", res);
//                     if (res.status == 200) {
//                         setBrandList(res.data.data.paginatedData);
//                         setTotalPage(res.data.data.totalPage)
//                         setIsLoading(true)
//                     } else if (res.data.code == 283) {
//                         message.error(res.data.message)
//                         logout()

//                     }
//                 })
//                 .catch((err) => {
//                     console.log(err.message);
//                 });
//         } catch (error) {
//             console.log(error);
//             setIsLoading(true)
//         }
//     };

//     useEffect(() => {
//         shhowAllBrandList();
//     }, [current,searchInput]);

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
//                     <div className="content_title">
//                         <Title level={4}>BRAND LIST</Title>
//                     </div>
//                     <div className="content_add">
//                         <Form.Item
//                             name="Search Brand"
//                         >
//                             <Input style={{ width: '200px' }} placeholder="Search Brand" suffix={<SearchOutlined />} onChange={(e) => setSearchInput(e.target.value)} />
//                         </Form.Item>
//                     </div>
//                 </div>
//                 <div className="content">
//                     <div className="shoo_recent_order">
//                         {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={columns} dataSource={brandList} scroll={{ x: true }} pagination={false}
//                             footer={() => <div className="pagination">
//                                 <Pagination current={current} onChange={onChange} total={totalPage * 10} />
//                             </div>} />}
//                     </div>
//                 </div>


//             </div>

//         </section>
//     );
// }




// export default BrandListing



import React, { useEffect, useState, useCallback } from "react";
import { Avatar, Breadcrumb, Button, Form, Image, Input, Pagination, Statistic, Typography, message } from "antd";
import '../../../style/master.css';
import { useLocation, useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { exportBrandList, FetchAllBrandList } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";
import { FaUser } from "react-icons/fa";
import { SearchOutlined } from '@ant-design/icons';
import _ from 'lodash'; // Import lodash

const { Title } = Typography;


function BrandListing() {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, logout } = useAuth();
    const [brandList, setBrandList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [totalPage, setTotalPage] = useState(null);
    const [current, setCurrent] = useState(1);
    const [isExportLoading, setExportLoading] = useState(false)

    const onChange = (page) => {
        setCurrent(page);
        setIsLoading(true);
        console.log("page", page);
    };

    const columns = [
        {
            title: 'Brand ID',
            dataIndex: 'brandID',
            key: 'brandID',
            width:"20%",
            
            render: brandID => <Tag color="blue"><strong>{brandID}</strong></Tag>
        },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width:"20%",
    
            render: (_, { imageUrl }) => (
                <div className="show_cat_img">
                    {imageUrl != null ? <Image src={imageUrl} width={50} height={50} style={{ borderRadius: "100%", objectFit: "contain", background: "lightGray" }} /> : <Avatar size={45} icon={<FaUser />} />}
                </div>
            )
        },
        {
            title: 'Brand Name',
            dataIndex: 'brandName',
            key: 'brandName',
            width:"30%",
    
    
        },
        {
            title: 'Brand Code',
            dataIndex: 'brandCode',
            key: 'brandCode',
            width:"20%",
            render: brandCode => <strong>{brandCode}</strong>
        },
        {
            title: 'Action',
            dataIndex: 'brandID',
            key: 'brandID',
            width:"10%",
            render: brandID =>  <Button type="primary" shape="round" onClick={()=>navigate(`/dashboard/brand-product/${brandID}`)}>View Product</Button>
            
        },
    ];
    
    const fetchAllBrandList = async () => {
        try {
            const res = await FetchAllBrandList(token, current, searchInput);
            console.log("all brand list", res);
            if (res.status === 200) {
                setBrandList(res.data.data.paginatedData);
                setTotalPage(res.data.data.totalPage);
                setIsLoading(true);
            } else if (res.data.code === 283) {
                message.error(res.data.message);
                logout();
            }
        } catch (error) {
            console.log(error);
            setIsLoading(true);
        }
    };

    const debouncedFetchAllBrandList = useCallback(_.debounce(fetchAllBrandList, 1000), [current, searchInput]);

    useEffect(() => {
        debouncedFetchAllBrandList();
        return () => {
            debouncedFetchAllBrandList.cancel();
        };
    }, [debouncedFetchAllBrandList]);


    const handelExportData = async () => {
        setExportLoading(true)
        try {
            const res = await exportBrandList(token);
            console.log("res", res)
            if (res.status === 200) {
                const fileUrl = res.data.data.exportExcel
                setExportLoading(false)
                if (fileUrl?.length != 0) {
                    // Trigger file download
                    window.open(fileUrl, '_blank');
                }

            } else if (res.data.code === 283) {
                message.error(res.data.message);
                logout();
            } else {
                message.error("Failed to export data");
                setExportLoading(false)
            }
        } catch (error) {
            console.log(error);
            message.error("An error occurred during export");
            setExportLoading(false)
        }
    };
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
                    <div className="content_title">
                        <Title level={4}>Brand List</Title>
                    </div>
                    <div className="content_add">
                        <Space>
                            <Input
                                style={{ width: '200px' }}
                                allowClear
                                placeholder="Search Brand"
                                suffix={<SearchOutlined />}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <Button type="primary" shape="round" loading={isExportLoading} onClick={() => handelExportData()}>Export Brand</Button>
                        </Space>
                    </div>
                </div>
                <div className="content">
                    <div className="shoo_recent_order">
                        {!isLoading ? (
                            <div className="loader_main">
                                <span className="loader2"></span>
                            </div>
                        ) : (
                            <Table
                                columns={columns}
                                dataSource={brandList}
                                scroll={{ x: true }}
                                pagination={false}
                                footer={() => (
                                    <div className="pagination">
                                        <Pagination current={current} onChange={onChange} total={totalPage * 10} />
                                    </div>
                                )}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BrandListing;
