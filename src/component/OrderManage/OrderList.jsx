import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Button, Dropdown, Form, Input, List, Modal, Pagination, Radio, Select, Typography, message, notification } from "antd";
import '../../style/product.css'
import { useLocation, useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { useAuth } from "../../authentication/context/authContext";
import { deliveryTypes, FetchOrderList, fetchOrderStatusCount, OrderCacelByAdmin, paymentModes } from "../../service/api_services";
import OrderSendBranch from "./OrderSendBranch";
import Logo from "../../assest/png/bkdlogo.png";

import { CloseOutlined, EyeOutlined, MoreOutlined, SearchOutlined, SendOutlined } from '@ant-design/icons';

import { ExclamationCircleFilled } from '@ant-design/icons';
// import { onMessage } from "firebase/messaging"; // DISABLED - FIREBASE CAUSING ERRORS
// import { messaging } from "../../firebase"; // DISABLED - FIREBASE CAUSING ERRORS




function OrderList() {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const location = useLocation();
    const { Title } = Typography;
    const { token, logout } = useAuth()
    const [orderData, seOrderData] = useState([])
    const [statusCount, setStatusCount] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalPage, setTotalPage] = useState(null);
    const [current, setCurrent] = useState(1);
    const [orderStatus, setOrderStatus] = useState(null)
    const [paymentMode, setPaymentMode] = useState(null)
    const [deliveryType, setDeliveryType] = useState(null)
    const [searchInput, setSearchInput] = useState("")
    const { confirm } = Modal;
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const [pageSize, setPageSize] = useState(10)


    const onChange = (page) => {
        setCurrent(page);
        setIsLoading(true);
    };

    const error = (id) => {
        let reason;
        const handleInputChange = (e) => {
            reason = e.target.value;
        };

        const handleOrderCancel = async () => {
            const body = {
                userOrderId: id,
                reason: reason,
            };

            try {
                const res = await OrderCacelByAdmin(body, token);
                if (res.status === 201) {
                    message.success(res.data.message);
                    shhowAllOrderList(); // Refresh the order list
                    reason = ""
                    // setReason(""); // Clear the reason
                    return true; // Return true to indicate the modal should close
                } else {
                    message.error(res.data.message);
                    return false; // Return false to indicate the modal should stay open
                }
            } catch (error) {
                console.log(error.message);
                return false; // Return false in case of an error
            }
        };

        confirm({
            title: 'Are you sure cancel this order?',
            icon: <ExclamationCircleFilled />,
            content: (
                <Form.Item
                    name="reason"
                    rules={[
                        {
                            required: true,
                            message: "Please enter cancel reason",
                        },
                    ]}
                >
                    <Input.TextArea
                        placeholder="Reason..."
                        onChange={handleInputChange}
                    />
                </Form.Item>
            ),
            okText: 'Yes',
            // okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                if (reason?.trim()) {
                    return handleOrderCancel().then((shouldClose) => {
                        if (!shouldClose) {
                            // Prevent modal from closing if status is not 201
                            return Promise.reject();
                        }
                    });
                } else {
                    message.error("Reason is required");
                    // Prevent modal from closing if the reason is empty
                    return Promise.reject();
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });




    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'ASSIGNED':
                return '#EB5B00';
            case 'ORDERPACKED':
                return '#219C90';
            case 'ACCEPTED':
                return '#90D26D';
            case 'DISPATCHED':
                return '#008DDA';
            case 'REACHED':
                return '#7E60BF';
            case 'DELIVERED':
                return '#87A922';
            case 'CANCELLED':
                return '#FF204E';
            case 'PARTIALLY CANCELLED':
                return '#FFA955';
            default:
                return '#B3A398';
        }
    };
    function DropdownItem(_id, status, branchCode, branchId, deliveryOption) {
        return [
            {
                key: '1',
                icon: <EyeOutlined onClick={() => navigate(`/dashboard/orders-details/${_id}`)} />,
                label: (
                    <span onClick={() => navigate(`/dashboard/orders-details/${_id}`)}>
                        View Details
                    </span>
                ),
            },
            {
                key: '2',
                icon: <SendOutlined />,
                disabled: deliveryOption === "PICKUP",
                label: (
                    <OrderSendBranch
                        branchCode={branchCode}
                        branchId={branchId}
                        status={status}
                        orderId={_id}
                        shhowAllOrderList={shhowAllOrderList} // Ensure this function is defined
                        deliveryOption={deliveryOption}
                        showOrderCount={showOrderCount}
                    />
                ),
            },
            {
                key: '3',
                icon: <CloseOutlined onClick={() => error(_id)} />,
                label: (
                    <span
                        onClick={() => error(_id)} // Ensure `error` function is defined
                    >
                        Cancel
                    </span>
                ),
                disabled: status === "DISPATCHED" || status === "REACHED" ? true : false,

            },
        ];
    }


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
            dataIndex: 'branchAlias',
            key: 'branchAlias',

            ellipsis: true,
        },
        {
            title: 'Delivery Date',
            dataIndex: 'deliveryDate',
            key: 'deliveryDate',
            // render: (_, { deliveryDate }) => (

            //     <Tag color="blue">
            //         {branchCode}
            //     </Tag>

            // ),
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
            render: (_, { _id, status, branchCode, branchId, deliveryOption }) => (
                <Space size="middle">
                    <Dropdown
                        trigger={["click"]}

                        menu={{
                            items: DropdownItem(_id, status, branchCode, branchId, deliveryOption), // Ensure this returns valid items
                        }}
                    >
                        <Button icon={<MoreOutlined />} shape="circle" />
                    </Dropdown>
                </Space>
            ),
            fixed: 'right',
        },
    ];


    const shhowAllOrderList = async () => {
        try {
            await FetchOrderList(token, current, pageSize, deliveryType, paymentMode, orderStatus, searchInput)
                .then((res) => {
                    console.log(" order list ", res);
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
    }, [current, paymentMode, pageSize, deliveryType, orderStatus, searchInput])

    /* DISABLED - FIREBASE MESSAGING CAUSING onMessageHandler NULL ERROR
    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            if (payload.data.navigateTo === "ORDER") {

                shhowAllOrderList(); // Fetch orders only if it's a relevant notification
                notification.open({
                    placement: "topRight",
                    message: (
                        <List itemLayout="horizontal">
                            <List.Item onClick={() => navigate(`/dashboard/orders-details/${payload.data.userOrderId}`)}>
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
            await fetchOrderStatusCount(token)
                .then((res) => {
                    console.log(" order count ", res);
                    if (res.status == 200) {
                        setStatusCount(res.data.data);
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
    }, [])

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
                            <Title level={4}>Live Order List</Title>
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
                                            style={{ width: '175px' }}
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

                                            style={{ width: '175px' }}

                                        >
                                            {paymentModes.map((opt) => (
                                                <Select.Option key={opt.key} value={opt.values}>{opt.values}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>


                                    <Form.Item
                                        name="customer"

                                    >
                                        <Input allowClear style={{ width: '175px' }} placeholder="Search Order ID " suffix={<SearchOutlined />} onChange={(e) => setSearchInput(e.target.value)} />
                                    </Form.Item>
                                </Space>
                            </Form>

                        </div>

                    </div>

                </div>
                <div className="pro_selector">
                    {orderStatus != null ? <Button type="link" danger onClick={() => setOrderStatus(null)}>Clear Filter</Button> : null}
                    <Radio.Group value={orderStatus} >
                        {statusCount.map((opt) => (
                            <Radio.Button onClick={() => {
                                // Toggle the orderStatus value, if the clicked value is already selected, set to null
                                setOrderStatus((prevValue) => (prevValue === opt._id ? null : opt._id));
                            }} key={opt._id} value={opt._id}>{capitalize(opt._id)} ({opt.count})</Radio.Button>
                        ))}
                    </Radio.Group>
                </div>
                <div className="content">
                    <div className="shoo_recent_order">
                        {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                            <Table columns={columns} dataSource={orderData}
                                scroll={{ x: true }}
                                pagination={false}
                                footer={() => <div className="pagination">
                                    <Pagination current={current} onChange={onChange}
                                        showSizeChanger
                                        onShowSizeChange={(current, size) => {
                                            console.log(size, "par page ")
                                            console.log("totalPage", totalPage)
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




export default OrderList