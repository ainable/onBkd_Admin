import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Collapse, Descriptions, Empty, Image, message, Popconfirm, Space, Statistic, Table, Tag, Tooltip, Typography } from "antd";
import '../../style/location.css'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Avatar, Card } from 'antd';
import { useAuth } from "../../authentication/context/authContext";
import { MdKeyboardBackspace } from "react-icons/md";
// import AddManager from "./AddManager";
import { DeleteRacipeProduct, fetchBranchInfo, fetchRacipeDetails } from "../../service/api_services";
import EmptyImg from "../../assest/png/defaut_img.jpg"

import CountUp from 'react-countup';
import DefaultLogo from "../../assest/png/racipe.png"
import EditRacipe from "./EditRacipe";
import UpdateIngradientProduct from "./UpdateIngradientProduct";
const formatter = (value) => <CountUp end={value} separator="," />;

const { Title } = Typography;




function RacipeDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation();
    const { token } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [recipeData, setRecipeData] = useState([])

    const columns = [

        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (_, { imageUrl }) => (
                <div className="show_cat_img" >
                    {/* <Image.PreviewGroup
                        items={imageUrl}
                    >
                        {imageUrl ? <Image src={imageUrl} width={40} height={40} /> : <Avatar size={40} src={DefaultLogo} />}
                    </Image.PreviewGroup> */}
                    {imageUrl ? <Image src={imageUrl} width={40} height={40} /> : <Avatar size={40} src={DefaultLogo} />}


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
            render: (_, { productName }) =>
                <Tooltip title={productName}>
                    <span>{productName.substr(0, 24)}...</span>
                </Tooltip>



        },
        {
            title: 'PackSize',
            dataIndex: 'packSize',
            key: 'packSize',
            // render: productName => <strong>{productName}</strong>

        },
        {
            title: 'Bkd Amount',
            dataIndex: 'bkdAmount',
            key: 'bkdAmount',
            ellipsis: true,
            // render: productName => <strong>{productName}</strong>

        },
        {
            title: 'Mrp price',
            dataIndex: 'price',
            key: 'price',
            ellipsis: true,

            // render: productName => <strong>{productName}</strong>

        },
       
        {
            title: 'Category',
            dataIndex: 'categoryName',
            key: 'categoryName',
            ellipsis: true,
            // render: productName => <strong>{productName}</strong>

        },
        {
            title: 'Brand',
            dataIndex: 'brandName',
            key: 'brandName',
            ellipsis: true,
            // render: productName => <strong>{productName}</strong>

        },
        {
            title: 'Stock',
            dataIndex: 'stockQty',
            key: 'stockQty',
            // render: productName => <strong>{productName}</strong>

        },
        {
            title: 'Description',
            dataIndex: 'productDescription',
            key: 'productDescription',
            ellipsis: true,

            render: productDescription => <span>{productDescription?.substr(0, 20)}...</span>

        },
        // {
        //     title: 'Status',
        //     dataIndex: 'status',
        //     key: 'status',
        //     render: status => <Tag color={status === "ACTIVE" ? "green" : "red"} bordered={false}>{status}</Tag>

        // },

        {
            title: 'Action',
            dataIndex: '_id',
            key: '_id',
            render: (_, { _id }) => (
                <Popconfirm
                    title="Delete the Product"
                    description="Are you sure to delete this product?"
                    onConfirm={() => handleRemoveProduct(_id)}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button shape="round" danger>Remove </Button>
                </Popconfirm>

            )

        },
    ];

    const cancel = (e) => {
        console.log(e);
        message.error('Click on No');
    };
    const handleRemoveProduct = async (id) => {

        try {
            await DeleteRacipeProduct(id, token)
                .then((res) => {
                    console.log("  image delete ", res);
                    if (res.data.code == 201) {
                        message.success(res.data.message);
                        showRacipeDetails()
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
        }
    }
    const showRacipeDetails = async () => {
        setIsLoading(true)

        try {
            await fetchRacipeDetails(token, id)
                .then((res) => {
                    console.log(" racipe detials ", res);
                    if (res.status === 200) {
                        setRecipeData(res.data.data);
                        setIsLoading(false)
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    };

    useEffect(() => {
        showRacipeDetails();
    }, []);

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
                    <div className="content_racipe">
                        <Space>
                            <Title level={4}> <Button shape="circle" onClick={() => navigate(-1)}> <MdKeyboardBackspace className="back_icon" /></Button> Recipe Details</Title>
                        </Space>
                        <EditRacipe recipeData={recipeData} showRacipeDetails={showRacipeDetails} />
                    </div>

                </div>
                <div className="recipe_details">
                    {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                        <div className="show_racipes">
                            <div className="show_recipe_items">
                                <Row>
                                    <Col md={7}>
                                        <Card title="Basic Details" >

                                            <Descriptions bordered layout="vertical">
                                                <Descriptions.Item label="Recipe Title">
                                                    {recipeData.recipeTitle}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Recipe Image">
                                                    {recipeData?.recipeImages?.length != 0 ? recipeData?.recipeImages?.map((url) => (<Image src={url} width={40} />)) : <Image src={EmptyImg} width={40} />}
                                                </Descriptions.Item>
                                                
                                                <Descriptions.Item label="Cooking Time">
                                                    {recipeData?.cookingTime}

                                                </Descriptions.Item>
                                                <Descriptions.Item label="Description" span={3}>
                                                    {recipeData?.recipeDescription}

                                                </Descriptions.Item>


                                            </Descriptions>
                                        </Card>
                                    </Col>
                                    <Col md={5}>
                                        <Card title="Cooking Steps" >

                                            <div className="cook_steps">
                                                <ul style={{ listStyleType: "square" }}>
                                                    {recipeData?.cookingSteps?.map((step) => (
                                                        <li>{step}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                                <div className="racipe_ingraditions mt-2">
                                    <Card title={

                                        <div className="ingradient_title">
                                            <p>Ingredients List</p>
                                            <UpdateIngradientProduct showRacipeDetails={showRacipeDetails}/>
                                        </div>


                                    }>

                                        {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={columns} dataSource={recipeData?.ingredients} scroll={{ x: true }} pagination={false}
                                        />}
                                    </Card>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

        </section>
    );
}






export default RacipeDetails