import React, { useEffect, useState } from "react";
import { Alert, Avatar, Breadcrumb, Button, Card, Descriptions, Divider, Empty, Image, List, Typography, message } from "antd";
import '../../style/product.css'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { Col, Row } from "react-bootstrap";
import { EditBranchOrder, fetchOrderDatails } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import DefaulImg from "../../assest/png/bkdlogo.png"
import DefaultImg from "../../assest/chat/user.png"
import { HiOutlineShoppingBag } from "react-icons/hi";

import { MdLocationPin, MdStorefront } from "react-icons/md";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import DefaultImage from "../../assest/png/defaut_img.jpg"


function OrderDetails() {
  const navigate = useNavigate()
  const location = useLocation();
  const { token } = useAuth();
  const [orderData, setOrderData] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setISEdit] = useState(false)
  const { id } = useParams()
  const { Title } = Typography;

  const columns = [
    {
      title: 'Pay Action',
      dataIndex: 'actionOn',
      key: 'actionOn',
      render: actionOn => (
        <Space>
          {actionOn === "ORDER" ? <Button className="credit" shape="circle" icon={<FiArrowDownLeft className="debit_icons" />}></Button> : <Button className="debit" shape="circle" icon={<FiArrowUpRight className="debit_icons" />}></Button>}
          <Tag bordered={false} color={actionOn != "ORDER" ? "red" : "green"}>{actionOn}</Tag>
        </Space>
      )
    },

    {
      title: 'Payment Date',
      dataIndex: 'paidDateTime',
      key: 'paidDateTime',
      render: (paidDateTime) => (<span>{paidDateTime != null ? paidDateTime : "N/A"}</span>)
    },
    {
      title: 'Payment Mode',
      dataIndex: 'paymentMode',
      key: 'paymentMode',

    },
    {
      title: 'Amount',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      render: (amountPaid) => (<span>₹{amountPaid}</span>)

    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <Space>
          <Tag color={status === "SUCCESS" ? "#059212" : "blue"}>{status}</Tag>
        </Space>
      )

    },
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
      title: 'Action Data',
      dataIndex: 'addedDate',
      key: 'addedDate',

    },
    {
      title: 'Action Time',
      dataIndex: 'addedTime',
      key: 'addedTime',
    },
    {
      title: 'Action By',
      dataIndex: 'addedVia',
      key: 'addedVia',
    },
  ];

  const showOrderDetials = async () => {
    try {
      await fetchOrderDatails(token, id)
        .then((res) => {
          console.log("order details", res)
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
    showOrderDetials();
  }, []);

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
        return '#F95454';
      case 'CANCELLEDRETURN':
        return '#F87A53';
      case 'CLOSED':
        return '#C62E2E';
      default:
        return '#B3A398';
    }
  };

  const gotoEditOrder = async () => {
    setISEdit(true)
    const body = {
      orderId: orderData?._id,
      branchCode: orderData?.branchCode
    }
    try {
      await EditBranchOrder(token, body)
        .then((res) => {
          console.log("edit order", res)
          if (res.status == 200) {

            const branchUrl = res.data.data.redirecturl
            console.log("branchUrl", branchUrl)
            setISEdit(false)
            // if (branchUrl) {
            //   window.location.href = branchUrl;
            // }
            if (branchUrl) {
              window.open(branchUrl, '_blank');
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
          setISEdit(false)

        });
    } catch (error) {
      console.log(error);
      setISEdit(false)
    }
  };

  useEffect(() => {
    showOrderDetials();
  }, []);

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
            <Space>
              <Button type="circle" onClick={() => navigate(-1)}> <MdOutlineKeyboardBackspace className="back_icon" /></Button>
              <Title level={4}>Order Details </Title>
            </Space>
            <Button danger type="primary" shape="round" loading={isEdit} onClick={() => gotoEditOrder()}>Edit Order</Button>
          </div>
        </div>
        <div className="content">
          {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
            <div className="order_particuler">
              {orderData?.reasonStatusDetails?.reason ? <Alert className="my-2"
                type="error"
                banner
                message={`Cancel Reason :  ${orderData?.reasonStatusDetails?.reason}`}
              /> : null}
              <Row>
                <Col md={6}>
                  <Card bordered={false} title={<Space>
                    <MdStorefront className="delivery_icons" />
                    <p>Pick-up  Location</p>
                  </Space>}>
                    <Descriptions >
                      {/* <Descriptions.Item span={3} label="Branch Code">
                        {orderData?.branchId?.branchCode}
                      </Descriptions.Item> */}
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
                        {orderData?.userLocationId?.fullAddress}
                      </Descriptions.Item>


                    </Descriptions>
                  </Card>
                </Col> : null}
              </Row>
              <Row>
                <Col sm={7} lg={8} xxl={10}>
                  <Card bordered={false} title={
                    <div className="product_order_item">
                      <p>No. of Item {orderData?.productInfo?.length}</p>
                      <Space>

                        <p>{orderData?.isPoolOrder ? <Tag color="blue" bordered={false}>POOL ORDER</Tag> : null}</p>
                        {/* <ReturnOrderSendBranch /> */}
                      </Space>
                    </div>
                  }>
                    <div className="product_iten_list">

                      <List
                        itemLayout="horizontal"
                        dataSource={orderData?.productInfo}
                        renderItem={(item) => (
                          <>

                            <List.Item
                              actions={[
                                item.status === "REMOVED" || item.status === "RETURN" || item.status === "REPLACE" ? <Tag color={item.status === "RETURN" ? "orange" : item.status === "REMOVED" ? "red" : "blue"}>{item.status}</Tag> : null, <span><b>₹ {item.offerProduct ? item.requiredOfferedBillingPrice : item.bkdAmount}</b></span>
                              ]}
                            >
                              <List.Item.Meta

                                avatar={item.imageUrl != null ? <Image src={item.imageUrl} className="order_images" width={50} height={50} /> : <Avatar size={50} height={50} shape="square" src={DefaulImg} className="order_images" />}
                                title={<p><span>{item.productName} </span>{item.isRefridgerator ? <Tag icon={<HiOutlineShoppingBag className="bags" />} color="blue" bordered={false}> Frozen</Tag> : <Tag icon={<HiOutlineShoppingBag className="bags" />} bordered={false}> Normal</Tag>}</p>}
                                description={<div>
                                  <Space>
                                    <p>{item.packSize}</p>
                                    <p>Qty. {item.quantity}</p>
                                  </Space>
                                  <div className="show_replacement">

                                    <Space>
                                      <Alert banner message="Return" type={!item.nonReturnable ? "success" : "error"} showIcon />
                                      <Alert banner message="Replace" type={!item.nonReplaceable ? "success" : "error"} showIcon />


                                    </Space>
                                  </div>

                                  <div className="show_offer_product">

                                    {item.offerProduct != null ? <List.Item
                                      actions={[<span><del>₹ {item.offerProduct.mrpPrice}</del></span>, <span><b> {item.offerProduct.productPrice === 0 ? <span className="offer_product">Free</span> : null}</b></span>]}
                                    >
                                      <List.Item.Meta
                                        avatar={item.offerProduct.imageUrl != null ? <Image src={item.offerProduct.imageUrl} className="order_images" width={50} height={50} /> : <Avatar size={50} height={50} shape="square" src={DefaulImg} className="order_images" />}
                                        title={<span>{item.offerProduct.productName}</span>}
                                        description={<div>
                                          <Space>
                                            <p>{item.offerProduct.packSize}</p>
                                            <p>Qty. {item.offerProduct.quantity}</p>
                                          </Space>

                                        </div>}
                                      />

                                    </List.Item> : null}
                                  </div>
                                </div>}
                              />
                              <Space>
                                {/* <Tag key={item?._id} color={getStatusColor(item?.status)}>{item?.status}</Tag> */}
                                {/* <ViewReturnReplace /> */}
                              </Space>
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
                    {/* <Descriptions.Item label="Customer Name">
                      {orderData?.alternativeCustomerName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Customer Mobile">
                      {orderData?.alternativeMobileNo}
                    </Descriptions.Item> */}

                    <Descriptions.Item label="Order Code">
                      {orderData?.orderCode}
                    </Descriptions.Item>
                    <Descriptions.Item label=" Place Date">
                      {orderData?.addedDate},{orderData?.addedTime}
                    </Descriptions.Item>
                    <Descriptions.Item label=" Delivery Date">
                      {orderData?.deliveryDate}
                    </Descriptions.Item>
                    <Descriptions.Item label=" Delivery Slot">
                      {orderData?.timeSlotFrom}-{orderData?.timeSlotTo}
                    </Descriptions.Item>
                    <Descriptions.Item label="Branch Code">
                      {orderData?.branchCode}
                    </Descriptions.Item>
                    <Descriptions.Item label="Branch Alias">
                      {orderData?.branchId?.branchAlias}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Status">
                      <Tag color={orderData?.isPaymentDone != true ? "#387ADF" : "#7ABA78"}>
                        {orderData?.isPaymentDone != true ? "Pending" : "Done"}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Delivery Type">
                      <Tag color={orderData?.deliveryOption != "DELIVERY" ? "#387ADF" : "#7ABA78"}>
                        {orderData?.deliveryOption}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Mode">
                      <Tag color={orderData?.paymentMode != "COD" ? "#7ABA78" : "#F57D1F"}>
                        {orderData?.paymentMode}
                      </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Status">
                      <Tag key={orderData?._id} color={getStatusColor(orderData?.status)}>{orderData?.status}</Tag>
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="Transaction Id">
                      {orderData?.transactionId != null ? orderData?.transactionId : <span>N/A</span>}
                    </Descriptions.Item> */}
                  </Descriptions>
                  <div className="show_transition_list">
                    <Card title="Transaction History" bordered={false}>
                      {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={columns} dataSource={orderData?.userPaymentInfo} scroll={{ x: true }} pagination={false}
                      />}
                    </Card>
                  </div>
                  <div className="show_transition_list">
                    <Card title="Order Status Action" bordered={false}>
                      {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={Statuscolumns} dataSource={orderData?.statusDetails} scroll={{ x: true }} pagination={false}
                      />}
                    </Card>
                  </div>

                </Col>
                <Col sm={5} lg={4} xxl={2}>
                  <Card size="small" bordered={false} title=" Payment Details">
                    <div className="amount_item">
                      <p><b>MRP Total Amount  </b></p>
                      <p><b>₹ {orderData?.mrpTotalProductAmount != null ? orderData?.mrpTotalProductAmount.toFixed(2) : "0.0"}</b></p>
                    </div>
                    <div className="amount_item">
                      <p><b> Total Amount  </b></p>
                      <p><b>₹ {orderData?.totalProductAmount != null ? orderData?.totalProductAmount.toFixed(2) : "0.0"}</b></p>
                    </div>
                    {orderData?.discountId != null ? <div className="amount_item">
                      <p>Discount  {orderData?.discountType != "FLAT" ? <span>({orderData?.discountValue}%)</span> : <span>(₹{orderData?.discountValue})</span>}</p>
                      <p>₹ {orderData?.discountValue != null ? orderData?.discountValue.toFixed(2) : "0.0"}</p>
                    </div> : null}
                    <div className="amount_item">
                      <p>Delivery Charge  </p>
                      <p>{orderData?.deliveryCharge != 0 ? "₹" : null} {orderData?.deliveryCharge != 0 ? orderData?.deliveryCharge.toFixed(2) : <span className="offer_product">Free</span>}</p>
                    </div>

                    <Divider />
                    <div className="amount_item">
                      <p><b>Payable Amount  </b></p>
                      <p><b>₹ {orderData?.totalPayableAmount != null ? orderData?.totalPayableAmount.toFixed(2) : "0.0"}</b></p>
                    </div>
                    {/* <div className="amount_item">
                      <p><b>Return  Amount  </b></p>
                      <p><b>₹ {orderData?.totalPayableAmount != null ? orderData?.totalPayableAmount.toFixed(2) : "0.0"}</b></p>
                    </div> */}
                    <Divider dashed />
                    {orderData?.totalSaving != 0 ?
                      <Alert
                        type="info"
                        banner
                        message={`Saved amount on this Order ₹${orderData?.totalSaving?.toFixed(2)}`}
                      /> : null}
                  </Card>
                  <div className="user_vendor">

                    <h6>User Details</h6>
                    <Card size="small"
                      // onClick={() => navigate(`/dashboard/user-details/${orderData?.userId?._id}`)}
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
                          <p>Email : {orderData?.userId?.email ? orderData?.userId?.email : "N/A"}</p>
                          <p>Gender : {orderData?.userId?.gender ? orderData?.userId?.gender : "N/A"}</p>
                          <p>DOB : {orderData?.userId?.dob ? orderData?.userId?.dob : "N/A"}</p>
                        </div>}
                      />
                    </Card>
                    {orderData?.deliveryOption != "PICKUP" ? <div className="show_delivery_partner">
                      <h6>Delivery Partner Details</h6>
                      {orderData?.vendorId ? <Card size="small"
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
                          {/* <Button type="link">Delivery Partner Not Assign</Button> */}
                        </Empty>
                      </Card>
                      }
                    </div> : null}


                  </div>
                  {orderData?.deliveryOption != "PICKUP" ?
                    <div className="delivered_Image">
                      <Card

                        cover={orderData?.deliveredImage?.length != 0 ? <Image.PreviewGroup
                          items={orderData?.deliveredImage || []}
                        >
                          <Image
                            height={200}
                            src={orderData?.deliveredImage[0]}
                          />
                        </Image.PreviewGroup> : <Image
                          // width={200}
                          src={DefaultImage}
                        />}
                      >
                        <Card.Meta
                          title="Order Delivered Image"
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





export default OrderDetails