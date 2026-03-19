import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Button, Card, Dropdown, Form, Image, Modal, Popconfirm, Select, Statistic, Switch, Typography, message } from "antd";
import '../../../style/master.css'
import { useLocation, useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { useAuth } from "../../../authentication/context/authContext";
import { CloseOutlined, EyeOutlined, MoreOutlined, EditOutlined, StarOutlined, LoadingOutlined } from '@ant-design/icons';

import { activeDeactiveSegment, deleteCustomSegment, fetchCustomSegment } from "../../../service/api_services";
import { Icons } from "../../../common/icons";
import AddNewSegment from "./AddNewSegment";
import DefaultImg from "../../../assest/icon/default-image.jpg"
import EditSegment from "./EditSegment";
import ProductListModal from "./ProductListModal";






function CustomSegment() {
    const location = useLocation();
    const navigate = useNavigate()
    const { token, logout } = useAuth()
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const [segmentList, setSegmentList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [segmentId, setSegmentId] = useState();
    const { Title } = Typography;


    function DropdownItem(_id, title, smallBanner, middleBanner, bigBanner, segmentNo) {
        return [
            {
                key: '1',
                icon: <EyeOutlined />,
                label: (
                    <span onClick={() => navigate(`/dashboard/segment-product/${_id}`, { state: { segmentNo } })}>
                        View Details
                    </span>
                ),
            },
            {
                key: '2',
                icon: <EditOutlined />,
                label: (
                    <EditSegment showAllCustomSegment={showAllCustomSegment} editData={{
                        title, smallBanner, middleBanner, bigBanner, segmentNo, _id
                    }} />
                ),
            },
            {
                key: '3',
                icon: <CloseOutlined />,
                label: (
                    <span onClick={() => deleteSegmentHandle(_id)} >Delete</span>
                ),

            },
        ];
    }
    const columns = [
        {
            title: 'Segment Image',
            dataIndex: 'smallBanner',
            key: 'smallBanner',
            ellipsis: true,

            render: (_, { smallBanner, middleBanner }) => (
                <div className="show_cat_img" >
                    {<Image
                        src={middleBanner || smallBanner ? middleBanner || smallBanner : DefaultImg}
                        onError={(e) => e.currentTarget.src = DefaultImg}
                        width={50}
                        height={50}
                        style={{ borderRadius: "8px", objectFit: "contain", }}
                    />
                    }
                </div>
            )
        },
        {
            title: 'Banner Image',
            dataIndex: 'bigBanner',
            key: 'bigBanner',
            ellipsis: true,

            render: (_, { bigBanner }) => (
                <div className="show_cat_img" >
                    {<Image
                        src={bigBanner ? bigBanner : DefaultImg}
                        onError={(e) => e.currentTarget.src = DefaultImg}
                        width={50}
                        height={50}
                        style={{ borderRadius: "8px", objectFit: "contain", }}
                    />
                    }

                </div>
            )
        },
        {
            title: ' Title',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,

            render: title => <strong>{title}</strong>

        },
        {
            title: 'Segment No.',
            dataIndex: 'segmentNo',
            key: 'segmentNo',
            ellipsis: true,



        },
        {
            title: ' No Of Product',
            dataIndex: 'totalProduct',
            key: 'totalProduct',
            ellipsis: true,

            render: (_, { _id, totalProduct }) => (
                <Space
                    onClick={() => handleOpen(_id)}
                    style={{ cursor: 'pointer' }}
                >
                    <Tag bordered={false} color="blue"><strong>{totalProduct}</strong></Tag>

                </Space>
            )

        },
        {
            title: 'Create At',
            dataIndex: 'addedDate',
            key: 'addedDate',
            ellipsis: true,
            render: addedDate => (
                <>{addedDate}

                </>
            )

        },

        {
            title: ' Status ',
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
            render: (_, { status, _id }) => (
                <Space>
                    <Tag color={status == "ACTIVE" ? "green" : "red"} >{status}</Tag>
                    <Switch defaultChecked={status === "ACTIVE"} size="small" onClick={() => activeDeactiveHandler(_id, status)} />
                </Space>
            )

        },
        {
            title: ' Action ',
            dataIndex: '_id',
            key: '_id',
            ellipsis: true,
            fixed: "right",
            render: (_, { _id, title, smallBanner, middleBanner, bigBanner, segmentNo }) => (
                <Space>

                    <Dropdown
                        trigger={["click"]}

                        menu={{
                            items: DropdownItem(_id, title, smallBanner, middleBanner, bigBanner, segmentNo), // Ensure this returns valid items
                        }}
                    >
                        <Button icon={<MoreOutlined />} shape="circle" />
                    </Dropdown>
                </Space>
            )

        },
    ];

    const showAllCustomSegment = async () => {
        setIsLoading(true)
        try {
            await fetchCustomSegment(token)
                .then((res) => {
                    console.log(" segment list ", res);
                    if (res.status == 200) {
                        setSegmentList(res.data.data);
                        setIsLoading(false)
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()

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

    useEffect(() => {
        showAllCustomSegment()
    }, [])


    const activeDeactiveHandler = async (id, status) => {
        const body = {
            staticCustomSegmentId: id,
            action: status === "ACTIVE" ? "INACTIVE" : "ACTIVE"

        }
        try {
            await activeDeactiveSegment(token, body)
                .then((res) => {
                    console.log("status change segment product ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        showAllCustomSegment()
                    }

                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    };
    const deleteSegmentHandle = async (id) => {
        try {
            let body = {
                staticCustomSegmentId: id,
                action: "DELETED"
            };
            await activeDeactiveSegment(token, body)
                .then((res) => {
                    console.log("delete segment  ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        showAllCustomSegment();
                    }
                })
                .catch((err) => {
                    console.log(err.response.msg);
                });
        } catch (error) {
            console.log(error);
        }
    };
    const cancel = () => {
        message.error("your are click no")
    }

    const handleOpen = (_id) => {
        setSegmentId(_id)
        setIsModalOpen(true)
    }

    const handleClose = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            <section className="main_Section">
                <div className="section_title">
                    <div className="section_title_left">
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
                        <div className="section_actions">
                            <Space>

                                <Title level={4}>Custom Segment  List</Title>


                            </Space>
                        </div>
                    </div>
                    <div className="content_add">
                        <Space>
                            <AddNewSegment showAllCustomSegment={showAllCustomSegment} />
                            <Button
                                type="primary"
                                shape="round"
                                onClick={() => showAllCustomSegment()}
                                loading={isLoading}
                                icon={isLoading ? <LoadingOutlined /> : null}
                            >
                                Refresh
                            </Button>
                        </Space>
                    </div>


                </div>

                <div className="content_title">

                    <div className="content">
                        <div className="shoo_recent_order">
                            {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                                <Table columns={columns} dataSource={segmentList} scroll={{ x: true }} />}
                        </div>
                    </div>


                </div>

            </section>

            {isModalOpen &&
                <ProductListModal
                    open={isModalOpen}
                    onCancel={handleClose}
                    segmentId={segmentId}
                />
            }

            {/* <Modal
                open={isModalOpen}
                onCancel={handleClose}
                style={{ top: 20 }}
                loading={isLoading}
                footer={false}
                title="Product List"
            >
                <div style={{ textAlign: "center", padding: "10px 0" }}>

                    <h4 style={{ marginBottom: 10 }}>
                        Are you sure you want to accept this order?
                    </h4>

                    <p style={{ color: "#888", marginBottom: 25 }}>
                        Once accepted, the order will move to the next processing stage.
                    </p>
                </div>
            </Modal> */}
        </>
    );
}





export default CustomSegment