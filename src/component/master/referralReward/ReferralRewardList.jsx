import React, { useEffect, useState } from "react";
import { Badge, Breadcrumb, Button, Card, Popconfirm, Switch, Table, Tag, Typography, message } from "antd";
import { useLocation } from "react-router-dom";
import AddReferralReward from "./AddReferralReward";
import { fetchReferralRewardList, toggleReferralRewardStatus, deleteReferralReward } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";

const { Title } = Typography;

function ReferralRewardList() {
    const location = useLocation();
    const { token, logout } = useAuth();
    const [rewardData, setRewardData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const getFormattedDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const options = {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        return date.toLocaleDateString('en-IN', options);
    };

    const cancel = () => {
        message.error('Action cancelled');
    };

    const handleStatusToggle = async (rewardId, currentStatus) => {
        try {
            const body = {
                rewardId: rewardId,
                isActive: !currentStatus
            };

            const res = await toggleReferralRewardStatus(body, token);

            if (res.status === 200) {
                message.success(res.data.message);
                showAllReferralRewards();
            } else if (res.data.code === 283) {
                message.error(res.data.message);
                logout();
            }
        } catch (error) {
            console.error("Toggle status error:", error);
            message.error("Failed to update status");
        }
    };

    const handleDeleteReward = async (rewardId) => {
        try {
            const res = await deleteReferralReward(rewardId, token);

            if (res.status === 200 || res.status === 201) {
                message.success(res.data.message || "Referral reward deleted successfully!");
                showAllReferralRewards();
            } else if (res.data?.code === 283) {
                message.error(res.data.message);
                logout();
            }
        } catch (error) {
            console.error("Delete reward error:", error);
            message.error(error.response?.data?.message || "Failed to delete referral reward");
        }
    };

    const columns = [
        {
            title: "Reward Name",
            dataIndex: "rewardName",
            key: "rewardName",
            ellipsis: true,
        },
        {
            title: "Description",
            dataIndex: "rewardDescription",
            key: "rewardDescription",
            ellipsis: true,
        },
        {
            title: "Type",
            dataIndex: "rewardType",
            key: "rewardType",
            render: (type) => (
                <Tag color={type === "FREE_DELIVERIES" ? "blue" : "green"}>
                    {type === "FREE_DELIVERIES" ? "Free Deliveries" : "Discounts"}
                </Tag>
            ),
        },
        {
            title: "Reward Details",
            dataIndex: "rewardDetails",
            key: "rewardDetails",
            render: (_, record) => (
                <div>
                    {record.rewardType === "FREE_DELIVERIES" ? (
                        <span>{record.freeDeliveryCount} Free Deliveries</span>
                    ) : (
                        <span>{record.discountPercentage}% off (Min: ₹{record.minOrderAmount})</span>
                    )}
                </div>
            ),
        },
        {
            title: "Max Order Limit",
            dataIndex: "maxOrderLimit",
            key: "maxOrderLimit",
            render: (limit) => <span>{limit || "N/A"}</span>,
        },
        {
            title: "Referral Reward Count",
            dataIndex: "referralUserRewardCount",
            key: "referralUserRewardCount",
        },
        {
            title: "Expiry Date",
            dataIndex: "expiryDate",
            key: "expiryDate",
            render: (date) => (
                <Tag color="red" bordered={false}>
                    {getFormattedDate(date)}
                </Tag>
            ),
        },
        {
            title: "Expiry Days",
            dataIndex: "expiryDays",
            key: "expiryDays",
            render: (days) => <span>{days} days</span>,
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive) => (
                <Tag color={isActive ? "#A1DD70" : "#E72929"}>
                    {isActive ? "ACTIVE" : "INACTIVE"}
                </Tag>
            ),
        },
        {
            title: "Action",
            dataIndex: "_id",
            key: "_id",
            fixed: "right",
            width: 200,
            render: (_, record) => (
                <div className="action" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Switch
                        size="small"
                        checked={record.isActive}
                        onChange={() => handleStatusToggle(record._id, record.isActive)}
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                    />
                    <Popconfirm
                        title="Delete the Referral Reward"
                        description="Are you sure to delete this referral reward?"
                        onConfirm={() => handleDeleteReward(record._id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" shape="round" danger size="small">
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const showAllReferralRewards = async (page = 1, pageSize = 10) => {
        try {
            setIsLoading(false);
            const params = {
                currentPage: page,
                itemsPerPage: pageSize
            };

            const res = await fetchReferralRewardList(params, token);

            if (res.status === 200 || res.status === 304) {
                // Fix the data path - API returns res.data.data.data (nested data)
                const responseData = res.data?.data?.data;
                setRewardData(Array.isArray(responseData) ? responseData : []);
                setPagination({
                    current: page,
                    pageSize: pageSize,
                    total: res.data?.data?.totalRecord || 0  // Use totalRecord instead of totalItems
                });
                setIsLoading(true);
            } else if (res.data?.code === 283) {
                message.error(res.data.message);
                logout();
            }
        } catch (error) {
            console.error("Fetch rewards error:", error);
            // Set empty array on error to prevent table errors
            setRewardData([]);
            setIsLoading(true);
        }
    };

    useEffect(() => {
        showAllReferralRewards();
    }, []);

    const handleTableChange = (pagination) => {
        showAllReferralRewards(pagination.current, pagination.pageSize);
    };

    return (
        <section className="main_Section">
            <Breadcrumb
                items={[
                    {
                        title: "Dashboard",
                    },
                    {
                        title: "Offer and Discount",
                    },
                    {
                        title: "Referral Reward",
                    },
                ]}
            />
            <div className="content_title">
                <div className="content_head">
                    <div className="content_title">
                        <Title level={4}>Referral Reward List</Title>
                    </div>
                    <div className="content_add">
                        <AddReferralReward showAllReferralRewards={showAllReferralRewards} />
                    </div>
                </div>
                <div className="content">
                    <div className="shoo_recent_order">
                        {!isLoading ? (
                            <div className="loader_main">
                                <span className="loader2"></span>
                            </div>
                        ) : (
                            <Table
                                columns={columns}
                                dataSource={Array.isArray(rewardData) ? rewardData : []}
                                rowKey="_id"
                                scroll={{ x: true }}
                                pagination={{
                                    ...pagination,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} of ${total} items`,
                                }}
                                onChange={handleTableChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ReferralRewardList;