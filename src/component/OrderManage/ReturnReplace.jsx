import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Button, DatePicker, Form, Input, List, Pagination, Radio, Segmented, Select, Statistic, Typography, message, notification } from "antd";
import '../../style/product.css'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { useAuth } from "../../authentication/context/authContext";
import { fetchReturnReplacement, fetchReturnReplacementStatusCount } from "../../service/api_services";

import Logo from "../../assest/png/bkdlogo.png"
import { SearchOutlined } from '@ant-design/icons';
// import { onMessage } from "firebase/messaging"; // DISABLED - FIREBASE CAUSING ERRORS
// import { messaging } from "../../firebase"; // DISABLED - FIREBASE CAUSING ERRORS



function ReturnReplace() {
    const [width, setWidth] = useState(window.innerWidth);

    const navigate = useNavigate()
    const location = useLocation();
    const { Title } = Typography;
    const { token, logout } = useAuth()
    const [orderData, seOrderData] = useState([])
    const [countList, setCountList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalPage, setTotalPage] = useState(null);
    const [current, setCurrent] = useState(1);
    const [orderStatus, setOrderStatus] = useState(null)
    const [searchInput, setSearchInput] = useState("")
    const [orderAction, setOrderAction] = useState("RETURN")
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const onChange = (page) => {
        setCurrent(page);
        setIsLoading(true);
    };


    const getStatusColor = (status) => {
        const statusColors = {
            RETURNVENDORASSIGNED: '#EB5B00',
            REPLACEVENDORACCEPTED: '#219C90',
            RETURNACCEPTED: '#90D26D',
            REPLACEACCEPTED: '#90D26D',
            REPLACEASSIGNED: '#0D92F4',
            RETURNASSIGNED: '#0D92F4',
            REPLACEREJECTED: '#FF204E',
            RETURNREJECTED: '#FF204E',
            REPLACED: '#347928',
            RETURNED: '#347928'
        };

        return statusColors[status] || '#B3A398'; // Default color if no match found
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
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (_, { type }) => (

                <Tag color={type === "RETURN" ? "#FF9D3D" : "#7E60BF"}>
                    {type}
                </Tag>

            ),
            ellipsis: true,
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
            title: 'Order Type',
            dataIndex: 'retRepType',
            key: 'retRepType',

            ellipsis: true,
        },
        {
            title: 'Branch',
            dataIndex: 'branchInfo',
            key: 'branchInfo',
            render: (_, { branchInfo }) => (

                <Tag color="blue">
                    {branchInfo?.branchAlias}
                </Tag>

            ),
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
            title: 'Slot Date',
            dataIndex: 'timeSlotDate',
            key: 'timeSlotDate',

            ellipsis: true,
        },
        {
            title: 'Slot Time',
            dataIndex: 'timeSlotFrom',
            key: 'timeSlotFrom',
            render: (_, { timeSlotFrom, timeSlotTo }) => (

                <span >
                    {timeSlotFrom}-{timeSlotTo}
                </span>

            ),
            ellipsis: true,
        },

        {
            title: 'No. of Item',
            dataIndex: 'noOfItem',
            key: 'noOfItem',
            render: (_, { noOfItem }) => (
                <span>{noOfItem} Item</span>
            ),
            ellipsis: true,
        },


        {
            title: 'Return Amount',
            dataIndex: 'returnAmount',
            key: 'returnAmount',
            render: (_, { returnAmount, type }) => (
                <>

                    {type != "RETURN" ? "N/A" : <span>₹ {returnAmount?.toFixed(2)}</span>}
                </>

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


    const returnReplaceOrderList = async () => {
        try {
            await fetchReturnReplacement(token, current, searchInput, orderAction, orderStatus)
                .then((res) => {
                    console.log("retune replace", res)
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
        returnReplaceOrderList()
    }, [orderAction, searchInput, current, orderStatus])

    /* DISABLED - FIREBASE MESSAGING CAUSING onMessageHandler NULL ERROR
    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            if (payload.data.navigateTo === "RETREP") {
                returnReplaceOrderList(); // Fetch orders only if it's a relevant notification
                notification.open({
                    placement: "topRight",
                    message: (
                        <List itemLayout="horizontal">
                            <List.Item onClick={() => navigate(`/dashboard/return-replace-details/${payload.data.userOrderId}`)}>
                                <List.Item.Meta
                                    avatar={<Avatar src={Logo} />}
                                    title={<span>{payload?.notification?.title}</span>}
                                    description={payload?.notification?.body}
                                />
                            </List.Item>
                        </List>
                    ),
                });
            }
        });
        return () => unsubscribe();
    }, []);
    */

    const showOrderCount = async () => {
        try {
            await fetchReturnReplacementStatusCount(token, orderAction)
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
    }, [orderAction])



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
                        <Title level={4}>Return & Replace Order</Title>
                    </div>
                    <div className="pro_selectors ">
                        <Space>

                            <Segmented options={["RETURN", "REPLACEMENT"]} onChange={(value) => setOrderAction(value)} />
                            <Input allowClear style={{ width: '200px' }} placeholder="Search Order ID " suffix={<SearchOutlined />} onChange={(e) => setSearchInput(e.target.value)} />
                        </Space>


                    </div>
                </div>

                <div className="retun_history_filter mt-2">
                    <Space>
                        {orderStatus ? <Button type="link" danger onClick={() => setOrderStatus(null)}>Clear Filter</Button> : null}
                        <Radio.Group value={orderStatus} size={width > 1560 ? "large" : "small"}>
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






export default ReturnReplace