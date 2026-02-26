import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Descriptions, Empty, Image, message, Popconfirm, Segmented, Space, Statistic, Table, Tag, Typography } from "antd";
import '../../style/location.css'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Avatar, Card } from 'antd';
import { useAuth } from "../../authentication/context/authContext";
import { MdKeyboardBackspace } from "react-icons/md";
import AddManager from "./AddManager";
import { BranchBranchManager, FetchAllbranchSlote, fetchBranchInfo, FetchbranchSlote } from "../../service/api_services";
import EmptyImg from "../../assest/png/NotImg.png"
import { AiOutlineCopy, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import RevenueLogo from "../../assest/icon/revenue.png";
import totalOrder from "../../assest/png/pending.png";
import compltedOrder from "../../assest/png/deliverd.png";
import cancelOrder from "../../assest/png/pickup.png";
import deliveryPartner from "../../assest/png/deliveryPartner.png";
import storePickup from "../../assest/png/storepickup.png";
import homeDelivery from "../../assest/png/homedelivery.png";
import pendingOrder from "../../assest/png/pendingOrder.png";
import CountUp from 'react-countup';

const formatter = (value) => <CountUp end={value} separator="," />;

const { Title } = Typography;


function BranchDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation();
    const { token, logout } = useAuth()
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [slotLOading, setSlotLoading] = useState(false)
    const [brandInfo, setBranchInfo] = useState(false)
    const [slotType, setSlotType] = useState("DELIVERY")
    const [slotList, setSlotList] = useState([])
    const [isDeleted, setIsDeleted] = useState(false);
    const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();


    const toggleVisibility = (id) => {
        setVisiblePasswords((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const columns = [



        {
            title: ' From Slot',
            dataIndex: 'timeSlotFrom',
            key: 'timeSlotFrom',
            ellipsis: true,
            render: timeSlotFrom => <Tag color="green" bordered={false}>{timeSlotFrom}</Tag>


        },
        {
            title: ' To Slot ',
            dataIndex: 'timeSlotTo',
            key: 'timeSlotTo',
            ellipsis: true,
            render: timeSlotTo => <Tag color="red" bordered={false}>{timeSlotTo}</Tag>


        },

        {
            title: 'Created At',
            dataIndex: 'addedDate',
            key: 'addedDate',
            ellipsis: true,

        },


    ];
    const shhowAllBranchSlote = async () => {
        setSlotLoading(true)
        try {
            await FetchbranchSlote(token, id, slotType)
                .then((res) => {
                    console.log(" branch slote list ", res);
                    if (res.status == 200) {
                        setSlotList(res.data.data);
                        setSlotLoading(false)
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()

                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setSlotLoading(false)

                });
        } catch (error) {
            console.log(error);
            setIsLoading(true)

        }
    };
    useEffect(() => {
        shhowAllBranchSlote()
    }, [slotType])

    const shhowAllBranchInfo = async () => {
        setIsLoading(true)
        try {
            await fetchBranchInfo(token, id)
                .then((res) => {
                    console.log(" all branch detials ", res);
                    if (res.status == 200) {
                        setBranchInfo(res.data.data);
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
        shhowAllBranchInfo();
    }, []);

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            message.success(`Copy-${text}`)
        } catch (err) {
            message.error("Failed to copy:", err);
        }
    };

    const cancel = e => {
        console.log(e);
        message.error('Click on No');
    };

    const handleUserDelete = async (id) => {
        setIsDeleted(true)
        const body = {
            branchUserId: id,
        }
        try {
            const res = await BranchBranchManager(body, token);
            if (res.status === 201) {
                message.success(res.data.message);
                shhowAllBranchInfo();
                setIsDeleted(false);
            }
        } catch (error) {
            console.log(error);
            setIsDeleted(false);
            // message.error(error.response.data.message)

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
                    <div className="content_title">
                        <Title level={4}> <Button shape="circle" onClick={() => navigate(-1)}> <MdKeyboardBackspace className="back_icon" /></Button> Branch Information</Title>
                    </div>
                    <div className="content_add">
                        {/* <AddBranch shhowAllBranchList={shhowAllBranchList} /> */}
                    </div>
                </div>
                {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                    <div className="Branch_details">
                        <div className="user_total_count">
                            <Card className="mb-2">
                                <div className="total_order">
                                    <img src={totalOrder} />
                                    <Statistic className="h4" title={<span className="h5">Total Order</span>} value={brandInfo?.totalOrder} formatter={formatter} />
                                </div>
                            </Card>
                            <Card className="mb-2">
                                <div className="total_order">
                                    <img src={compltedOrder} />
                                    <Statistic className="h4" title={<span className="h5">Order Completed</span>} value={brandInfo?.totalCompletedOrder} formatter={formatter} />
                                </div>
                            </Card>
                            <Card className="mb-2">
                                <div className="total_order">
                                    <img src={cancelOrder} />
                                    <Statistic className="h4" title={<span className="h5">Order Cancelled</span>} value={brandInfo?.totalCancelledOrder} formatter={formatter} />
                                </div>
                            </Card>
                            <Card className="mb-2">
                                <div className="total_order">
                                    <img src={RevenueLogo} />
                                    <Statistic className="h4" title={<span className="h5">Total Revenue</span>} value={brandInfo?.totalCompletedOrderRevenue} formatter={formatter} />
                                </div>
                            </Card>
                            <Card className="mb-2">
                                <div className="total_order">
                                    <img src={pendingOrder} />
                                    <Statistic className="h4" title={<span className="h5">Pending Order</span>} value={brandInfo?.totalPendingOrder} formatter={formatter} />
                                </div>
                            </Card>
                            <Card className="mb-2">
                                <div className="total_order">
                                    <img src={homeDelivery} />
                                    <Statistic className="h4" title={<span className="h5">Home Delivery</span>} value={brandInfo?.totalDeliveryOrder} formatter={formatter} />
                                </div>
                            </Card>
                            <Card className="mb-2">
                                <div className="total_order">
                                    <img src={storePickup} />
                                    <Statistic className="h4" title={<span className="h5">Store Pickup</span>} value={brandInfo?.totalPickupOrder} formatter={formatter} />
                                </div>
                            </Card>
                            <Card className="mb-2">
                                <div className="total_order">
                                    <img src={deliveryPartner} />
                                    <Statistic className="h4" title={<span className="h5"> Delivery Partner</span>} value={brandInfo?.totalVendor} formatter={formatter} />
                                </div>
                            </Card>
                        </div>
                        <Row>
                            <Col md={7}>
                                {/* <Card title="Branch Details" > */}
                                <Descriptions title="Branch Details" bordered layout="vertical">
                                    <Descriptions.Item label="Branch Image">
                                        {brandInfo?.branchImage != null ? <Image src={brandInfo?.branchImage} width={40} /> : <Image src={EmptyImg} width={40} />}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Branch Code">
                                        {brandInfo?.branchCode}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Branch Name">
                                        {brandInfo?.branchName}

                                    </Descriptions.Item>
                                    <Descriptions.Item label="Branch Area" span={2}>
                                        {brandInfo?.area}

                                    </Descriptions.Item>

                                    <Descriptions.Item label=" State">
                                        {brandInfo?.state}

                                    </Descriptions.Item>
                                    <Descriptions.Item label=" Alias">
                                        {brandInfo?.branchAlias}

                                    </Descriptions.Item>
                                    <Descriptions.Item label=" Full Address" span={3}>
                                        {capitalize(brandInfo?.fullAddress)}
                                    </Descriptions.Item>
                                    {/* <Descriptions.Item label="Assigned Manager">
                                            {brandInfo?.branchKeeperProfile != null ? brandInfo?.branchKeeperProfile?.fullName
                                                : "N/A"}
                                        </Descriptions.Item> */}

                                </Descriptions>
                                {/* </Card> */}
                            </Col>
                            <Col md={5}>
                                <div className="show_available_Slots">
                                    {/* <Card title="All Available Slots"> */}
                                    <h6>All Available Slots</h6>
                                    <Segmented
                                        block
                                        options={['DELIVERY', 'PICKUP', 'RETURN', 'REPLACEMENT']}
                                        onChange={(value) => {
                                            setSlotType(value)
                                        }}
                                    />
                                    {slotLOading ? <div className="loader_main"> <span class="loader2"></span></div> :
                                        <Table columns={columns} dataSource={slotList} scroll={{ x: true }} />}
                                    {/* </Card> */}
                                </div>
                            </Col>
                            <Card className="mt-3">
                                {brandInfo?.branchKeeperProfile?.length !== 0 ?
                                    <div className="booking_sub_servicelist">
                                        <div className="manager_title">
                                            <h5>Branch User</h5>
                                            <AddManager branchId={id} shhowAllBranchInfo={shhowAllBranchInfo} />
                                        </div>
                                        <Row>
                                            {brandInfo?.branchKeeperProfile?.map((item) => (
                                                <Col md={4} xxl={2}>
                                                    <Card
                                                        actions={[<Popconfirm
                                                            title="Delete the manager"
                                                            description="Are you sure to delete this manager?"
                                                            onConfirm={() => handleUserDelete(item._id)}
                                                            onCancel={cancel}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <Button danger loading={isDeleted} shape="round">Delete</Button>
                                                        </Popconfirm>]}
                                                        hoverable
                                                        cover={<img alt="Cover" src="https://cdn-icons-png.flaticon.com/512/4205/4205906.png" />}
                                                    >
                                                        <Card.Meta
                                                            title={<div className="shopker_data">
                                                                <p>Name : {item.fullName?.toUpperCase()}</p>
                                                                <p>Email : {item.
                                                                    email} <span> <AiOutlineCopy className="cursor-pointer" onClick={() => handleCopy(item.
                                                                        email)} /></span></p>
                                                                <p>Assign Branch Code : {item.branchCode}</p>
                                                                <p>Role : {item?.roleName || "N/A"}</p>
                                                            </div>
                                                            }
                                                            description={<Space>Password :
                                                                <p>{visiblePasswords[item._id] ? item.password : <span>************</span>} <span> <AiOutlineCopy className="cursor-pointer" onClick={() => handleCopy(item.
                                                                    password)} /></span></p>
                                                                <p>{visiblePasswords[item._id] ? <AiOutlineEye className="showIcon" onClick={() => toggleVisibility(item._id)} /> : <AiOutlineEyeInvisible className="hideIcon" onClick={() => toggleVisibility(item._id)} />}</p>
                                                            </Space>}
                                                        />

                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                    :
                                    // <Card title="Branch Manager Details">

                                    <Empty
                                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"

                                        description={
                                            <span>
                                                Not Assign Any Branch manager
                                            </span>
                                        }
                                    >
                                        <AddManager branchId={id} shhowAllBranchInfo={shhowAllBranchInfo} />
                                    </Empty>
                                    // </Card>
                                }
                            </Card>
                        </Row>
                    </div>
                }

            </div>

        </section>
    );
}





export default BranchDetails