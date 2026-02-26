import React, { useEffect, useRef, useState } from "react";
import { Badge, Breadcrumb, Button, Card, Checkbox, Descriptions, Form, Image, Input, List, Modal, Popconfirm, Select, Statistic, Tabs, Typography, message } from "antd";
import '../../style/vendor.css'
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { Col, Row } from "react-bootstrap";
import { MdKeyboardBackspace } from "react-icons/md";
import { MdOutlineShoppingBag, MdEditCalendar } from "react-icons/md";
import { FaGrinStars } from "react-icons/fa";
import { VendorApproval, VendorReject, fetchAllVendorDetails } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import EmptyImage from "../../assest/png/NotImg.png"
import ReassignBranch from "./ReassignBranch";
import { BsCartCheck } from "react-icons/bs";

import { BsCartX } from "react-icons/bs";
import { HiOutlineCurrencyRupee } from "react-icons/hi";

function DeliveryPartnerDetails() {
    const { Meta } = Card;
    const { token } = useAuth()
    const navigate = useNavigate()
    const { Title } = Typography
    const location = useLocation();
    const { id } = useParams()
    const [vendorInfo, setVendorInfo] = useState([])
    const [isLoading, setIsLoading] = useState([])
    const ReasonRef = useRef("");


    const showAllVendorDetails = async () => {
        try {
            await fetchAllVendorDetails(token, id)
                .then((res) => {
                    if (res.status == 200) {
                        setVendorInfo(res.data.data);
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
        showAllVendorDetails();
    }, []);

    const vendorApprove = () => {
        Modal.success({
            title: 'Approve Delivery Partner',

            content: 'Are you check all information and document',
            onOk() {
                handleApproval()
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const vendorReject = () => {
        Modal.error({
            title: 'Delivery Partner Reject',
            cancelText: 'No',
            content: <div>
                <p>why are you reject Delivery Partner request </p>
                <Form layout="vertical">

                    <Form.Item
                        name="reason"
                        label="Enter Reason"
                        rules={[
                            {
                                required: true,
                                message: "Please Enter Season!",
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="Enter Reasone"
                            onChange={(e) => (ReasonRef.current = e.target.value)} />
                    </Form.Item>
                </Form>
            </div>,
            onOk() {
                handleVendorRejected()
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    //handle approval


    const handleApproval = async () => {
        const body = {
            vendorId: id,
            isDocumentVerified: true,

        }
        try {
            await VendorApproval(token, body)
                .then((res) => {
                    if (res.status == 201) {
                        message.success(res.data.message);
                        showAllVendorDetails()
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    };



    //vendor rejected  

    const handleVendorRejected = async () => {
        const body = {
            vendorId: id,
            isDocumentVerified: false,
            reason: ReasonRef.current,
        }
        try {
            await VendorReject(token, body)
                .then((res) => {
                    if (res.status == 201) {
                        message.success(res.data.message);
                        showAllVendorDetails()
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    };




    let rejectStatus;


    if (vendorInfo?.isDocumentVerified == false && vendorInfo?.isReUpload === true) {
        rejectStatus = <Button type="primary" danger onClick={vendorReject} shape="round">Reject</Button>;
    } else if (vendorInfo?.isDocumentVerified == false) {
        rejectStatus = <Button disabled className="disable_btn" shape="round">Rejected</Button>;
    } else if (vendorInfo?.isDocumentVerified == true && vendorInfo?.isDocumentUpload == true) {
        rejectStatus = <Button disabled className="disable_btn" shape="round">Not Reject</Button>;
    } else if (vendorInfo?.isDocumentVerified == null && vendorInfo?.isDocumentUpload == false) {
        rejectStatus = <Button disabled className="disable_btn" shape="round">Reject</Button>;
    } else if (vendorInfo?.isDocumentUpload == false) {
        rejectStatus = <Button disabled className="disable_btn" shape="round">Not Upload</Button>;
    } else if (vendorInfo?.isDocumentUpload == true && vendorInfo?.isDocumentVerified == null) {
        rejectStatus = <Button type="primary" shape="round" danger onClick={vendorReject}>
            Reject
        </Button>;
    }

    //check state 

    let approvelStatus;

    if (vendorInfo?.isDocumentVerified === false && vendorInfo?.isReUpload === true) {
        approvelStatus = <Button shape="round" id="Approved" onClick={vendorApprove} >Approve</Button>;
    } else if (vendorInfo?.isDocumentVerified == false) {
        approvelStatus = <Button disabled shape="round" className="disable_btn">Approve</Button>;
    } else if (vendorInfo?.isDocumentVerified == null && vendorInfo?.isDocumentUpload == false) {
        approvelStatus = <Button disabled className="disable_btn" shape="round">Approve</Button>;
    } else if (vendorInfo?.isDocumentVerified == true) {
        approvelStatus = <Button disabled className="disable_btn" shape="round">Approved</Button>;
    } else if (vendorInfo?.isDocumentUpload == false) {
        approvelStatus = <Button disabled className="disable_btn" shape="round">Approve</Button>;
    } else if (vendorInfo?.isDocumentUpload == true && vendorInfo?.isDocumentVerified == null) {
        approvelStatus = <Button type="primary" shape="round" id="Approved" onClick={vendorApprove}>
            Approve
        </Button>;
    }




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
                                <Button type="circle" onClick={() => navigate(-1)}> <MdKeyboardBackspace className="back_icon" /></Button>
                                <Title level={4}>Delivery Partner Details</Title>
                            </Space>
                        </div>


                    </div>

                </div>
                <div className="content">
                    {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                        <div className="delivery_details">

                            <div className="delivery_title">
                                <Card >
                                    <Row>
                                        <Col md={4}>
                                            <Card cover={
                                                vendorInfo?.profilePic != null ? <img className="vendor_details_img" src={vendorInfo?.profilePic} /> : <img src="error" fallback={EmptyImage} />
                                            }>
                                                <Card.Meta
                                                    title={
                                                        <div className="del_boy_image">
                                                            <p>{vendorInfo?.fullName}</p>
                                                            <p>+91-{vendorInfo?.mobileNo}</p>
                                                        </div>
                                                    }
                                                >


                                                </Card.Meta>
                                            </Card>

                                        </Col>
                                        <Col md={8}>
                                            <div className="delivery_boy_activity">
                                                <Card hoverable>
                                                    <MdOutlineShoppingBag className="del_boy_icons" />
                                                    <div className="de_boy_act_title">
                                                        <p>Total Order</p>
                                                        <p>{vendorInfo?.totalOrder}</p>
                                                    </div>
                                                </Card>
                                                <Card hoverable>
                                                    <BsCartX className="del_boy_icons" />
                                                    <div className="de_boy_act_title">
                                                        <p> Order Pending</p>
                                                        <p>{vendorInfo?.totalPendingOrder}</p>
                                                    </div>
                                                </Card>
                                                <Card hoverable>
                                                    <BsCartCheck className="del_boy_icons" />
                                                    <div className="de_boy_act_title">
                                                        <p> Order Completed</p>
                                                        <p>{vendorInfo?.totalCompletedOrder}</p>
                                                    </div>
                                                </Card>
                                                <Card hoverable>
                                                    <FaGrinStars className="del_boy_icons" />
                                                    <div className="de_boy_act_title">
                                                        <p>Rating</p>
                                                        <p>{vendorInfo?.totalVendorRating?.toFixed(2)}</p>
                                                    </div>

                                                </Card>
                                                <Card hoverable>
                                                    <FaGrinStars className="del_boy_icons" />
                                                    <div className="de_boy_act_title">
                                                        <p>Review</p>
                                                        <p>{vendorInfo?.totalVendorReview}</p>
                                                    </div>

                                                </Card>
                                                <Card hoverable>
                                                    <HiOutlineCurrencyRupee className="del_boy_icons" />
                                                    <div className="de_boy_act_title">
                                                        <p> Outstanding Balance</p>
                                                        <p>{vendorInfo?.outStandingBalance}</p>
                                                    </div>

                                                </Card>




                                            </div>
                                        </Col>
                                    </Row>


                                </Card>
                            </div>
                            <Row>
                                <Col md={8}>
                                    <div className="del_boy_details">
                                        {vendorInfo?.isReUpload === true ? <Badge.Ribbon text="Reupload" style={{ zIndex: "1" }} color="blue" /> : null}

                                        <Card title="Delivery Partner Details">

                                            <Tabs defaultActiveKey="1" type="card" size="medium" tabBarExtraContent={<div className="vendor_actions">
                                                <Space>

                                                    {approvelStatus}

                                                    {rejectStatus}
                                                </Space>



                                            </div>}>
                                                <Tabs.TabPane tab="Personal " key="1">
                                                    <div className="del_boy_personal">

                                                        <Descriptions title="Personal Details" bordered layout="vertical">
                                                            <Descriptions.Item label="Name">
                                                                {vendorInfo?.fullName}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Number">
                                                                {vendorInfo?.mobileNo}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Gender">
                                                                {vendorInfo?.gender != null ? <span>{vendorInfo?.gender} </span> : <span>N/A</span>}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="DOB">
                                                                {new Date(vendorInfo?.dob).toLocaleDateString()}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Vehicle type">
                                                                {vendorInfo?.vehicle != null ? <span>{vendorInfo?.vehicle} </span> : <span>N/A</span>}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Work City">
                                                                {vendorInfo?.workCity != null ? <span>{vendorInfo?.workCity} </span> : <span>N/A</span>}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Aadhar Number">
                                                                {vendorInfo?.aadharNumber != null ? <span>{vendorInfo?.aadharNumber} </span> : <span>N/A</span>}
                                                            </Descriptions.Item>

                                                            <Descriptions.Item label="Pan Number">
                                                                {vendorInfo?.panNumber != null ? <span>{vendorInfo?.panNumber} </span> : <span>N/A</span>}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Driving License No">
                                                                {vendorInfo?.drivingLicenseNo != null ? <span>{vendorInfo?.drivingLicenseNo} </span> : <span>N/A</span>}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="City">
                                                                {vendorInfo?.city != null ? <span>{vendorInfo?.city} </span> : <span>N/A</span>}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="State">
                                                                {vendorInfo?.state != null ? <span>{vendorInfo?.state} </span> : <span>N/A</span>}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Address">
                                                                {vendorInfo?.address != null ? <span>{vendorInfo?.address} </span> : <span>N/A</span>}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Pin Code">
                                                                {vendorInfo?.pinCode != null ? <span>{vendorInfo?.pinCode} </span> : <span>N/A</span>}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Document Verified">
                                                                {vendorInfo?.isDocumentVerified == null ? <Tag >
                                                                    Pending
                                                                </Tag> : vendorInfo?.isDocumentVerified == true ? <Tag color="green">
                                                                    Approved
                                                                </Tag> : <Tag color="red" >
                                                                    Reject
                                                                </Tag>}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Document Upload">
                                                                {vendorInfo?.isDocumentUpload ? <Tag color="green">Uploaded</Tag> : <Tag color="red">Pending</Tag>}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Document Action Date ">
                                                                {vendorInfo?.documentActionDate}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Status ">
                                                                {vendorInfo?.status == "ACTIVE" ? <Tag color="green">
                                                                    {vendorInfo?.status}
                                                                </Tag> : <Tag color="orange" >
                                                                    {vendorInfo?.status}
                                                                </Tag>}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Branch Assign By ">
                                                                {vendorInfo?.branchAssignedBy != null ? <span>{vendorInfo?.branchAssignedBy?.fullName}</span> : "N/A"}
                                                            </Descriptions.Item>
                                                        </Descriptions>


                                                    </div>
                                                </Tabs.TabPane>
                                                <Tabs.TabPane tab="Document" key="2">
                                                    <Descriptions title="Document Details" bordered layout="vertical">
                                                        <Descriptions.Item label="Adhar Card Front">
                                                            {vendorInfo?.aadharFile != null ? <Image src={vendorInfo?.aadharFile[0]} className="doc_img" /> : <Image src={EmptyImage} width={120} />}




                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Adhar Card Back">
                                                            {vendorInfo?.aadharFile != null ? <Image src={vendorInfo?.aadharFile[1]} className="doc_img" /> : <Image src={EmptyImage} width={120} />}


                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Pan Card ">
                                                            {vendorInfo?.panFile != null ? <Image src={vendorInfo?.panFile} className="doc_img" /> : <Image src={EmptyImage} width={120} />}


                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Driver Licencse">


                                                            {vendorInfo?.drivingLicenseFile != null ? <Image className="doc_img" src={vendorInfo?.drivingLicenseFile} /> : <Image src={EmptyImage} width={120} />}

                                                        </Descriptions.Item>


                                                    </Descriptions>
                                                </Tabs.TabPane>
                                                <Tabs.TabPane tab="Bank" key="3">
                                                    <Descriptions title="Personal Details" bordered layout="vertical">
                                                        <Descriptions.Item label="Bank Holder Name">
                                                            {vendorInfo?.bankDetails != null ? <span>{vendorInfo?.bankDetails.holderName}</span> : <span>N/A</span>}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Bank Account Number">
                                                            {vendorInfo?.bankDetails != null ? <span>{vendorInfo?.bankDetails.accountNo}</span> : <span>N/A</span>}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Bank Name">
                                                            {vendorInfo?.bankDetails != null ? <span>{vendorInfo?.bankDetails.bankName}</span> : <span>N/A</span>}
                                                        </Descriptions.Item>

                                                        <Descriptions.Item label="IFSC Code ">
                                                            {vendorInfo?.bankDetails != null ? <span>{vendorInfo?.bankDetails.ifscCode}</span> : <span>N/A</span>}
                                                        </Descriptions.Item>

                                                    </Descriptions>
                                                </Tabs.TabPane>
                                            </Tabs>
                                        </Card>
                                        {/* </Badge.Ribbon> */}
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="del_boy_details">
                                        <Card
                                            title={<div className="assing_branch_title" >
                                                <p>Assigned Branch</p>
                                                <ReassignBranch vendorId={vendorInfo?._id} showAllVendorDetails={showAllVendorDetails} branchIds={vendorInfo?.branchId} ApproveStatus={vendorInfo?.isDocumentVerified} />

                                            </div>}

                                            hoverable
                                            bordered
                                            cover={
                                                <img
                                                    alt="example"
                                                    src={vendorInfo?.branchId?.branchImage}
                                                    id="branch_img"
                                                    onClick={() => navigate(`/dashboard/branch-details/${vendorInfo?.branchId?._id}`)}
                                                />
                                            }
                                        >

                                            <Meta
                                                // avatar={<Avatar src={item.url} />}
                                                title={<div><p>{vendorInfo?.branchId?.branchName}</p>


                                                </div>}
                                                description={<div className="branch_des">
                                                    <p>Branch Code : {vendorInfo?.branchId?.branchCode}</p>

                                                </div>}
                                            />
                                        </Card>


                                    </div>
                                </Col>

                            </Row>
                        </div>}
                </div>


            </div>

        </section>
    );
}





export default DeliveryPartnerDetails