import React, { useEffect, useState } from "react";
import { Alert, Avatar, Breadcrumb, Button, Card, Descriptions, Divider, Empty, Form, Image, Input, List, Modal, Select, Typography, message } from "antd";
import '../../style/product.css'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { Col, Row } from "react-bootstrap";
import { ActionOrderStatus, EditBranchOrder, fetchOrderDatails, OrderCacelByBranch, PartialReturnAction } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import DefaulImg from "../../assest/png/bkdlogo.png"
import DefaultImg from "../../assest/chat/user.png"
import { HiOutlineShoppingBag } from "react-icons/hi";
import { ExclamationCircleFilled } from "@ant-design/icons";

import { MdLocationPin, MdStorefront } from "react-icons/md";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import DefaultImage from "../../assest/png/defaut_img.jpg"
import { useDispatch, useSelector } from "react-redux";
import { addItem, fetchCartProducts, removeCartItem, selectCartItems } from "../../redux-toolkit/CartSlice";
import KotDetails from "./KotDetails";
import VendorAssignModel from "./VendorAssignModel";
import LogImng from "../../assest/png/logoIcon.png";

function OrderDetails() {
  const navigate = useNavigate()
  const { confirm } = Modal;
  const location = useLocation();
  const { token } = useAuth();
  const dispatch = useDispatch();
  const cartItem = useSelector(selectCartItems);
  const [orderData, setOrderData] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoveLoder, setIsRemoveLoder] = useState(false)
  const [isAcceptLoading, setISAcceptLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
    setIsLoading(true)
    try {
      await fetchOrderDatails(token, id)
        .then((res) => {
          console.log("order details", res)
          if (res.status == 200) {
            const ProductItem = res.data.data.productInfo;
            setOrderData(res.data.data);

            const productUnit = ProductItem.map((item) => ({
              ...item,
              unit: item.quantity,
              offerProduct: item.offerProduct
                ? {
                  ...item.offerProduct,
                  OfferQty: item.offerProduct.quantity,
                  billlingQty: item.quantity,
                }
                : null, // Keep offerProduct as it is if it doesn't exist
            }));

            dispatch(fetchCartProducts(productUnit));
            setIsLoading(false)
          }
        })
        .catch((err) => {
          console.log(err.message);
          setIsLoading(false)
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false)
    }
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
        return '#F95454';
      case 'CANCELLEDRETURN':
        return '#F87A53';
      case 'CLOSED':
        return '#C62E2E';
      default:
        return '#B3A398';
    }
  };

  useEffect(() => {
    showOrderDetials();
  }, []);

  const acceptOrder = async () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const gotoEditOrder = async () => {
    setIsEditModalOpen(true)
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const error = (id) => {
    let reason = null;

    const handleInputChange = (e) => {
      reason = e.target.value;
    };

    const handleOrderCancel = async () => {
      const body = {
        userOrderId: id,
        reason: reason,
      };
      if (!reason) {
        message.error("Reason is require !");
      } else {
        try {
          const res = await OrderCacelByBranch(body, token);
          if (res.status === 201) {
            message.success(res.data.message);
            setIsEditModalOpen(false);
            showOrderDetials();
            reason = "";
            return true;
          } else {
            message.error(res.data.message);
            return false;
          }
        } catch (error) {
          message.error(error.message);
          return false;
        }
      }
    };

    confirm({
      title: "Are you sure cancel this order?",
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
          <Input placeholder="Please Enter Cancel Reason" onChange={handleInputChange} />
        </Form.Item>
      ),
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        if (!reason) {
          message.error("Reason is required");
          // Prevent modal from closing if the reason is empty
          return Promise.reject();
        } else {
          return handleOrderCancel().then((shouldClose) => {
            if (!shouldClose) {
              // Prevent modal from closing if status is not 201
              return Promise.reject();
            }
          });
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItem));
  }, [cartItem]);

  const handleDelItem = (item) => {
    dispatch(removeCartItem(item));
    const cart = JSON.parse(localStorage.getItem("cart")) || []; // Retrieve cart from localStorage
    const updatedCart = cart.filter((cartItem) => cartItem.productCode !== item.productCode); // Filter out the item to be removed
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleAddItem = (item) => {
    dispatch(addItem(item));
  };

  const removeOrderHandler = async () => {
    const reviewRetuenItem = cartItem?.map((product) => {
      return {
        productCode: product.productCode,
        quantity: product.unit,
        _id: product?._id
      };
    }, []);

    setIsRemoveLoder(true);

    const body = {
      userOrderId: orderData?._id,
      removedBy: "BRANCH",
      cart: reviewRetuenItem,
      rePaymentMode: "",
    };

    try {
      const res = await PartialReturnAction(token, body);

      if (res && res.status === 201) {
        message.success(res.data.message);
        setIsEditModalOpen(false);
        showOrderDetials()
      } else {
        message.error(res?.message);
      }
    } catch (error) {
      message.error(error?.message);
    } finally {
      setIsRemoveLoder(false);
    }
  };

  const ChangeStatusHandler = async (id, vendorId, status) => {
    setISAcceptLoading(true)
    const body = {
      userOrderId: id,
      // status: status
    };
    if (orderData?.deliveryOption === "DELIVERY" && status === "ACCEPTED" && vendorId === null) {
      message.warning("Please  Assign Vendor ");
    } else {
      try {
        await ActionOrderStatus(body, token)
          .then((res) => {
            console.log("action order status", res);
            if (res.data.code == 201) {
              message.success(res.data.message);
              showOrderDetials();
              setIsModalOpen(false)
              setIsEditModalOpen(false)
              setISAcceptLoading(false)
            } else if (res.data.code == 200) {
              message.warning(res.data.message);
              setISAcceptLoading(false)
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } catch (error) {
        message.error(error.message);
        setISAcceptLoading(false)
      }
    }
  };

  const assingVendorAction = (items) => {
    const isVendorEmpty = !items?.vendorId || (typeof items.vendorId === "object" && Object.keys(items.vendorId).length === 0);
    let assingVendor;

    if (isVendorEmpty) {
      assingVendor =
        <VendorAssignModel
          title="Vendor Assign"
          ShowOrderList={showOrderDetials}
          deliveryType={items.deliveryOption}
          orderId={items._id}
          status={items._id}
        />
    } else {
      assingVendor = <Button disabled type="primary" shape="round"> Vendor Assigned</Button>
    }
    return assingVendor
  }

  return (
    <>
      <section className="main_Section">
        <Breadcrumb style={{ marginBottom: '8px' }}
          items={[
            {
              title: "Dashboard",
            },
            {
              title: location.pathname,
            },
          ]}
        />

        <div className="content_head">
          <div className="order_content_title">
            <Card>
              <div className="order_status_titiles">
                <div className="order_title">
                  <Space style={{ alignItems: 'start' }}>
                    <Button type="circle" onClick={() => navigate(-1)}> <MdOutlineKeyboardBackspace className="back_icon" /></Button>
                    <Title level={4} style={{ marginBottom: 0 }}>Order Details </Title>
                  </Space>
                </div>
                <Space>
                  {!isLoading &&
                    orderData?.status !== "DISPATCHED" &&
                    orderData?.status !== "CLOSED" &&
                    orderData?.status !== "DELIVERD" && (
                      <Button
                        danger
                        shape="round"
                        onClick={() => error(id)}
                      >
                        Cancel Order
                      </Button>
                    )}
                  {!isLoading &&
                    (orderData?.status === 'PENDING' ? (
                      <Button
                        success
                        type="primary"
                        shape="round"
                        loading={isAcceptLoading}
                        onClick={acceptOrder}
                      >
                        Accept Order
                      </Button>
                    ) : (
                      assingVendorAction(orderData)
                    ))
                  }
                </Space>
              </div>
            </Card>
          </div>
        </div>

        {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
          <Row>
            <Col md={8} style={{ paddingRight: '7px' }}>
              <div className="order_details">
                <div className="order_details_title">
                  <div className="order_del_img">
                    <img src={LogImng} />
                    <div className="order_detials_id">
                      <p>{orderData?.orderCode} </p>
                      <p>Placed on : {orderData?.addedDate}</p>
                      <Tag key={orderData?._id} color={getStatusColor(orderData?.status)}>{orderData?.status}</Tag>
                    </div>
                  </div>
                  {orderData?.status !== 'PENDING' &&
                    <div className="order_title_actions">
                      <KotDetails orderId={id} />
                      {orderData?.status !== "DISPATCHED" &&
                        orderData?.status !== "CLOSED" &&
                        orderData?.status !== "DELIVERD" &&
                        <Button
                          success
                          type="primary"
                          shape="round"
                          onClick={() => gotoEditOrder()}
                        >
                          Edit Order
                        </Button>
                      }
                    </div>
                  }
                </div>

                <Divider style={{ margin: '10px 0' }} />

                <Row>
                  <Col md={6}>
                    <div className="location_box">
                      <div className="location_header">
                        <MdStorefront className="delivery_icons" />
                        <p>Pick-up Location</p>
                      </div>

                      <Descriptions column={1} className="location_column">
                        <Descriptions.Item label="Branch Name">
                          {orderData?.branchId?.branchName || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Full Address">
                          {orderData?.branchId?.fullAddress || "N/A"}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  </Col>

                  {orderData?.deliveryOption !== "PICKUP" && (
                    <Col md={6}>
                      <div className="location_box">
                        <div className="location_header">
                          <MdLocationPin className="delivery_icons" />
                          <p>Delivery Location</p>
                        </div>

                        <Descriptions column={1} className="location_column">
                          <Descriptions.Item label="Address Type">
                            {orderData?.userLocationId?.addressType || "N/A"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Full Address">
                            {orderData?.userLocationId?.fullAddress || "N/A"}
                          </Descriptions.Item>
                        </Descriptions>
                      </div>
                    </Col>
                  )}
                </Row>

                <Divider style={{ margin: '10px 0' }} />

                <Card
                  // bordered={false}
                  style={{ margin: '10px' }}
                  title={
                    <div className="product_order_item">
                      <p>No. of Item {orderData?.productInfo?.length}</p>
                      <Space>
                        <p>{orderData?.isPoolOrder ? <Tag color="blue" bordered={false}>POOL ORDER</Tag> : null}</p>
                        {/* <ReturnOrderSendBranch /> */}
                      </Space>
                    </div>
                  }
                >
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

                <Descriptions bordered layout="vertical" style={{ margin: '10px' }}>
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
                <div className="show_transition_list" style={{ margin: '10px' }}>
                  <Card
                    title="Transaction History"
                  // bordered={false}
                  >
                    {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={columns} dataSource={orderData?.userPaymentInfo} scroll={{ x: true }} pagination={false}
                    />}
                  </Card>
                </div>
                <div className="show_transition_list" style={{ margin: '10px' }}>
                  <Card
                    title="Order Status Action"
                    // bordered={false}
                  >
                    {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={Statuscolumns} dataSource={orderData?.statusDetails} scroll={{ x: true }} pagination={false}
                    />}
                  </Card>
                </div>
              </div>
            </Col>
            <Col md={4} style={{ paddingLeft: '7px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Card size="small" title=" Payment Details" style={{ backgroundColor: '#ecf3fe' }}>
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
                  <p>
                    {/* {orderData?.deliveryCharge != 0 ? "₹" : null} {orderData?.deliveryCharge != 0 ? orderData?.deliveryCharge.toFixed(2) : <span className="offer_product">Free</span>} */}
                    {Number(orderData?.deliveryCharge) > 0 ? (
                      <>₹ {Number(orderData?.deliveryCharge).toFixed(2)}</>
                    ) : (
                      <span className="offer_product">Free</span>
                    )}
                  </p>
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
                    type="success"
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
                      style={{ objectFit: 'contain' }}
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
              </div>

              {orderData?.deliveryOption != "PICKUP" ? <div className="show_delivery_partner">
                <h6>Delivery Partner Details</h6>
                {orderData?.vendorId ? <Card
                  size="small"
                  cover={
                    <img
                      className="order_order_img"
                      style={{ objectFit: 'contain' }}
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
                </Card>
                  :
                  <Card>
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

              {orderData?.deliveryOption != "PICKUP" ?
                <div className="delivered_Image">
                  <Card
                    cover={orderData?.deliveredImage?.length != 0 ? <Image.PreviewGroup
                      items={orderData?.deliveredImage || []}
                    >
                      <Image
                        height={200}
                        src={orderData?.deliveredImage?.[0]}
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
        }
      </section>

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        style={{ top: 20 }}
        loading={isLoading}
        footer={false}
        title="Order Confirmation"
      >
        <div style={{ textAlign: "center", padding: "10px 0" }}>

          <h4 style={{ marginBottom: 10 }}>
            Are you sure you want to accept this order?
          </h4>

          <p style={{ color: "#888", marginBottom: 25 }}>
            Once accepted, the order will move to the next processing stage.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Button
              shape="round"
              onClick={handleCancel}
            >
              No
            </Button>
            <Button
              type="primary"
              shape="round"
              loading={isAcceptLoading}
              onClick={() => ChangeStatusHandler(id, orderData?.vendorId, "ACCEPTED")}
            >
              Yes, Accept
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        style={{ top: 20 }}
        loading={isLoading}
        footer={
          <div style={{ display: 'flex', justifyContent: "end", gap: '6px' }}>
            <Button
              type="primary"
              loading={isAcceptLoading}
              onClick={() => ChangeStatusHandler(id, orderData?.vendorId, "ORDERPACKED")}
              disabled={orderData?.status !== "ACCEPTED"}
            >
              Packed
            </Button>
            <Button
              type="primary"
              loading={isRemoveLoder}
              onClick={removeOrderHandler}
            >
              Update
            </Button>
          </div>
        }
        title="Update Order"
        width={1000}
      >
        <div style={{ paddingTop: "15px" }}>
          <List
            itemLayout="horizontal"
            dataSource={cartItem}
            renderItem={(item) => {
              return (
                <List.Item
                  className={item.status === "REMOVED" || item.unit === 0 ? "remove_items_select" : ""}
                  actions={orderData.status === "DISPATCHED" || orderData.status === "REACHED" || orderData.status === "DELIVERD" || orderData.status === "PARTIALDELIVERED" || orderData.status === "CANCELLED" || orderData.status === "CANCELLEDRETURN" || orderData.status === "CLOSED" ? null : [
                    <Space>
                      {item.status === "REMOVED" || item.status === "RETURN" || item.status === "REPLACE" ? <Tag>{item.status}</Tag> : null}

                      {cartItem.map((cartItem) => {
                        if (cartItem.productCode === item.productCode) {
                          return (
                            <Button.Group key={cartItem.productCode}>
                              <Button type="primary" disabled={cartItem.unit === 0} onClick={() => handleDelItem(item)}>
                                -
                              </Button>
                              <Button type="primary">
                                {cartItem.unit}
                              </Button>{" "}
                              {/* Access unit from cart item */}
                              <Button type="primary" onClick={() => handleAddItem(item)}>
                                +
                              </Button>
                            </Button.Group>
                          );
                        }
                        return null;
                      })}
                    </Space>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={item.imageUrl ? <Image src={item.imageUrl} className="order_images" width={50} /> : <Avatar size={50} shape="square" src={DefaulImg} className="order_images" />}
                    title={
                      <p>
                        <span>{item.productName} </span>
                        {item.isRefridgerator ? (
                          <Tag icon={<HiOutlineShoppingBag className="bags" />} color="blue" bordered={false}>
                            Frozen
                          </Tag>
                        ) : (
                          <Tag icon={<HiOutlineShoppingBag className="bags" />} bordered={false}>
                            Normal
                          </Tag>
                        )}
                      </p>
                    }
                    description={
                      <div>
                        <Space>
                          <p>{item.packSize}</p>
                          <p>Qty. {item.quantity} .</p>

                          <strong>₹ {item.offerProduct ? item.requiredOfferedBillingPrice : item.bkdAmount}</strong>

                        </Space>
                        <div className="show_replacement">
                          <Space>
                            {/* <del>₹{item.mrpPrice}</del> */}
                          </Space>
                          <Space>
                            <Alert banner message="Returnable" type={!item.nonReturnable ? "success" : "error"} showIcon />
                            <Alert banner message="Replaceable" type={!item.nonReplaceable ? "success" : "error"} showIcon />
                          </Space>
                        </div>
                        <div className="show_offer_product">
                          {item.offerProduct && (
                            <List.Item
                              actions={[
                                <span>
                                  <del>₹ {item.offerProduct.mrpPrice}</del>
                                </span>,
                                item.offerProduct.productPrice === 0 && <span className="offer_product">Free</span>,
                              ]}
                            >
                              <List.Item.Meta
                                avatar={
                                  item.offerProduct.imageUrl ? (
                                    <Image src={item.offerProduct.imageUrl} className="order_images" width={50} />
                                  ) : (
                                    <Avatar size={50} shape="square" src={DefaulImg} className="order_images" />
                                  )
                                }
                                title={<span>{item.offerProduct.productName}</span>}
                                description={
                                  <Space>
                                    <p>{item.offerProduct.packSize}</p>
                                    <p>Qty. {item.offerProduct.OfferQty}</p>
                                  </Space>
                                }
                              />
                            </List.Item>
                          )}
                        </div>
                      </div>
                    }
                  />
                  <b>₹ {item.offerProduct ? item.requiredOfferedBillingPrice : item.bkdAmount}</b>
                </List.Item>
              );
            }}
          />
        </div>
        <hr />
      </Modal>
    </>
  );
}

export default OrderDetails