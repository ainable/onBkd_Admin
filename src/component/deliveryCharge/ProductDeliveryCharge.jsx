import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Button, Card, Form, Image, Pagination, Popconfirm, Select, Statistic, Switch, Typography, message } from "antd";
import '../../style/master.css'
import { useLocation } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { useAuth } from "../../authentication/context/authContext";
import { FaRegUser } from "react-icons/fa";
import { BranchHook } from "../../pages/CustomHooks";
import { deleteProdustDeliveryCharge, deliveryTypes, FetchAllbranchSlote, fetchProductBaseDeliveryCharge, slotActionHandle } from "../../service/api_services";
import DefaultImg from "../../assest/png/defaut_img.jpg"
import AddProductBaseDelivery from "./AddProductBaseDelivery";
import ExcelFormate from "../master/segment/ExcelFormate";
import MinimumCart from "./MinimumCart";


function ProductDeliveryCharge() {

    const location = useLocation();
    const [form] = Form.useForm();
    const { token, logout } = useAuth()
    const { branchList, defaultBranchId } = BranchHook(token)
    const [slotId, setSlotId] = useState("")
    const [isAction, setIsAction] = useState(false)
    const [totalPage, setTotalPage] = useState(null)
    const [sloteList, setSloteList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterSlot, setFilterSlot] = useState("")
    const [current, setCurrent] = useState(1)
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const onChange = (page) => {
        setCurrent(page);
    };

    const { Title } = Typography;
    const columns = [
        {
            title: 'Product Code',
            dataIndex: 'productCode',
            key: 'productCode',
        },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (_, { imageUrl }) => (
                <>
                    <Image src={imageUrl[0] != null ? imageUrl[0] : DefaultImg} width={50} height={50} style={{ borderRadius: "8px", objectFit: "contain" }} />
                </>
            )
        },
        {
            title: 'Name',
            dataIndex: 'productName',
            key: 'productName',
            render: (_, { productName }) => <span>{capitalize(productName)}</span>

        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (_, { price }) => <span>₹{price}</span>

        },
        {
            title: 'BKD Price',
            dataIndex: 'bkdAmount',
            key: 'bkdAmount',
            render: (_, { bkdAmount }) => <span>₹{bkdAmount}</span>
        },
        {
            title: 'Stock',
            dataIndex: 'stockQty',
            key: 'stockQty',
            ellipsis: true,


        },
        {
            title: 'Bags',
            dataIndex: 'isRefridgerator',
            key: 'isRefridgerator',
            render: (_, { isRefridgerator }) => <Tag color={isRefridgerator ? "blue" : ""} bordered={false}>{isRefridgerator ? "Frozen" : "Normal"}</Tag>

        },
        {
            title: ' Status ',
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
            render: (_, { _id, status }) => (
                <Space>

                    <Tag color={status == "ACTIVE" ? "green" : "red"} >{status}</Tag>

                </Space>
            )

        },
        {
            title: ' Action ',
            dataIndex: '_id',
            key: '_id',
            ellipsis: true,
            render: (_, { _id }) => (
                <Space>

                    {/* <AddProductSegment segmentId={_id} showAllCustomSegment={showAllCustomSegment} /> */}
                    <Popconfirm
                        placement="topLeft"
                        title="Delete the  Product"
                        description="Are you sure to delete this Product?"
                        onConfirm={() => deleteProductHandle(_id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" shape="round" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            )

        },
    ];

    const cancel = () => {
        message.error("you are select no")
    }

    const deleteProductHandle = async (id) => {

        try {
            await deleteProdustDeliveryCharge({ allowedDCProductId: id }, token)
                .then((res) => {
                    console.log("active slot ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        showProductDelvieryCharge()
                    }

                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    };


    const showProductDelvieryCharge = async () => {
        setIsLoading(true)
        try {
            await fetchProductBaseDeliveryCharge(token, current)
                .then((res) => {
                    console.log(" product charge list ", res);
                    if (res.status == 200) {
                        setSloteList(res.data.data.data);
                        setTotalPage(res.data.data.totalPage)
                        setIsLoading(false)
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()

                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setIsLoading(false)

                });
        } catch (error) {
            console.log(error);
            setIsLoading(false)

        }
    };

    useEffect(() => {
        showProductDelvieryCharge()
    }, [current])






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
                    <Title level={4}> Product Base Delivery Charge </Title>
                </div>
                <Space>
                    <MinimumCart />
                    <ExcelFormate title="Delivery" />
                    <AddProductBaseDelivery showProductDelvieryCharge={showProductDelvieryCharge} />

                </Space>


            </div>

            <div className="content_title">

                <div className="content">
                    <div className="shoo_recent_order">
                        {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                            <Table columns={columns} dataSource={sloteList} scroll={{ x: true }} pagination={false}
                                footer={() => <div className="pagination">
                                    <Pagination current={current} onChange={onChange} total={totalPage * 10} />
                                </div>} />}
                    </div>
                </div>


            </div>

        </section>
    );
}

export default ProductDeliveryCharge