import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Dropdown, Pagination, Popover, Space, Switch, Typography, message } from "antd";
import { Table, Tag } from 'antd';
import { DeleteCoupon, Discount, fetchCoupontList, Status, updateStatusCoupon } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";
import AddNewCoupon from "./AddNewCoupon";
import moment from "moment";
import { CloseOutlined, EditFilled, MoreOutlined } from '@ant-design/icons';
import DeleteModal from "../../../kit/DeleteModal/DeleteModal";

const { Title, Text } = Typography;

function CoupontList() {
    const { token, logout } = useAuth()
    const [current, setCurrent] = useState(1)
    const [totalPage, setTotalPage] = useState([])
    const [couponData, setCouponData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [selectedCoupon, setSelectedCoupon] = useState()

    const onChange = (page) => {
        setCurrent(page);
        setIsLoading(true);
    };

    const toggleDeleteTaxDrawer = () => setShowDeleteDialog(!showDeleteDialog)

    const toggleDeleteAttributeDialog = (item) => {
        setSelectedCoupon(item)
        toggleDeleteTaxDrawer()
    }

    function DropdownItem(record) {
        return [
            {
                key: '1',
                icon: <CloseOutlined />,
                label: (
                    <span onClick={() => toggleDeleteAttributeDialog(record)}>
                        Delete
                    </span>
                ),
            },
            {
                key: '2',
                icon: <EditFilled />,
                label: (
                    <AddNewCoupon couponId={record?._id} ShowAllCouponList={ShowAllCouponList} />
                ),
            },
        ];
    }

    const columns = [
        {
            title: "Couponcode",
            dataIndex: "couponCode",
            key: "couponCode",
            render: (_, { couponCode }) => (
                <div className="dis_code">
                    <Button type="dashed">{couponCode}</Button>
                </div>
            ),
        },
        {
            title: "Type",
            dataIndex: "discountType",
            key: "discountType",
        },
        {
            title: "Value",
            dataIndex: "discountValue",
            key: "discountValue",
            render: (_, { discountType, discountValue }) => {
                if (discountType === Discount.DISCOUNT) {
                    return `${discountValue} %`;
                } else if (discountType === Discount.CASHBACK) {
                    return `₹ ${discountValue}`;
                } else {
                    return discountValue;
                }
            },
        },
        {
            title: "Eligible Customer",
            dataIndex: "eligibleCustomerType",
            key: "eligibleCustomerType",
            render: (_, { eligibleCustomerType }) => (
                <span>{eligibleCustomerType}</span>
            ),
            ellipsis: true,
        },
        {
            title: "Selected Customers",
            dataIndex: "users",
            key: "users",
            render: (_, { users }) => {
                const content = (
                    <div>
                        {users.map((user, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text strong>{user.fullName}</Text>
                                <Text style={{ marginLeft: '20px' }} type="secondary">{user.email}</Text>
                            </div>
                        ))}
                    </div>
                );

                return users.length !== 0 ? (
                    <Popover content={content} title="Users Details" trigger="hover" placement="top">
                        <Text style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                            {users.length}
                        </Text>
                    </Popover>
                ) : (
                    "-"
                )
            },
            ellipsis: true,
        },
        {
            title: "Valid From",
            dataIndex: "validFrom",
            key: "validFrom",
            render: (_, { validFrom }) => (
                <Tag color="green" bordered={false}>{moment(validFrom).format("DD/MM/YYYY")}</Tag>
            ),
        },
        {
            title: "Valid To",
            dataIndex: "validTo",
            key: "validTo",
            render: (_, { validTo }) => (
                <Tag color="red" bordered={false}>{moment(validTo).format("DD/MM/YYYY")}</Tag>
            ),
        },
        {
            title: "Min. Cart Amount",
            dataIndex: "minCartAmount",
            key: "minCartAmount",
            render: (_, { minCartAmount }) => (
                <span>₹ {minCartAmount}</span>
            ),
            ellipsis: true,
        },
        {
            title: "Usage Limit",
            dataIndex: "usageLimit",
            key: "usageLimit",
            render: (_, { usageLimit }) => (
                <span> {usageLimit || "N/A"}</span>
            ),
            ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status, record) => {
                return (
                    <Switch
                        size="small"
                        checked={status === Status.ACTIVE}
                        onChange={(checked) => handleToggle(record, checked)}
                    />
                );
            },
        },
        {
            title: 'Action',
            key: '_id',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Dropdown
                        trigger={["click"]}
                        menu={{
                            items: DropdownItem(record),

                        }}
                    >
                        <Button icon={<MoreOutlined />} shape="circle" />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const handleToggle = async (record, checked) => {
        const newStatus = checked ? Status.ACTIVE : Status.INACTIVE;

        try {
            await updateStatusCoupon({ status: newStatus }, record._id, token)
                .then((res) => {
                    if (res.status === 200) {
                        message.success(res.data.message);
                        ShowAllCouponList()
                    }
                })
                .catch((err) => {
                    message.error(err.message);
                });
        } catch (error) {
            message.error(error);
        }
    };

    const ShowAllCouponList = async () => {
        try {
            await fetchCoupontList(token, current)
                .then((res) => {
                    if (res.status == 200) {
                        setCouponData(res.data.data);
                        setTotalPage(res.data.data.totalPages);
                        setIsLoading(true)
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()
                    }
                })
                .catch((err) => {
                    message.error(err.message);
                });
        } catch (error) {
            message.error(error);
            setIsLoading(true)
        }
    };

    useEffect(() => {
        ShowAllCouponList()
    }, [current])

    const deleteCouponHandle = async () => {
        setIsDeleteLoading(true)
        try {
            await DeleteCoupon(selectedCoupon?._id, token)
                .then((res) => {
                    if (res?.data?.code === 200) {
                        message.success(res.data.message);
                        setIsDeleteLoading(false)
                        toggleDeleteTaxDrawer()
                        ShowAllCouponList();
                    }
                })
                .catch((err) => {
                    setIsDeleteLoading(false)
                    message.error(err.response.msg);
                });
        } catch (error) {
            message.error(error);
            setIsDeleteLoading(false)
        }
    };

    return (
        <>
            <section className="main_Section">
                <Breadcrumb
                    items={[
                        {
                            title: <a style={{ textDecoration: 'none' }} href="/dashboard">Dashboard</a>,
                        },
                        {
                            title: "Coupon",
                        },
                    ]}
                />
                <div className="content_title">
                    <div className="content_head">
                        <div className="content_title">
                            <Title level={4}>Coupon List</Title>
                        </div>
                        <div className="content_add">
                            <AddNewCoupon ShowAllCouponList={ShowAllCouponList} />
                        </div>
                    </div>
                    <div className="content">
                        <div className="shoo_recent_order">
                            {!isLoading ?
                                <div className="loader_main"><span class="loader2"></span></div>
                                :
                                <Table
                                    columns={columns}
                                    dataSource={couponData?.coupons}
                                    scroll={{ x: true }}
                                    pagination={false}
                                    footer={() =>
                                        <div className="pagination">
                                            <Pagination current={current} onChange={onChange} total={totalPage * 10} />
                                        </div>
                                    }
                                />
                            }
                        </div>
                    </div>
                </div>
            </section>

            {showDeleteDialog &&
                <DeleteModal
                    isOpen={showDeleteDialog}
                    onClose={toggleDeleteTaxDrawer}
                    onDelete={deleteCouponHandle}
                    item={selectedCoupon}
                    isBtnLoading={isDeleteLoading}
                    title='Coupon'
                />
            }
        </>
    );
}

export default CoupontList