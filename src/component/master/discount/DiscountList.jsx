import React, { useEffect, useState } from "react";
import { Badge, Breadcrumb, Button, Card, Image, Popconfirm, Statistic, Typography, message } from "antd";
import { useLocation } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import AddNewDiscount from "./AddNewDiscount";
import { DeleteDisocunt, fetchDiscountList } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";
const { Title } = Typography;

function DiscountList() {
    const location = useLocation();
    const { token, logout } = useAuth()
    const [discountData, setDiscountData] = useState([])
    const [isLoading, setIsLoading] = useState(false)


    const getNewDate = (expiryDate) => {
        const expiryDates = new Date(expiryDate);
        const options = {
            timeZone: 'UTC', // Set the time zone to UTC to prevent conversion
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };

        const formattedDate = expiryDates.toLocaleDateString('en-IN', options);

        return formattedDate
    }

    const cancel = () => {
        message.error('You are select No')
    }
    const columns = [
        {
            title:
                "     Promocode"
            ,
            dataIndex: "discountCode",
            key: "discountCode",
            render: (_, { discountCode }) => (
                <div className="dis_code">
                    <Button type="dashed">{discountCode}</Button>
                </div>
            ),
        },
        {
            title:
                "   Name"
            ,
            dataIndex: "discountName",
            key: "discountName",
            ellipsis: true,

        },
        {
            title:
                "   Type"
            ,
            dataIndex: "discountType",
            key: "discountType",
        },
        {
            title:
                " Value"
            ,
            dataIndex: "discountValue",
            key: "discountValue",
            render: (_, { discountType, discountValue }) => (
                <>
                    {discountType == "PERCENTAGE"
                        ? `${discountValue} %`
                        : `₹ ${discountValue} `}{" "}
                </>
            ),
        },

        {
            title:
                "  Start Date"
            ,
            dataIndex: "startDate",
            key: "startDate",
            render: (_, { startDate }) => (
                <Tag color="green" bordered={false}>{startDate}</Tag>


            ),
        },
        {
            title:
                " Expire Date"
            ,
            dataIndex: "expiredDate",
            key: "expiredDate",
            render: (_, { expiredDate }) => (
                <Tag color="red" bordered={false}>{expiredDate}</Tag>

            ),
        },
        {
            title:
                " Min. Cart Amount"
            ,
            dataIndex: "minCartAmount",
            key: "minCartAmount",
            render: (_, { minCartAmount }) => (
                <span>₹ {minCartAmount}</span>

            ),
            ellipsis: true,

        },
        {
            title:
                " Usage Limit Per User"
            ,
            dataIndex: "usageLimitPerUser",
            key: "usageLimitPerUser",
            render: (_, { usageLimitPerUser }) => (
                <span> {usageLimitPerUser || "N/A"}</span>

            ),
            ellipsis: true,
        },
        {
            title: " Status"
            ,
            dataIndex: "status",
            key: "status",
            render: (_, { status }) => (
                <Tag color={status == "EXPIRED" ? "#E72929" : status === "ACTIVE" ? "#A1DD70" : "#3FA2F6"}>{status}</Tag>

            ),
        },
        {
            title: " Action"
            ,
            dataIndex: "_id",
            key: "_id",
            fixed: "right",
            render: (_, { _id }) => (
                <div className="action">
                    <Popconfirm
                        title="Delete the Discount"
                        description="Are you sure to delete this Discount?"
                        onConfirm={() => deleteDiscountHandle(_id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" shape="round" danger>Delete</Button>
                    </Popconfirm>



                </div>

            ),
        },
    ];

    const ShowAllDiscountList = async () => {
        try {
            await fetchDiscountList(token)
                .then((res) => {
                    console.log(" discount  list ", res);
                    if (res.status == 200) {
                        setDiscountData(res.data.data);
                        setIsLoading(true)
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()
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
        ShowAllDiscountList()
    }, [])

    const deleteDiscountHandle = async (id) => {
        try {
            let body = {
                discountId: id,
            };
            await DeleteDisocunt(body, token)
                .then((res) => {
                    console.log("delete discount ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        ShowAllDiscountList();
                    }
                })
                .catch((err) => {
                    console.log(err.response.msg);
                });
        } catch (error) {
            console.log(error);
            setIsLoading(true);
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
                        <Title level={4}>Discount List</Title>
                    </div>
                    <div className="content_add">
                        <AddNewDiscount ShowAllDiscountList={ShowAllDiscountList} />
                    </div>
                </div>
                <div className="content">
                    <div className="shoo_recent_order">
                        {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={columns} dataSource={discountData} scroll={{ x: true }} />}
                    </div>
                </div>


            </div>

        </section>
    );
}









export default DiscountList