

import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Button, Card, Descriptions, Empty, Image, Statistic, Typography } from "antd";
import '../../style/master.css';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { fetchUserDetails } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import { FaUser } from "react-icons/fa";
import { Col, Row } from "react-bootstrap";
import CountUp from 'react-countup';

import RevenueLogo from "../../assest/icon/revenue.png";
import totalOrder from "../../assest/png/pending.png";
import compltedOrder from "../../assest/png/deliverd.png";
import cancelOrder from "../../assest/png/pickup.png";
import _ from 'lodash';
import { MdKeyboardBackspace } from "react-icons/md";

const formatter = (value) => <CountUp end={value} separator="," />;

const { Title } = Typography;

const Locationcolumns = [
    {
        title: ' Address Type',
        dataIndex: 'addressType',
        key: 'addressType',
        ellipsis: true,
        render: addressType => <Tag color="blue">{addressType}</Tag>
    },
    {
        title: ' Flat No/floor No',
        dataIndex: 'flatNumber',
        key: 'flatNumber',
        ellipsis: true,
        render: (_, { flatNumber, floorNumber }) => (
            <>
                {flatNumber}/{floorNumber}
            </>
        )
    },

    {
        title: ' Apartment',
        dataIndex: 'apartmentName',
        key: 'apartmentName',
        ellipsis: true,
        render: (_, { apartmentName }) => (
            <>
                {apartmentName != null ? apartmentName : "N/A"}
            </>
        )
    },
    {
        title: ' Landmark',
        dataIndex: 'howToReach',
        key: 'howToReach',
        ellipsis: true,
    },
    {
        title: ' Area',
        dataIndex: 'area',
        key: 'area',
        ellipsis: true,

    },
    {
        title: 'Created',
        dataIndex: 'addedDate',
        key: 'addedDate',
        render: addedDate => new Date(addedDate).toLocaleDateString()
    },
];

const ReferredUserscolumns = [
    {
        title: 'Name',
        dataIndex: 'fullName',
        key: 'fullName',
        ellipsis: true,
        render: (_, { referredUser }) => (
            <>
                {referredUser?.fullName}
            </>
        )
    },
    {
        title: 'Mobile No',
        dataIndex: 'mobileNo',
        key: 'mobileNo',
        ellipsis: true,
        render: (_, { referredUser }) => (
            <>
                {referredUser?.mobileNo}
            </>
        )
    },
    {
        title: 'Referral Code',
        dataIndex: 'referralCode',
        key: 'referralCode',
        ellipsis: true,
        render: (_, { referredUser }) => (
            <>
                {referredUser?.referralCode}
            </>
        )
    },
    {
        title: 'Reward Name',
        dataIndex: 'rewardName',
        key: 'rewardName',
        ellipsis: true,
        render: (_, { rewardDetails }) => (
            <>
                {rewardDetails?.rewardName}
            </>
        )
    },
    {
        title: 'Activated Date',
        dataIndex: 'activatedDate',
        key: 'activatedDate',
        render: activatedDate => new Date(activatedDate).toLocaleDateString()
    },
];

function UserDetails() {
    const location = useLocation();
    const { id } = useParams()
    const navigate = useNavigate();
    const { token } = useAuth();

    const [userInfo, setUserInfo] = useState(null);
    const [locLoading, setLocLoading] = useState(false);

    const showUserDetails = async () => {
        try {
            const res = await fetchUserDetails(token, id);
            if (res.status === 200) {
                setUserInfo(res.data.data);
                setLocLoading(true);
            }
        } catch (error) {
            console.log(error);
            setLocLoading(true);
        }
    };

    useEffect(() => {
        showUserDetails();

    }, []);

    return (
        <section className="main_Section">
            <Breadcrumb
                items={[
                    { title: "Dashboard" },
                    { title: location.pathname },
                ]}
            />
            <div className="content_title">
                <div className="content_head">
                    <div className="content_title">
                        <Space>
                            <Button type="circle" onClick={() => navigate(-1)}> <MdKeyboardBackspace className="back_icon" /></Button>
                            <Title level={4}>Customer Details</Title>
                        </Space>
                    </div>

                </div>
                <div className="content">
                    <div className="shoo_recent_order">
                        {!locLoading ? (
                            <div className="loader_main">
                                <span className="loader2"></span>
                            </div>
                        ) : (
                            <div className="user_details">
                                <div className="user_total_count">
                                    <Card className="mb-2">
                                        <div className="total_order">
                                            <img src={totalOrder} />
                                            <Statistic className="h4" title={<span className="h5">Total Order</span>} value={userInfo?.totalOrder} formatter={formatter} />
                                        </div>
                                    </Card>
                                    <Card className="mb-2">
                                        <div className="total_order">
                                            <img src={compltedOrder} />
                                            <Statistic className="h4" title={<span className="h5">Order Completed</span>} value={userInfo?.totalCompletedOrder} formatter={formatter} />
                                        </div>
                                    </Card>
                                    <Card className="mb-2">
                                        <div className="total_order">
                                            <img src={cancelOrder} />
                                            <Statistic className="h4" title={<span className="h5">Order Cancelled</span>} value={userInfo?.totalCancelledOrder} formatter={formatter} />
                                        </div>
                                    </Card>
                                    <Card className="mb-2">
                                        <div className="total_order">
                                            <img src={RevenueLogo} />
                                            <Statistic className="h4" title={<span className="h5">Total Revenue</span>} value={userInfo?.totalCompletedOrderRevenue} formatter={formatter} />
                                        </div>
                                    </Card>
                                </div>
                                <Row>
                                    <Col md={12}>
                                        <Card title="Customer Details" className="mb-2">
                                            <Descriptions bordered layout="vertical">
                                                <Descriptions.Item label="Name">
                                                    {userInfo?.fullName}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Mobile No">
                                                    {userInfo?.mobileNo}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Email">
                                                    {userInfo?.email}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Gender">
                                                    {userInfo?.gender}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Pending Order">
                                                    {userInfo?.totalPendingOrder}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Cancelled Order">
                                                    {userInfo?.totalCancelledOrder}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Completed Order">
                                                    {userInfo?.totalCompletedOrder}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Total Order">
                                                    {userInfo?.totalOrder}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Home Delivery Order">
                                                    {userInfo?.totalDeliveryOrder}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Pickup Order">
                                                    {userInfo?.totalPickupOrder}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Product Rating">
                                                    {userInfo?.totalProductRating}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Product Review">
                                                    {userInfo?.totalProductReview}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Vendor Rating">
                                                    {userInfo?.totalVendorRating}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Vendor Review">
                                                    {userInfo?.totalVendorReview}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Status">
                                                    <Tag color={userInfo?.status !== "ACTIVE" ? "red" : "green"}>{userInfo?.status}</Tag>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Created">
                                                    {new Date(userInfo?.addedDate).toLocaleString("en-IN", {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    })}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Image" span={3}>
                                                    {userInfo?.profilePic != null ? <Image src={userInfo?.profilePic} width={40} height={40} style={{ borderRadius: "100%", objectFit: "contain", background: "lightGray" }} /> : <Avatar size={40} icon={<FaUser />} />}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={8}>
                                        <Card title="Customer Location" className="mb-2">
                                            {!locLoading ? (
                                                <div className="loader_main">
                                                    <span className="loader2"></span>
                                                </div>
                                            ) : (
                                                <Table columns={Locationcolumns} dataSource={userInfo?.userLocation} scroll={{ x: true }} pagination={false} />
                                            )}
                                        </Card>
                                    </Col>

                                    <Col md={4}>
                                        {userInfo?.userUpiDetails == null && userInfo?.userBankDetails == null ? <Card title="Bank Details" className="mb-2">
                                            <Empty />
                                        </Card> :
                                            <Card title="Bank Details" className="mb-2">
                                                <Descriptions  >
                                                    <Descriptions.Item span={3} label="Account Holder Name">
                                                        {userInfo?.userBankDetails?.bankAccountHolder}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item span={3} label="Account No.">
                                                        {userInfo?.userBankDetails?.bankAccountNo}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item span={3} label="IFSC ">
                                                        {userInfo?.userBankDetails?.ifscCode}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item span={3} label="UPI ID">
                                                        {userInfo?.userUpiDetails?.upiId}
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </Card>}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={8}>
                                        <Card title="Referral List">
                                            {!locLoading ? (
                                                <div className="loader_main">
                                                    <span className="loader2"></span>
                                                </div>
                                            ) : (
                                                <Table
                                                    columns={ReferredUserscolumns}
                                                    dataSource={userInfo?.referralInfo?.referredUsers}
                                                    scroll={{ x: true }}
                                                    pagination={false}
                                                />
                                            )}
                                        </Card>
                                    </Col>

                                    <Col md={4}>
                                        {!userInfo?.referralInfo?.referredBy ? <Card title="Referred By">
                                            <Empty />
                                        </Card> :
                                            <Card title="Referred By">
                                                <Descriptions  >
                                                    <Descriptions.Item span={3} label="Name">
                                                        {userInfo?.referralInfo?.referredBy?.referredByUser?.fullName}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item span={3} label="Mobile No.">
                                                        {userInfo?.referralInfo?.referredBy?.referredByUser?.mobileNo}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item span={3} label="Referral Code ">
                                                        {userInfo?.referralInfo?.referredBy?.referredByUser?.referralCode}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item span={3} label="Reward Name">
                                                        {userInfo?.referralInfo?.referredBy?.rewardDetails?.rewardName}
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </Card>}
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}



export default UserDetails