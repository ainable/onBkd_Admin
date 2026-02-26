import React, { useEffect, useState } from "react";
import { Alert, Avatar, Breadcrumb, Button, Card, Checkbox, Descriptions, Divider, Empty, Image, List, Pagination, Popconfirm, Segmented, Select, Skeleton, Statistic, Typography, message } from "antd";
import '../../style/product.css'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { Col, Row } from "react-bootstrap";
import { deleteVendor, fetchAllVendorList, fetchOrderDatails, fetchOrderRefundDetails } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import { MdKeyboardBackspace, MdOutlineKeyboardBackspace } from "react-icons/md";
import ProductData from "../dashboard/ProductData";
import BKDLogo from "../../assest/png/bkdlogo.png"
import DefaultImg from "../../assest/chat/user.png"



function RefundOrderDetails() {
    const navigate = useNavigate()
    const location = useLocation();
    const { token, logout } = useAuth();
    const [orderData, setOrderData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams()
    const { Title } = Typography;

    const [bankType, setBankType] = useState("Bank")






    const showOrderRefundDetials = async () => {
        try {
            await fetchOrderRefundDetails(token, id)
                .then((res) => {
                    console.log("res refund order details", res)
                    if (res.status == 200) {
                        setOrderData(res.data.data);
                        setIsLoading(true)
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
            setIsLoading(true)
        }
    };

    useEffect(() => {
        showOrderRefundDetials();
    }, []);






    const getStatusColor = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return '#90D26D';
            case 'DISPATCHED':
                return '#008DDA';
            case 'DELIVERED':
                return '#87A922';
            case "CANCELLED":
                return '#FF204E';
            default:
                return '#B3A398';
        }
    };

    const getPayment = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return '#90D26D';

            default:
                return '#B3A398';
        }
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
                            <Space>
                                <Button type="circle" onClick={() => navigate(-1)}> <MdOutlineKeyboardBackspace className="back_icon" /></Button>
                                <Title level={4}>Order Refund Details </Title>
                            </Space>
                        </div>


                    </div>

                </div>
                <div className="content">
                    {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                        <div className="order_particuler">
                            <Card bordered={false}

                            >

                                <Row>
                                    <Col md={8}>
                                        <Card bordered={false} title="  Items List">
                                            <div className="product_iten_list">

                                                <List


                                                    itemLayout="horizontal"

                                                    dataSource={orderData?.productInfo}
                                                    renderItem={(item) => (
                                                        <List.Item
                                                            actions={[<span><del>₹ {item.price}</del></span>, <span><b>₹ {item.bkdAmount}</b></span>]}
                                                        >
                                                            <List.Item.Meta
                                                                avatar={item.imageUrl != null ? <Image src={item.imageUrl} className="order_images" width={50} /> : <Avatar size={50} shape="square" src={BKDLogo} className="order_images" />}
                                                                title={<span>{item.productName}</span>}
                                                                description={<div>
                                                                    <p>{item.packSize}</p>
                                                                    {item.bkdAmount != item.price ? <div className="cat_tags">{Math.round((item.price - item.bkdAmount) * 100 / item.price)}% off</div> : null}
                                                                </div>}
                                                            />
                                                            <div>X {item.quantity}</div>
                                                        </List.Item>
                                                    )}
                                                />
                                            </div>
                                        </Card>

                                        <Descriptions bordered layout="vertical">
                                            <Descriptions.Item label="Alternate Name">
                                                {orderData
                                                    ?.alternativeCustomerName != null ? orderData
                                                    ?.alternativeCustomerName : "N/A"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Alternet Mobile">
                                                {orderData
                                                    ?.alternativeMobileNo != null ? orderData
                                                    ?.alternativeMobileNo : "N/A"}
                                            </Descriptions.Item>

                                            <Descriptions.Item label="Order Code">
                                                {orderData
                                                    ?.orderCode}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Cancel By">
                                                <Tag color="blue" bordered={false}>{orderData
                                                    ?.cancelledBy}</Tag>
                                            </Descriptions.Item>

                                            <Descriptions.Item label="Order Place Date">
                                                {orderData
                                                    ?.addedDate},{orderData
                                                        ?.addedTime}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Order Cancel Date">
                                                {orderData
                                                    ?.cancelledDate}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Order Status">
                                                <Tag key={orderData
                                                    ?.orderStatus
                                                } color={getStatusColor(orderData

                                                    ?.orderStatus)}>{orderData

                                                        ?.orderStatus}</Tag>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Orde Delivery Date">
                                                {orderData
                                                    ?.deliveryDate}
                                            </Descriptions.Item>
                                            <Descriptions.Item label=" Delivery Slot">
                                                {orderData
                                                    ?.timeSlotFrom}-{orderData
                                                        ?.timeSlotTo}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="branchCode">
                                                {orderData
                                                    ?.branchCode}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Alias">
                                                {orderData
                                                    ?.branchAlias}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Payment Status">
                                                <Tag color={orderData
                                                    ?.isPaymentDone != true ? "#387ADF" : "#7ABA78"}>
                                                    {orderData
                                                        ?.isPaymentDone != true ? "Pending" : "Done"}
                                                </Tag>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Payment on">
                                                {orderData
                                                    ?.paymentOn}
                                            </Descriptions.Item>

                                            <Descriptions.Item label="Transaction Id">
                                                {orderData
                                                    ?.transactionId != null ? orderData
                                                    ?.transactionId : <span>N/A</span>}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Payment Date & Time">
                                                {orderData
                                                    ?.paymentDateTime != null ? orderData
                                                    ?.paymentDateTime : <span>N/A</span>}
                                            </Descriptions.Item>
                                            <Descriptions.Item label=" Payment">
                                                <Tag key={orderData
                                                    ?._id} color={getPayment(orderData
                                                        ?.status)}>{orderData?.status}</Tag>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Payment Done By">
                                                {orderData
                                                    ?.pyamentDoneBy != null ? orderData
                                                    ?.pyamentDoneBy : <span>N/A</span>}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Col>
                                    <Col md={4}>
                                        <Card bordered={false} title=" Payble Amount">
                                            <Alert type="success" showIcon={false} message={<div className="Alert_amount_item">
                                                <p><b>Refund Amount  </b></p>
                                                <p><b>{orderData
                                                    ?.totalReturnableAmount != null ? orderData?.
                                                        totalReturnableAmount.toFixed(2) : "0.0"}</b></p>
                                            </div>} banner />
                                        </Card>
                                        <Card bordered={false} title="User Details"
                                            cover={
                                                <img
                                                    className="user_pro_img"
                                                    alt="example"
                                                    src={orderData
                                                        ?.userId?.profilePic != null ? orderData
                                                            ?.userId?.profilePic : DefaultImg}
                                                />
                                            }

                                        >
                                            <Card.Meta
                                                title={<div>
                                                    <p>{orderData
                                                        ?.fullName}</p>
                                                </div>}
                                                description={<div>
                                                    <p>Number : {orderData
                                                        ?.mobileNo}</p>
                                                   
                                                </div>}
                                            />
                                        </Card>
                                        <Card bordered={false} title="Payment Credential" >

                                            <div className="show_bank_data">
                                                {bankType === "Bank" ? <div>
                                                    {orderData?.paymentCredentials != null ? <Descriptions >

                                                        <Descriptions.Item span={3} label="Paid Amount ">
                                                            ₹{orderData?.paymentCredentials?.amountPaid != null ? orderData?.paymentCredentials?.amountPaid : "N/A"}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item span={3} label="Payment Date">
                                                            {orderData?.paymentCredentials?.paymentDate != null ? new Date(orderData?.paymentCredentials?.paymentDate).toLocaleDateString() : "N/A"}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item span={3} label="Payment Method">
                                                            {orderData?.paymentCredentials?.paymentMethod != null ? orderData?.paymentCredentials?.paymentMethod : "N/A"}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item span={3} label="Payment Mode">
                                                            {orderData?.paymentCredentials?.paymentMode != null ? orderData?.paymentCredentials?.paymentMode : "N/A"}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item span={3} label="Transaction Id">
                                                            {orderData?.paymentCredentials?.transactionId != null ? orderData?.paymentCredentials?.transactionId : "N/A"}
                                                        </Descriptions.Item>

                                                    </Descriptions> : <Empty />}
                                                </div> : <div>
                                                    {orderData?.
                                                        userUpiDetails != null ? <Descriptions>
                                                        <Descriptions.Item label="UPI ID">
                                                            {orderData?.
                                                                userUpiDetails?.userUpiId != null ? orderData?.
                                                                    userUpiDetails?.userUpiId : "N/A"}
                                                        </Descriptions.Item>
                                                    </Descriptions> : <Empty />}
                                                </div>}
                                            </div>
                                        </Card>
                                    </Col>

                                </Row>


                            </Card>

                        </div>}
                </div>


            </div>

        </section>
    );
}






export default RefundOrderDetails