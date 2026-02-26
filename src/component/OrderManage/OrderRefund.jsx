import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Form, Input, Pagination, Select, Typography, message } from "antd";
import '../../style/product.css'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { useAuth } from "../../authentication/context/authContext";
import { fetchAllBranchList, fetchOrderRefund } from "../../service/api_services";
import { SearchOutlined } from '@ant-design/icons';
import ViewPaymentCredential from "./ViewPaymentCredential";

function OrderRefund() {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const location = useLocation();
    const { Title } = Typography;
    const { token, logout } = useAuth()
    const [orderData, seOrderData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalPage, setTotalPage] = useState(null);
    const [current, setCurrent] = useState(1);
    const [searchInput, setSearchInput] = useState("")
    const [orderAction, setOrderAction] = useState("REMOVED")
    const [branchData, setBranchData] = useState([]);
    const [branchId, setBranchId] = useState("");
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


    const onChange = (page) => {
        setCurrent(page);
        setIsLoading(true);
    };

    const getAllBranchList = async () => {
        try {
            const res = await fetchAllBranchList(token);
            if (res.status === 200) {
                setBranchData(res.data.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllBranchList();
    }, []);

    const orderActionType = (status) => {
        let actionColor;
        if (status === "RETURN") {
            actionColor = "#FFA24C"
        } else if (status === "PARTIALRETURN") {
            actionColor = "#8EACCD"

        } else if (status === "CANCEL") {
            actionColor = "#F95454"
        }
        return actionColor
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'INISIATED':
                return '#EB5B00';
            case 'COMPLETED':
                return '#87A922';
            case 'SUCCESS':
                return '#87A922';
            case 'REJECTED':
                return '#FF204E';
            case 'FAILED':
                return '#FF204E';
            default:
                return '#B3A398';
        }
    };
    const columns = [
        {
            title: 'Order Code',
            dataIndex: 'orderCode',
            key: 'orderCode',
            render: (_, { orderCode }) => (
                <div className="order_code">
                    <span>#</span><span><b>{orderCode}</b></span>

                </div>
            ),
            ellipsis: true,
        },

        {
            title: 'Current Order Status ',
            dataIndex: 'currentOrderStatus',
            key: 'currentOrderStatus',
            ellipsis: true,

            render: (_, { currentOrderStatus }) => (
                <Tag color={getCurrentStatus(currentOrderStatus)}>{currentOrderStatus}</Tag>

            ),

        },
        {
            title: 'Refund Type',
            dataIndex: 'actionOn',
            key: 'actionOn',
            render: (_, { actionOn }) => (

                <Tag color={orderActionType(actionOn)} bordered={false}>
                    {actionOn}
                </Tag>

            ),
            ellipsis: true,
        },

        {
            title: 'Collect Amount',
            dataIndex: 'userTotalPaid',
            key: 'userTotalPaid',
            ellipsis: true,
            render: (_, { userTotalPaid }) => (
                <>
                    ₹{userTotalPaid}
                </>
            )

        },
        {
            title: 'Return Amount',
            dataIndex: 'returnAmount',
            key: 'returnAmount',
            ellipsis: true,
            render: (_, { returnAmount }) => (
                <>
                    ₹{returnAmount}
                </>
            )

        },
        {
            title: ' Refunded Amount ',
            dataIndex: 'amountPaid',
            key: 'amountPaid',
            ellipsis: true,
            render: (_, { amountPaid }) => (
                <>
                    ₹{amountPaid}
                </>
            )


        },
        {
            title: 'No Of Items',
            dataIndex: 'totalItem',
            key: 'totalItem',


            ellipsis: true,
        },


        {
            title: 'Branch Name',
            dataIndex: 'branchAlias',
            key: 'branchAlias',
            ellipsis: true,


        },
        {
            title: 'Customer Name',
            dataIndex: 'userFullName',
            key: 'userFullName',


            ellipsis: true,
        },

        {
            title: 'Customer Number',
            dataIndex: 'userMobileNo',
            key: 'userMobileNo',
            ellipsis: true,


        },
       
        {
            title: 'Refund Date Time',
            dataIndex: 'paidDateTime',
            key: 'paidDateTime',
            ellipsis: true,
            render: (_, { paidDateTime }) => (
                <>
                    {paidDateTime != null ? paidDateTime : "N/A"}
                </>
            )


        },
        {
            title: ' Refund Payment Mode ',
            dataIndex: 'refundOn',
            key: 'refundOn',
            ellipsis: true,



        },

        {
            title: 'Refund Status',
            key: 'status',
            dataIndex: 'status',
            ellipsis: true,

            render: (_, { status, _id }) => (
                <>
                    <Tag key={_id} color={getStatusColor(status)}>{status}</Tag>
                </>
            ),
        },
        {
            title: 'Action',
            key: '_id',
            render: (_, { _id, status, actionOn, refundOn, userOrderId, userOrderReturnAndReplacementId,returnAmount }) => (
                <Space size="middle">
                    <ViewPaymentCredential returnAmount={returnAmount} status={status} userPaymentDetailsId={_id} refundType={refundOn} shhowAllOrderRefundList={shhowAllOrderRefundList} />
                    <Button shape="round" className="view_details" onClick={() => actionOn !== "RETURN" ? navigate(`/dashboard/orders-details/${userOrderId}`) : navigate(`/dashboard/return-replace-details/${userOrderReturnAndReplacementId}`)}>View </Button>

                    {/* <OrderSendBranch branchCode={branchCode} branchId={branchId} status={status} orderId={_id} shhowAllOrderList={shhowAllOrderList} /> */}
                </Space>
            ),
            fixed: 'right',
        },
    ];


    const shhowAllOrderRefundList = async () => {
        try {
            await fetchOrderRefund(token, current, searchInput, branchId)
                .then((res) => {
                    console.log(" refund order  ", res);
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
        shhowAllOrderRefundList()
    }, [current, orderAction, branchId, searchInput])

    const getCurrentStatus = (status) => {
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
            RETURNED: '#347928',
            ASSIGNED:
                '#EB5B00',
            ORDERPACKED:
                '#219C90',
            ACCEPTED:
                '#90D26D',
            DISPATCHED:
                '#008DDA',
            CANCELLEDRETURN:
                '#FF214E',
            REJECTED:
                '#FF214E',
            DELIVERED:
                '#87A922',
            CLOSED:
                '#FF204E',
            CANCELLED:
                '#FF204E',
            PENDING:
                '#B3A398',
        }



        return statusColors[status] || '#B3A398'; // Default color if no match found
    };
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
                            <Title level={4}>  Payment Refund Order</Title>
                        </div>
                        <div className="pro_selector">
                            <Space>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Branch"
                                    optionFilterProp="children"
                                    onChange={(value) => setBranchId(value)}
                                    style={{ width: '220px' }}
                                >
                                    {branchData?.map((option) => (
                                        <Select.Option
                                            key={option._id}
                                            level={option.branchName}
                                            value={option._id}
                                        >
                                            {capitalize(option.branchName)}
                                        </Select.Option>
                                    ))}
                                </Select>
                                {/* <Segmented options={["REMOVED", "CANCELLED"]} block onChange={(value) => setOrderAction(value)} /> */}
                                <Input allowClear style={{ width: '200px' }} placeholder="Search Order ID " suffix={<SearchOutlined />} onChange={(e) => setSearchInput(e.target.value)} />
                            </Space>
                        </div>

                    </div>

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





export default OrderRefund