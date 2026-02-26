import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, DatePicker, Form, Input, Pagination, Radio, Select, Typography, message } from "antd";
import '../../style/product.css'
import { useLocation, useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { useAuth } from "../../authentication/context/authContext";
import { deliveryTypes, fetchHistoryStatusCount, FetchOrderHistoryList, paymentModes } from "../../service/api_services";

import { SearchOutlined } from '@ant-design/icons';
import moment from "moment";
import ExportOrderHistory from "./ExportOrderHistory";




function OrderHistory() {
    const { RangePicker } = DatePicker;
    const [form] = Form.useForm();
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
    const [deliveryType, setDeliveryType] = useState(null)
    const [searchInput, setSearchInput] = useState("")
    const [countList, setCountList] = useState([])
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [width, setWidth] = useState(window.innerWidth);
    const [pageSize, setPageSize] = useState(10)

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
            title: 'Name',
            dataIndex: 'userInfo',
            key: 'userInfo',

            render: (_, { userInfo }) => (
                <>
                    <span>{userInfo?.fullName}</span>
                </>

            ),
            ellipsis: true,
        },

        {
            title: 'Number',
            dataIndex: 'userInfo',
            key: 'userInfo',
            render: (_, { userInfo }) => (
                <>
                    <span>{userInfo?.mobileNo}</span>
                </>

            ),
        },
        {
            title: 'Branch',
            dataIndex: 'branchCode',
            key: 'branchCode',
            render: (_, { branchCode }) => (

                <Tag color="blue">
                    {branchCode}
                </Tag>

            ),
            ellipsis: true,
        },
        {
            title: 'Branch Alias',
            dataIndex: 'branchAlias',
            key: 'branchAlias',

            ellipsis: true,
        },
        {
            title: 'Order Date',
            dataIndex: 'addedDate',
            key: 'addedDate',

            ellipsis: true,
            render: (addedDate) => (
                <span>{addedDate}</span>
            )
        },
        {
            title: 'Delivery Date',
            dataIndex: 'deliveryDate',
            key: 'deliveryDate',

            ellipsis: true,
        },
        {
            title: 'Delivery Type',
            dataIndex: 'deliveryOption',
            key: 'deliveryOption',
            render: (_, { deliveryOption }) => (

                <Tag color={deliveryOption == "DELIVERY" ? "#7ABA78" : "#387ADF"}>
                    {deliveryOption}
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
            dataIndex: 'paymentMode',
            key: 'paymentMode',
            render: (_, { paymentMode }) => (

                <Tag color={paymentMode != "COD" ? "#7ABA78" : "#F57D1F"}>
                    {paymentMode}
                </Tag>

            ),
            ellipsis: true,
        },

        {
            title: 'Payable Amount',
            dataIndex: 'totalPayableAmount',
            key: 'totalPayableAmount',
            render: (_, { totalPayableAmount }) => (
                <span>₹ {totalPayableAmount?.toFixed(2)}</span>

            ),
            ellipsis: true,
        },


        {
            title: 'Action',
            key: '_id',
            render: (_, { _id, }) => (
                <Space size="middle">
                    <Button shape="round" className="view_details" onClick={() => navigate(`/dashboard/orders-details/${_id}`)}>View </Button>
                </Space>
            ),
            fixed: 'right',
        },
    ];


    const shhowAllOrderList = async () => {
        try {
            await FetchOrderHistoryList(token, current, pageSize, deliveryType, paymentMode, orderStatus, searchInput, startDate,
                endDate)
                .then((res) => {
                    console.log("order history", res)
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
        shhowAllOrderList()
    }, [current, paymentMode, pageSize, deliveryType, orderStatus, searchInput, startDate])

    const handelDatePicker = (dates, dateStrings) => {
        console.log('Selected dates:', dateStrings);
        setStartDate(dateStrings[0])
        setEndDate(dateStrings[1])
    };

    const disabledDate = (current) => {
        // Disable future dates
        return current && current > moment().endOf('day');
    };


    const showOrderCount = async () => {
        try {
            await fetchHistoryStatusCount(token, deliveryType)
                .then((res) => {
                    console.log("history order count ", res);
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
    }, [deliveryType])


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
                        <Title level={4}> Order History </Title>
                    </div>
                    <div className="pro_selector">
                        <Form
                            form={form}
                        >

                            <Space>

                                <Form.Item
                                    name="delivery_type"

                                >
                                    <Select

                                        allowClear
                                        placeholder="Select Delivery Type "
                                        optionFilterProp="children"
                                        onChange={(value) => setDeliveryType(value)}
                                        style={{ width: '160px' }}

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
                                        style={{ width: '160px' }}
                                    >
                                        {paymentModes.map((opt) => (
                                            <Select.Option key={opt.key} value={opt.values}>{opt.values}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="customer"

                                >
                                    <Input allowClear style={{ width: '160px' }} placeholder="Customer Number" suffix={<SearchOutlined />} onChange={(e) => setSearchInput(e.target.value)} />
                                </Form.Item>
                                <Form.Item>

                                    <RangePicker onChange={handelDatePicker} disabledDate={disabledDate} format="DD/MM/YYYY" style={{ width: '160px' }} />
                                </Form.Item>
                                <Form.Item>

                                    <ExportOrderHistory />
                                </Form.Item>
                            </Space>
                        </Form>

                    </div>

                </div>

                <div className="history_filter_orders">
                    <Space>
                        {orderStatus != null ? <Button type="link" danger onClick={() => setOrderStatus(null)}>Clear Filter</Button> : null}
                        <Radio.Group value={orderStatus} >
                            {countList.map((opt) => (
                                <Radio.Button onClick={() => {
                                    // Toggle the orderStatus value, if the clicked value is already selected, set to null
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
                                    <Pagination current={current} onChange={onChange}
                                        showSizeChanger
                                        onShowSizeChange={(current, size) => {
                                            console.log(size, "par page ")
                                            setPageSize(size); // update size
                                            setCurrent(1); // reset to first page if needed
                                            // setIsLoading();
                                        }}
                                        total={totalPage * pageSize} />
                                </div>}

                            />}
                    </div>
                </div>


            </div>

        </section>
    );
}





export default OrderHistory