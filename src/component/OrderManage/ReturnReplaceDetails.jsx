import React, { useEffect, useState } from "react";
import { Alert, Avatar, Breadcrumb, Button, Card, Checkbox, Descriptions, Divider, Empty, Image, List, Pagination, Popconfirm, Select, Skeleton, Statistic, Typography, message } from "antd";
import '../../style/product.css'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { Col, Row } from "react-bootstrap";
import DefaultImage from "../../assest/png/defaut_img.jpg"

import {  fetchReturnReplaceDetail, ReturnReplaceAction } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import {  MdOutlineKeyboardBackspace } from "react-icons/md";
import DefaulImg from "../../assest/png/bkdlogo.png"
import DefaultImg from "../../assest/chat/user.png"
import { HiOutlineShoppingBag } from "react-icons/hi";

import { MdLocationPin, MdStorefront } from "react-icons/md";
import ReturnOrderCancel from "./ReturnOrderCancel";


function ReturnReplaceDetails() {
  const navigate = useNavigate()
  const location = useLocation();
  const { token, logout } = useAuth();
  const [orderData, setOrderData] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams()
  const { Title } = Typography;

  const columns = [
    {
      title: 'Pay Action',
      dataIndex: 'actionOn',
      key: 'actionOn',
      render: actionOn => <Tag bordered={false} color={actionOn != "ORDER" ? "red" : "green"}>{actionOn}</Tag>

    },

    {
      title: 'Payment Date',
      dataIndex: 'paidDateTime',
      key: 'paidDateTime',

    },
    {
      title: 'Payment Mode',
      dataIndex: 'paymentMode',
      key: 'paymentMode',

    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <Tag color={status === "SUCCESS" ? "#059212" : "blue"}>{status}</Tag>
      )

    },

    // {
    //     title: 'Payment Mode',
    //     dataIndex: 'paymentMode',
    //     key: 'paymentMode',
    //     render: paymentMode => <Tag bordered={false} color={paymentMode != "ONLINE" ? "blue" : "green"}>{paymentMode}</Tag>

    // },
    // {
    //     title: 'Transaction Id',
    //     dataIndex: 'transactionId',
    //     key: 'transactionId',


    // },


  ];


  const Statuscolumns = [
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: orderStatus => <Tag bordered={false} color={getStatusColor(orderStatus)}>{orderStatus}</Tag>

    },

    {
      title: 'Name',
      dataIndex: 'addedName',
      key: 'addedName',

    },


    {
      title: 'Action Date',
      dataIndex: 'addedDate',
      key: 'addedDate',

    },

    {
      title: 'Action By',
      dataIndex: 'addedVia',
      key: 'addedVia',


    },


  ];

  const showReturnReplaceDetails = async () => {
    try {
      await fetchReturnReplaceDetail(token, id)
        .then((res) => {
          console.log("return replace order details", res)
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
    showReturnReplaceDetails()
  }, [])


  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case 'RETURNVENDORASSIGNED' || "RETURNVENDORASSIGNED":
  //       return '#EB5B00';
  //     case 'REPLACEVENDORACCEPTED' || "REPLACEVENDORACCEPTED":
  //       return '#219C90';
  //     case 'RETURNACCEPTED' || "REPLACEACCEPTED":
  //       return '#90D26D';
  //     case 'REPLACEASSIGNED' || "RETURNASSIGNED":
  //       return '#4CC9FE';
  //     case 'RETURNACCEPTED' || "REPLACEACCEPTED":
  //       return '#87A922';
  //     case 'REPLACEREJECTED' || "RETURNREJECTED":
  //       return '#FF204E';
  //       case 'REPLACED' || "RETURNED":
  //         return '#347928';
  //     default:
  //       return '#B3A398';
  //   }
  // };
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
      CLOSED: '#FF204E',
      REPLACED: '#347928',
      REPLACEREJECTEDRETURN: '#347928',
      RETURNED: '#347928'
    };

    return statusColors[status] || '#B3A398'; // Default color if no match found
  };


  const handleRequestAccept = async () => {
    const body = {
      "retOrRepId": id,
      "status": "ACCEPTED"//REJECTED
    };

    try {
      const res = await ReturnReplaceAction(token, body);
      console.log("res", res)
      if (res.status === 201) {
        message.success(res.data.message);
        showReturnReplaceDetails(); // Refresh the order list

      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const cancel = (e) => {
    console.log(e);
    message.error('Click on No');
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
                <Title level={4}>Order Details </Title>
              </Space>
            </div>
            <div className="return_actions">
              <Space>

                <ReturnOrderCancel orderData={orderData} showReturnReplaceDetails={showReturnReplaceDetails} />
                <Popconfirm
                  title={`Accept the ${orderData?.type === "RETURN" ? "Return" : "Replace"}`}
                  description={`Are you sure to Accept this ${orderData?.type === "RETURN" ? "Return" : "Replace"}?`}
                  onConfirm={handleRequestAccept}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                  placement="topLeft"

                >

                  <Button className="return_Accept_btn" shape="round" disabled={orderData?.status !== "RETURNPENDING" && orderData?.status !== "REPLACEPENDING"} >Accept</Button>
                </Popconfirm>
              </Space>
            </div>


          </div>

        </div>
        <div className="content">
          {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
            <div className="order_particuler">

              <Row>
                <Col md={6}>
                  <Card bordered={false} title={<Space>
                    <MdStorefront className="delivery_icons" />
                    <p>Pick-up  Location</p>
                  </Space>}>
                    <Descriptions >

                      <Descriptions.Item span={3} label="Branch Name">
                        {orderData?.branchId?.branchName}
                      </Descriptions.Item>

                      <Descriptions.Item span={3} label="Full Address">
                        {orderData?.branchId?.fullAddress}
                      </Descriptions.Item>

                    </Descriptions>
                  </Card>
                </Col>
                {orderData?.deliveryOption != "PICKUP" ? <Col md={6}>
                  <Card bordered={false} title={<Space>
                    <MdLocationPin className="delivery_icons" />
                    <p>Delivery  Location</p>
                  </Space>}>
                    <Descriptions >
                      <Descriptions.Item span={3} label="Address Type">
                        {orderData?.userLocationId?.addressType}
                      </Descriptions.Item>
                      <Descriptions.Item span={3} label="Full Address">
                        {orderData?.userLocationId?.area}
                      </Descriptions.Item>
                      <Descriptions.Item span={3} label="How to reach">
                        {orderData?.userLocationId?.howToReach}
                      </Descriptions.Item>

                    </Descriptions>
                  </Card>
                </Col> : null}
              </Row>
              <Row>
                <Col md={9}>
                  <Card bordered={false} actions={[<div style={{ padding: "0 1rem", textAlign: "start" }}>
                    <Alert message={<span>Reason : {orderData?.reason ? orderData?.reason : null}</span>} type="info" showIcon />
                  </div>]} title={
                    <div className="product_order_item">
                      <p>No. of Item {orderData?.productInfo?.length}</p>
                      <Space>

                        <p>{orderData?.isPoolOrder ? <Tag color="blue" bordered={false}>POOL ORDER</Tag> : null}</p>
                      </Space>

                    </div>
                  }>
                    <div className="product_iten_list">

                      <List
                        itemLayout="horizontal"
                        dataSource={orderData?.retRepUserOrderProductInfo}

                        renderItem={(item) => (
                          <>

                            <List.Item
                              actions={[
                                <div className="return_img">
                                  <span>User {orderData?.type === "RETURN" ? "Return" : "Replacement"} Image :</span>
                                  <Image src={item.returnUserOrderProductImage} width={50} height={50} />
                                </div>
                                , <span><b>₹ {item.returnUserOrderOfferProductId ? item?.returnUserOrderProductId?.requiredOfferedBillingPrice : item?.returnUserOrderProductId?.bkdAmount}</b></span>
                              ]}
                            >
                              <List.Item.Meta

                                avatar={item?.returnUserOrderProductId?.imageUrl != null ? <Image src={item?.returnUserOrderProductId?.imageUrl} className="order_images" width={50} /> : <Avatar size={50} shape="square" src={DefaulImg} className="order_images" />}
                                title={<p><span>{item?.returnUserOrderProductId?.productName} </span>{item?.returnUserOrderProductId?.isRefridgerator ? <Tag icon={<HiOutlineShoppingBag className="bags" />} color="blue" bordered={false}> Frozen</Tag> : <Tag icon={<HiOutlineShoppingBag className="bags" />} bordered={false}> Normal</Tag>}</p>}
                                description={<div>
                                  <Space>
                                    <p>{item?.returnUserOrderProductId?.packSize}</p>
                                    <p>Qty. {item?.returnUserOrderProductId?.quantity}</p>
                                  </Space>


                                  <div className="show_offer_product">

                                    {item?.returnUserOrderOfferProductId != null ? <List.Item
                                      actions={[<span><del>₹ {item?.returnUserOrderProductId?.mrpPrice}</del></span>, <b><span className="offer_product">Free</span> </b>]}
                                    >
                                      <List.Item.Meta
                                        avatar={item.returnUserOrderOfferProductId.imageUrl != null ? <Image src={item.returnUserOrderOfferProductId.imageUrl} className="order_images" width={50} /> : <Avatar size={50} shape="square" src={DefaulImg} className="order_images" />}
                                        title={<span>{item.returnUserOrderOfferProductId.productName}</span>}
                                        description={<div>
                                          <Space>
                                            <p>{item.returnUserOrderOfferProductId.packSize}</p>
                                            <p>Qty. {item.returnUserOrderOfferProductId.quantity}</p>
                                          </Space>

                                        </div>}
                                      />
                                    </List.Item> : null}
                                  </div>
                                </div>}
                              />
                            </List.Item>
                          </>
                        )}
                      />
                    </div>
                  </Card>

                  <Descriptions bordered layout="vertical">
                    <Descriptions.Item label="Alternative  Name">
                      {orderData
                        ?.alternativeCustomerName != null ? orderData
                        ?.alternativeCustomerName : "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Alternative Mobile">
                      {orderData
                        ?.alternativeMobileNo != null ? orderData
                        ?.alternativeMobileNo : "N/A"}
                    </Descriptions.Item>


                    <Descriptions.Item label="Order Code">
                      {orderData?.orderCode}
                    </Descriptions.Item>

                    <Descriptions.Item label=" Delivery Date">
                      {orderData?.timeSlotDate}
                    </Descriptions.Item>
                    <Descriptions.Item label=" Delivery Slot">
                      {orderData?.timeSlotFrom}-{orderData?.timeSlotTo}
                    </Descriptions.Item>
                    <Descriptions.Item label="Branch Code">
                      {orderData?.userOrderId?.branchCode}
                    </Descriptions.Item>
                    <Descriptions.Item label="Branch Alias">
                      {orderData?.branchId?.branchAlias}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Status">
                      <Tag color={orderData?.isPaymentDone != true ? "#387ADF" : "#7ABA78"}>
                        {orderData?.isPaymentDone != true ? "Pending" : "Done"}
                      </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="User Payment Mode">
                      <Tag color={orderData?.userOrderId?.paymentMode != "COD" ? "#7ABA78" : "#F57D1F"}>
                        {orderData?.userOrderId?.paymentMode}
                      </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Status">
                      <Tag key={orderData?._id} color={getStatusColor(orderData?.status)}>{orderData?.status}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Refund Amount">
                      <b>₹ {orderData?.returnAmount != null ? orderData?.returnAmount.toFixed(2) : "0.0"}</b>
                    </Descriptions.Item>
                    <Descriptions.Item label="Order Type">
                      <Tag color={orderData?.type !== "RETURN" ? "#387ADF" : "#FFA24C"}>
                        {orderData?.type}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                  <div className="show_transition_list">
                    <Card title="Transaction History" bordered={false}>
                      {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={columns} dataSource={orderData?.userPaymentInfo} scroll={{ x: true }} pagination={false}
                      />}
                    </Card>
                  </div>
                  <div className="show_transition_list">
                    <Card title="Order Status Action" bordered={false}>
                      {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={Statuscolumns} dataSource={orderData?.orderStatusDetails} scroll={{ x: true }} pagination={false}
                      />}
                    </Card>
                  </div>

                </Col>
                <Col md={3}>

                  <div className="user_vendor">

                    <h6>User Details</h6>
                    <Card size="small"
                      onClick={() => navigate(`/dashboard/user-details/${orderData?.userId?._id}`)}
                      cover={
                        <img
                          className="order_order_img"
                          alt="example"
                          src={orderData?.userId?.profilePic != null ? orderData?.userId?.profilePic : DefaultImg}
                        />
                      }

                    >
                      <Card.Meta
                        title={<div>
                          <p>{orderData?.userId?.fullName}</p>
                        </div>}
                        description={<div>
                          <p>Number : {orderData?.userId?.mobileNo}</p>
                          <p>Email : {orderData?.userId?.email}</p>
                          <p>Gender : {orderData?.userId?.gender}</p>
                          <p>DOB : {orderData?.userId?.dob}</p>
                        </div>}
                      />
                    </Card>
                    <h6>Delivery Partner Details</h6>
                    {orderData?.vendorId != null ? <Card size="small"
                     
                      cover={
                        <img
                          className="order_order_img"
                          alt="example"
                          src={orderData?.vendorId?.profilePic != null ? orderData?.vendorId?.profilePic : DefaultImg}
                        />
                      }

                    >
                      <Card.Meta
                        title={<div>
                          <p>{orderData?.vendorId?.fullName}</p>
                        </div>}
                        description={<div>
                          <p>Number : {orderData?.vendorId?.mobileNo}</p>
                          <p>Gender : {orderData?.vendorId?.gender}</p>
                          <p>DOB : {orderData?.vendorId?.dob}</p>
                          <p>Email : {orderData?.vendorId?.city}</p>
                        </div>}
                      />
                    </Card> : <Card >
                      <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"

                        description={
                          <Typography.Text>
                            Delivery Partner Not Assign
                          </Typography.Text>
                        }
                      >
                      </Empty>
                    </Card>


                    }
                  </div>
                  {orderData?.vendorReturnImages?.length != 0 ?
                    <div className="delivered_Image">
                      <Card

                        cover={orderData?.vendorReturnImages?.length != 0 ? <Image.PreviewGroup
                          items={orderData?.vendorReturnImages || []}
                        >
                          <Image
                            height={200}
                            src={orderData?.vendorReturnImages[0]}
                          />
                        </Image.PreviewGroup> : <Image
                          // width={200}
                          src={DefaultImage}
                        />}
                      >
                        <Card.Meta
                          title=" Return Delivered Image"
                        />
                      </Card>


                    </div> : null}
                  {orderData?.vendorReplacementImages?.length != 0 ?
                    <div className="delivered_Image">
                      <Card

                        cover={orderData?.vendorReplacementImages?.length != 0 ? <Image.PreviewGroup
                          items={orderData?.vendorReplacementImages || []}
                        >
                          <Image
                            height={200}
                            src={orderData?.vendorReplacementImages[0]}
                          />
                        </Image.PreviewGroup> : <Image
                          // width={200}
                          src={DefaultImage}
                        />}
                      >
                        <Card.Meta
                          title=" Replacement Delivered Image"
                        />
                      </Card>


                    </div> : null}
                </Col>

              </Row>




            </div>}
        </div>


      </div>

    </section>
  );
}






export default ReturnReplaceDetails