import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Form, Input, Pagination, Radio, Segmented, Select, Typography, message } from "antd";
import '../../style/product.css'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { useAuth } from "../../authentication/context/authContext";
import { deliveryTypes, FetchReturnReplaceHistory, fetchReturnReplacementhistoryStatusCount, paymentModes } from "../../service/api_services";

import { SearchOutlined } from '@ant-design/icons';





function ReturnReplaceHistory() {

    const navigate = useNavigate()
    const location = useLocation();
    const { Title } = Typography;
    const { token, logout } = useAuth()
    const [orderData, seOrderData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalPage, setTotalPage] = useState(null);
    const [current, setCurrent] = useState(1);
    const [orderStatus, setOrderStatus] = useState(null)
    const [paymentMode, setPaymentMode] = useState(null)
    const [searchInput, setSearchInput] = useState("")
    const [countList, setCountList] = useState([])
    const [retRepType, setReturnRepType] = useState("")
    const [width, setWidth] = useState(window.innerWidth);
    const [orderType, setOrderType] = useState("RETURN")

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const onChange = (page) => {
        setCurrent(page);
        setIsLoading(true);
    };


    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "RETURNED":
                return '#EB5B00';
            case "REPLACED":
                return '#219C90';
            case "PARTIALDELIVERED":
                return '#90D26D';
            case 'DELIVERED':
                return '#87A922';
            case 'PARTIALDELIVERED':
                return '#87A922';
            case 'CANCELLED':
                return '#F95454';
            case 'CANCELLEDRETURN':
                return '#F95454';
            case "REPLACEREJECTED":
                return '#F95454';
            case "RETURNREJECTED":
                return '#F95454';
            case 'CLOSED':
                return '#C62E2E';
            default:
                return '#B3A398';
        }
    };

    const columns = [
        {
            title: 'Order Code',
            dataIndex: 'orderCode',
            key: 'orderCode',
            render: (_, { orderCode, _id }) => (
                <div className="order_code">
                    <span>#</span><span><b>{orderCode}</b></span>

                </div>
            ),
            ellipsis: true,
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_, { status, _id }) => (
                <>
                    <Tag key={_id} color={getStatusColor(status)}>{status}</Tag>
                </>
            ),
        },
        {
            title: 'Order Type',
            dataIndex: 'type',
            key: 'type',
            render: (_, { type }) => (

                <Tag color={type == "RETURN" ? "#F29F58" : "#605EA1"}>
                    {type}
                </Tag>

            ),
            ellipsis: true,
        },
        {
            title: 'Name',
            dataIndex: 'userId',
            key: 'userId',

            render: (_, { userId }) => (
                <>
                    <span>{userId?.fullName}</span>
                </>

            ),
            ellipsis: true,
        },

        {
            title: 'Number',
            dataIndex: 'userId',
            key: 'userId',
            render: (_, { userId }) => (
                <>
                    <span>{userId?.mobileNo}</span>
                </>

            ),
        },
        {
            title: 'Branch',
            dataIndex: 'branchId',
            key: 'branchId',
            render: (_, { branchId }) => (

                <Tag color="blue">
                    {branchId?.branchCode}
                </Tag>

            ),
            ellipsis: true,
        },
        {
            title: 'Branch Alias',
            dataIndex: 'branchId',
            key: 'branchId',
            render: (_, { branchId }) => (

                <span >
                    {branchId?.branchAlias}
                </span>

            ),
            ellipsis: true,
        },
        {
            title: 'Return Request ',
            dataIndex: 'addedDate',
            key: 'addedDate',

            ellipsis: true,
            render: (addedDate) => (
                <span>{addedDate}</span>
            )
        },
        {
            title: 'Return Completed ',
            dataIndex: 'timeSlotDate',
            key: 'timeSlotDate',

            ellipsis: true,
        },
        {
            title: 'Delivery Type',
            dataIndex: 'retRepType',
            key: 'retRepType',
            render: (_, { retRepType }) => (

                <Tag color={retRepType == "DELIVERY" ? "#7ABA78" : "#387ADF"}>
                    {retRepType}
                </Tag>

            ),
            ellipsis: true,
        },
        {
            title: 'No. of Item',
            dataIndex: 'totalItem',
            key: 'totalItem',
            render: (_, { totalItem }) => (
                <span>{totalItem}</span>
            ),
            ellipsis: true,
        },
        {
            title: 'Payment Mode',
            dataIndex: 'paymentOn',
            key: 'paymentOn',
            render: (_, { paymentOn, type }) => (
                <>
                    {type === "RETURN" ? <Tag color={"#F57D1F"}>
                        {paymentOn}
                    </Tag> : <Tag>No Refund</Tag>}
                </>

            ),
            ellipsis: true,
        },

        {
            title: 'Refund Amount',
            dataIndex: 'returnAmount',
            key: 'returnAmount',
            render: (_, { returnAmount }) => (
                <span>{returnAmount ? <span>₹ {returnAmount?.toFixed(2)}</span> : "₹ 0"}</span>
            ),
            ellipsis: true,
        },


        {
            title: 'Action',
            key: '_id',
            render: (_, { _id, }) => (
                <Space size="middle">
                    <Button shape="round" className="view_details" onClick={() => navigate(`/dashboard/return-replace-details/${_id}`)}>View </Button>
                </Space>
            ),
            fixed: 'right',
        },
    ];


    const showReturnReplaceHistory = async () => {
        try {
            await FetchReturnReplaceHistory(token, current, orderType, retRepType, paymentMode, orderStatus, searchInput)
                .then((res) => {
                    console.log("return replace history", res)
                    if (res.status == 200) {
                        seOrderData(res.data.data.data);
                        setTotalPage(res.data.data.totalPage)
                        setIsLoading(true)
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()

                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
            setIsLoading(true)
        }
    };

    useEffect(() => {
        showReturnReplaceHistory()
    }, [current, orderType, retRepType, paymentMode, orderStatus, searchInput])





    const showOrderCount = async () => {
        try {
            await fetchReturnReplacementhistoryStatusCount(token, orderType, retRepType)
                .then((res) => {
                    console.log("return history order count ", res);
                    if (res.status == 200) {
                        setCountList(res.data.data);
                        setIsLoading(true)
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
            setIsLoading(true)
        }
    };

    useEffect(() => {
        showOrderCount()
    }, [orderType, retRepType])


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
                    <div className="hear_title">
                        <Title level={4}> Return & Replacement History </Title>
                    </div>
                    <div className="pro_selector">
                        {/* <Form.Item>
                            <ExportOrderHistory />
                        </Form.Item> */}
                    </div>
                </div>
                <div className="retun_history_filter">
                    <Space>
                        <Form.Item
                            name="delivery_type"
                        >
                            <Select
                                allowClear
                                placeholder="Select Delivery Option "
                                optionFilterProp="children"
                                onChange={(value) => setReturnRepType(value)}
                                style={{ width: '180px' }}

                            >
                                {deliveryTypes.map((opt) => (
                                    <Select.Option key={opt.key} value={opt.values}>{opt.values}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="payment_mode"

                        >
                            <Select
                                allowClear
                                placeholder="Select Payment Mode"
                                optionFilterProp="children"
                                onChange={(value) => setPaymentMode(value)}
                                style={{ width: '180px' }}
                            >
                                {paymentModes.map((opt) => (
                                    <Select.Option key={opt.key} value={opt.values}>{opt.values}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="customer"

                        >
                            <Input allowClear style={{ width: '180px' }} placeholder="Customer Number" suffix={<SearchOutlined />} onChange={(e) => setSearchInput(e.target.value)} />
                        </Form.Item>

                        <Form.Item>

                            <Segmented options={["RETURN", "REPLACEMENT"]} onChange={(value) => setOrderType(value)} />
                        </Form.Item>

                    </Space>
                </div>
                <div className="retun_history_filter">
                    <Space>
                        {orderStatus != null ? <Button type="link" danger onClick={() => setOrderStatus(null)}>Clear Filter</Button> : null}
                        <Radio.Group value={orderStatus} >
                            {countList.map((opt) => (
                                <Radio.Button onClick={() => {

                                    setOrderStatus((prevValue) => (prevValue === opt._id ? null : opt._id));
                                }} key={opt._id} value={opt._id}>{capitalize(opt._id)}-{opt.count}</Radio.Button>
                            ))}
                        </Radio.Group>
                    </Space>
                </div>

                <div className="content">
                    <div className="shoo_recent_order">
                        {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                            <Table columns={columns} dataSource={orderData} scroll={{ x: true }}
                                pagination={false}
                                footer={() => <div className="pagination">
                                    <Pagination current={current} onChange={onChange} total={totalPage * 10} />
                                </div>}
                            />}
                    </div>
                </div>
            </div>
        </section>
    );
}






export default ReturnReplaceHistory