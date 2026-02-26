import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Button, Card, Form, Image, Pagination, Popconfirm, Select, Statistic, Switch, Tooltip, Typography, message } from "antd";
import '../../../style/master.css'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { useAuth } from "../../../authentication/context/authContext";
import DefaultLogo from "../../../assest/png/bkdlogo.png"

import { activeDeactiveSegmentProduct, DeleteSegmentProduct, exportSegmentProduct, fetchAllBranchList, fetchCustomSegment, fetchSegmentProdcut } from "../../../service/api_services";

import { MdKeyboardBackspace } from "react-icons/md";
import SelecteBrandData from "../../productManage/SelectBrandData";
import BulKProductUpload from "./BulKProductUpload";
import ExcelFormate from "./ExcelFormate";



function SegmentDetails() {
    const location = useLocation();
    const [isExportData, setIsExportData] = useState(false)
    const [form] = Form.useForm();
    const { token, logout } = useAuth()
    const { id } = useParams()
    const { state } = useLocation();
    const segmentNo = state?.segmentNo || "";
    const navigate = useNavigate()
    const [segmentList, setSegmentList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [branchData, setBranchData] = useState([])
    const [totalPage, setTotalPage] = useState([])
    const [current, setCurrent] = useState(1)
    const { Title } = Typography;
    const [branchId, setBranchId] = useState(null)
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const onChange = (page) => {
        setCurrent(page);
        setIsLoading(true);
        console.log("page", page);
    };

    const cancel = () => {
        message.error("you are select no")
    }
    const columns = [
        {
            title: 'Product Code',
            dataIndex: 'productCode',
            key: 'productCode',
            ellipsis: true,

        },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (_, { imageUrl }) => (
                <>
                    <Image src={imageUrl[0] != null ? imageUrl[0] : DefaultLogo} width={50} height={50} style={{ borderRadius: "8px", objectFit: "contain" }} />
                </>
            )
        },
        {
            title: 'Name',
            dataIndex: 'productName',
            key: 'productName',
            ellipsis: {
                showTitle: false,
            },
            render: (productName) => (
                <Tooltip placement="topLeft" title={productName}>
                    {capitalize(productName.substr(0, 16))}...
                </Tooltip>
            )


        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (_, { price }) => <span>₹{price}</span>

        },
        {
            title: 'BKD Price',
            dataIndex: 'bkdAmount',
            key: 'bkdAmount',
            ellipsis: true,

            render: (_, { bkdAmount }) => <span>₹{bkdAmount}</span>
        },
        {
            title: 'Stock',
            dataIndex: 'stockQty',
            key: 'stockQty',
            ellipsis: true,


        },
        {
            title: 'Bags',
            dataIndex: 'isRefridgerator',
            key: 'isRefridgerator',
            render: (_, { isRefridgerator }) => <Tag color={isRefridgerator ? "blue" : ""} bordered={false}>{isRefridgerator ? "Frozen" : "Normal"}</Tag>

        },
        {
            title: ' Status ',
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
            render: (_, { _id, status }) => (
                <Space>

                    <Tag color={status == "ACTIVE" ? "green" : "red"} >{status}</Tag>
                    <Switch checked={status === "ACTIVE"} size="small" onClick={() => activeDeactiveHandler(_id, status)} />
                </Space>
            )

        },
        {
            title: ' Action ',
            dataIndex: '_id',
            key: '_id',
            ellipsis: true,
            render: (_, { _id }) => (
                <Space>

                    {/* <AddProductSegment segmentId={_id} showAllCustomSegment={showAllCustomSegment} /> */}
                    <Popconfirm
                        placement="topLeft"
                        title="Delete the Segment Product"
                        description="Are you sure to delete this Product?"
                        onConfirm={() => deleteSegmentProHandle(_id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" shape="round" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            )

        },
    ];

    const showSegmentDetails = async () => {
        try {
            await fetchSegmentProdcut(token, id, branchId, current)
                .then((res) => {
                    console.log(" segment details ", res);
                    if (res.status == 200) {
                        setSegmentList(res.data.data.data);
                        setTotalPage(res.data.data.totalPage);
                        setIsLoading(true)
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()

                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setIsLoading(true)

                });
        } catch (error) {
            console.log(error);
            setIsLoading(true)

        }
    };

    useEffect(() => {
        showSegmentDetails()
    }, [branchId, current])

    const activeDeactiveHandler = async (id, status) => {
        const body = {
            staticCustomSegmentProductId: id,
            action: status === "ACTIVE" ? "INACTIVE" : "ACTIVE"

        }
        try {
            await activeDeactiveSegmentProduct(token, body)
                .then((res) => {
                    console.log("status change segment product ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        showSegmentDetails()
                    }

                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    };


    const deleteSegmentProHandle = async (id) => {
        try {
            let body = {
                staticCustomSegmentProductId: id,
                action: "DELETED"

            };
            await activeDeactiveSegmentProduct(token, body)
                .then((res) => {
                    console.log("delete segment pro ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        showSegmentDetails();
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

    const getAllBranchList = async () => {
        try {
            const res = await fetchAllBranchList(token);
            if (res.status === 200) {
                setBranchData(res.data.data.data);
                setBranchId(res.data.data.data[0].branchCode);
                form.setFieldsValue({
                    branchCode: branchId != null ? branchId : res.data.data.data[0].branchCode,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllBranchList();
    }, []);

    const ExportSemgentData = async () => {
        setIsExportData(true)
        try {
            const res = await exportSegmentProduct(token, id);
            console.log("res", res)
            if (res.status === 200) {
                message.success(res.data.message)
                const fileUrl = res.data.data.exportExcel


                setIsExportData(false)

                // Trigger file download
                window.open(fileUrl, '_blank');
                // await deleteStoreExcel(fileUrl, token).then((res) => {
                //     console.log("remove excel file", res)
                //     if (res.status === 201) {
                //         message.info(res.data.message)
                //     }
                // }).catch((err) => {
                //     console.log(err)
                // })
            } else if (res.data.code === 283) {
                message.error(res.data.message);
                logout();
            } else {
                message.error("Failed to export data");
                setIsExportData(false)
            }
        } catch (error) {
            console.log(error);
            message.error("An error occurred during export");
            setIsExportData(false)
        }
    };

    return (
        <section className="main_Section">
            <div className="section_title">
                <div className="section_title_left">
                    <Breadcrumb
                        items={[
                            {
                                title: "Dashboard",
                            },
                            {
                                title: location.pathname.substring(0, 35),
                            },
                        ]}
                    />
                    <div className="section_actions">
                        <Space>
                            <Button type="link" onClick={() => navigate(-1)}> <MdKeyboardBackspace className="back_icon" /></Button>
                            <Title level={4}>{`Segment ${segmentNo} `}</Title>
                        </Space>

                    </div>
                </div>
                <div className="content_add">
                    <Form
                        form={form}
                        // layout="vertical"
                        name="filter-product"
                        className="filter"
                    >
                        <Space>
                            <Form.Item name="branchCode">
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Branch"
                                    optionFilterProp="children"
                                    onChange={(value) => setBranchId(value)}
                                    style={{ width: '220px' }}
                                >
                                    {branchData?.map((option) => (
                                        <Select.Option
                                            key={option.branchCode}
                                            level={option.branchName}
                                            value={option.branchCode}
                                        >
                                            {capitalize(option.branchName)}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                             <Form.Item>
                                <ExcelFormate title="segment" />
                            </Form.Item>
                            <Form.Item>
                                <BulKProductUpload showSegmentDetails={showSegmentDetails} segmentId={id} />
                            </Form.Item>
                            <Form.Item>
                                <Button shape="round" type="primary" loading={isExportData} onClick={() => ExportSemgentData()}>Export Data</Button>
                            </Form.Item>
                           
                        </Space>
                    </Form>

                </div>


            </div>

            <div className="content_title">

                <div className="content">
                    <div className="shoo_recent_order">
                        {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                            <Table columns={columns} dataSource={segmentList} scroll={{ x: true }} pagination={false}
                                footer={() => <div className="pagination">
                                    <Pagination current={current} onChange={onChange} total={totalPage * 10} />
                                </div>} />}
                    </div>
                </div>


            </div>

        </section>
    );
}






export default SegmentDetails