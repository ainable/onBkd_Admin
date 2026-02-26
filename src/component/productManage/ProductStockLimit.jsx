import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Button, Card, Form, Image, Popconfirm, Select, Statistic, Switch, Typography, message } from "antd";
import '../../style/master.css'
import { useLocation, useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { useAuth } from "../../authentication/context/authContext";
import { FaRegUser, FaUser } from "react-icons/fa";

import { activeDeactiveSegment, deleteCustomSegment, deleteProductStockLimit, fetchCustomSegment, fetchProductStockLimit } from "../../service/api_services";
// import AddNewSegment from "./AddNewSegment";
import DefaultImg from "../../assest/icon/default-image.jpg"
import AddStockLimit from "./AddStockLimit";
import ExcelFormate from "../master/segment/ExcelFormate";
// import EditSegment from "./EditSegment";





function ProductStockLimit() {
    const location = useLocation();
    const navigate = useNavigate()
    const { token, logout } = useAuth()
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const [segmentList, setSegmentList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { Title } = Typography;
    const columns = [

        {
            title: ' Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            ellipsis: true,

            render: (_, { imageUrl }) => (
                <div className="show_cat_img" >
                    {<Image src={imageUrl ? imageUrl : DefaultImg} width={50} height={50} style={{ borderRadius: "8px", objectFit: "contain", }} />}

                </div>
            )
        },
        {
            title: 'Product Code',
            dataIndex: 'productCode',
            key: 'productCode',
            ellipsis: true,

            render: productCode => <strong>{productCode}</strong>

        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
            ellipsis: true,
            render: productName => <span>{capitalize(productName)}</span>



        },
        {
            title: 'Per Order Stock Limit',
            dataIndex: 'stockLimit',
            key: 'stockLimit',
            ellipsis: true,

            render: (_, { _id, stockLimit }) => (
                <Space>
                    <Tag bordered={false} color="blue"><strong>{stockLimit}</strong></Tag>

                </Space>
            )

        },
        {
            title: 'Created At',
            dataIndex: 'addedDate',
            key: 'addedDate',
            ellipsis: true,
            render: addedDate => (
                <>{new Date(addedDate).toLocaleDateString()}

                </>
            )

        },


        {
            title: ' Action ',
            dataIndex: '_id',
            key: '_id',
            ellipsis: true,
            fixed: "right",
            render: (_, { _id }) => (
                <Space>
                    <Popconfirm
                        title="Delete the Product Stock "
                        description="Are you sure to delete this product stock?"
                        onConfirm={() => deleteStockLimitHandle(_id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        placement="topLeft"
                    >
                        <Button type="primary" shape="round" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            )

        },
    ];

    const showProductStockLimit = async () => {
        try {
            await fetchProductStockLimit(token)
                .then((res) => {
                    console.log(" stock limit list ", res);
                    if (res.status == 200) {
                        setSegmentList(res.data.data.data);
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
        showProductStockLimit()
    }, [])

    

    const deleteStockLimitHandle = async (id) => {
        try {
            let body = {
                productStockLimitId: id,
            };
            await deleteProductStockLimit(token, body)
                .then((res) => {
                    console.log("delete segment  ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        showProductStockLimit();
                    }
                })
                .catch((err) => {
                    console.log(err.response.msg);
                });
        } catch (error) {
            console.log(error);
        }
    };
    const cancel = () => {
        message.error("your are click no")
    }
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
                            <Title level={4}>Product Stock Limit</Title>
                        </Space>
                    </div>
                </div>
                <div className="content_add">
                    <Space>
                        <ExcelFormate  title="stock_limit"/>
                    <AddStockLimit showProductStockLimit={showProductStockLimit} />
                    </Space>

                </div>


            </div>

            <div className="content_title">

                <div className="content">
                    <div className="shoo_recent_order">
                        {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                            <Table columns={columns} dataSource={segmentList} scroll={{ x: true }} />}
                    </div>
                </div>


            </div>

        </section>
    );
}





export default ProductStockLimit