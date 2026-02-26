import React, { useEffect, useState } from "react";
import {  Breadcrumb, Button,  Image, Popconfirm,  Typography, message } from "antd";
import '../../../style/master.css'
import { useLocation } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { useAuth } from "../../../authentication/context/authContext";

import {   deleteTrendingBrand,  fetchTrendingBrand } from "../../../service/api_services";
import DefaultImg from "../../../assest/icon/default-image.jpg"
import AddTrendingBrand from "./AddTrendingBrand";


function TrendingBrand() {
    const location = useLocation();
    const { token, logout } = useAuth()



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
            title: ' Brand Id',
            dataIndex: 'brandId',
            key: 'brandId',
            ellipsis: true,

            render: brandId => <strong>{brandId}</strong>

        },
        {
            title: 'Brand Name',
            dataIndex: 'brandName',
            key: 'brandName',
            ellipsis: true,


        },
        {
            title: ' Priority',
            dataIndex: 'priority',
            key: 'priority',
            ellipsis: true,

            render: (_, { priority }) => (
                <Space>
                    <Tag bordered={false} color="blue" className="h6"><strong>{priority}</strong></Tag>
                </Space>
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
                        title="Delete the Brand "
                        description="Are you sure to delete this brand?"
                        onConfirm={() => deleteHandlerBrand(_id)}
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

    const deleteHandlerBrand = async (id) => {
        try {
            let body = {
                trendBrandId: id,
            }
            await deleteTrendingBrand(token, body)
                .then((res) => {
                    console.log("delete segment  ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        showTrendingBrnad();
                    }
                })
                .catch((err) => {
                    console.log(err.response.msg);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const showTrendingBrnad = async () => {
        try {
            await fetchTrendingBrand(token)
                .then((res) => {
                    console.log(" trending brand list ", res);
                    if (res.status == 200) {
                        setSegmentList(res.data.data);
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
        showTrendingBrnad()
    }, [])


   

    const cancel = () => {
        console.log("you are click no")
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

                            <Title level={4}>Trending Brand List</Title>


                        </Space>
                    </div>
                </div>
                <div className="content_add">
                    <AddTrendingBrand showTrendingBrnad={showTrendingBrnad} />

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

export default TrendingBrand