import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Button, Card, Checkbox, Descriptions, Dropdown, Form, Image, Input, List, Pagination, Popconfirm, Select, Statistic, Tooltip, Typography, message } from "antd";
import '../../style/product.css'
import { useLocation, useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { Col, Row } from "react-bootstrap";
import { deleteVendor, fetchAllBranchList, fetchAllVendorList } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import { FaRegUser } from "react-icons/fa";
import AddVendor from "./AddVendor";
import { useDebounce } from "use-debounce";
import { CloseOutlined, EditFilled, EyeOutlined, MoreOutlined, SearchOutlined, StarOutlined } from '@ant-design/icons';
import VendorRating from "./VendorRating";
import EditVendor from "./EditVendor";

const DocumentUpload = [
    { key: 1, value: true, label: "Uploaded" },
    { key: 2, value: false, label: "Not Uploaded" }
];

const DocumentApprove = [
    { key: 1, value: true, label: "Approved" },
    { key: 2, value: false, label: "Not Approved" }
];

function DeliveryPartner() {
    const navigate = useNavigate();
    const location = useLocation();
    const { token, logout } = useAuth();
    const [brandList, setBrandList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(null);
    const [current, setCurrent] = useState(1);
    const [isDocUpload, setIsDocUpload] = useState(null);
    const [isDocApprove, setIsDocApprove] = useState(null);
    const [branchId, setBranchId] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearchInput] = useDebounce(searchInput, 1000);
    const [branchData, setBranchData] = useState([]);

    const { Title } = Typography;

    function DropdownItem(_id) {
        return [
            {
                key: '1',
                icon: <EyeOutlined />,
                label: (
                    <span onClick={() => navigate(`/dashboard/delivery-partner/${_id}`)}>
                        View Details
                    </span>
                ),
            },
            {
                key: '2',
                icon: <StarOutlined />,
                label: (
                    <VendorRating vendorId={_id} />
                ),
            },
            {
                key: '3',
                icon: <CloseOutlined />,
                label: (

                    <span
                        onClick={() => DeleteVendor(_id)} // Ensure `error` function is defined
                    >
                        Delete
                    </span>
                ),

            },
            {
                key: '4',
                icon: <EditFilled />,
                label: (

                    <EditVendor vendorId={_id} showAllVendorList={showAllVendorList} />
                ),

            },
        ];
    }

    const columns = [
        {
            title: 'Image',
            dataIndex: 'profilePic',
            key: 'profilePic',
            render: (_, { profilePic }) => (
                <div className="show_cat_img" >
                    {profilePic != null ? <Image src={profilePic} width={50} height={50} style={{ borderRadius: "100%", objectFit: "contain", background: "lightGray" }} /> : <Avatar size={45} icon={<FaRegUser className="pro_icon" />} />}

                </div>
            )
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
            ellipsis: true,


        },

        {
            title: 'Number',
            dataIndex: 'mobileNo',
            key: 'mobileNo',

        },
        {
            title: 'Document Upload',
            dataIndex: 'isDocumentUpload',
            key: 'isDocumentUpload',
            ellipsis: true,

            render: (_, { isDocumentUpload }) => (
                <>
                    {isDocumentUpload ? <Tag color="green">Uploaded</Tag> : <Tag color="red">Pending</Tag>}
                </>
            )

        },

        {
            title: 'Assign Branch',
            ellipsis: true,

            dataIndex: 'branchId',
            key: 'branchId',
            render: branchId => branchId != null ? <Tooltip title={branchId.branchName}>
                <Tag color="blue">{branchId.branchCode}</Tag>
            </Tooltip> : <span>N/A</span>

        },
        {
            title: 'Vehicle Type',
            dataIndex: 'vehicle',
            ellipsis: true,

            key: 'vehicle',
            render: vehicle => vehicle != null ? <span>{vehicle}</span> : <span>N/A</span>

        },
        {
            title: 'Vehicle Number',
            dataIndex: 'vehilceNo',
            ellipsis: true,

            key: 'vehilceNo',
            render: vehilceNo => vehilceNo ? <span>{vehilceNo}</span> : <span>N/A</span>

        },
        {
            title: 'Document Action',
            key: 'isDocumentVerified',
            ellipsis: true,

            dataIndex: 'isDocumentVerified',
            render: (_, { isDocumentVerified }) => (
                <>
                    {isDocumentVerified == null ? <Tag color="blue">
                        Pending
                    </Tag> : isDocumentVerified == true ? <Tag color="green">
                        Approved
                    </Tag> : <Tag color="red" >
                        Reject
                    </Tag>}
                </>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_, { status }) => (
                <>
                    {status == "ACTIVE" ? <Tag color="green">
                        {status}
                    </Tag> : <Tag color="orange" >
                        {status}
                    </Tag>}
                </>
            ),
        },
        {
            title: 'Action',
            key: '_id',
            fixed: 'right',
            render: (_, { _id }) => (
                <Space size="middle">

                    <Dropdown
                        trigger={["click"]}
                        menu={{
                            items: DropdownItem(_id), // Ensure this returns valid items

                        }}
                    >
                        <Button icon={<MoreOutlined />} shape="circle" />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const onChange = (page) => {
        setCurrent(page);
        setIsLoading(true);
    };

    const showAllVendorList = async () => {
        try {
            const res = await fetchAllVendorList(token, current, branchId, isDocUpload, isDocApprove, debouncedSearchInput);
            if (res.status === 200) {
                setBrandList(res.data.data.data);
                setTotalPage(res.data.data.totalPage);
                setIsLoading(true);
            } else if (res.data.code === 283) {
                message.error(res.data.message);
                logout();
            }
        } catch (error) {
            console.log(error);
            setIsLoading(true);
        }
    };

    useEffect(() => {
        showAllVendorList();
    }, [current, isDocApprove, isDocUpload, branchId, debouncedSearchInput]);

    const cancel = (e) => {
        message.error('Click on No');
    };

    const DeleteVendor = async (id) => {
        try {
            const body = { "vendorId": id };
            const res = await deleteVendor(body, token);
            if (res.status === 201) {
                message.success(res.data.message);
                showAllVendorList();
            }
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
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllBranchList();
    }, []);

    return (
        <section className="main_Section">
            <Breadcrumb
                items={[
                    { title: "Dashboard" },
                    { title: location.pathname }
                ]}
            />
            <div className="content_title">
                <div className="content_head">
                    <div className="content_titles">
                        <div className="hear_title">
                            <Title level={4}>Delivery Partner</Title>
                        </div>
                    </div>

                    <div className="content_add mx-2">
                        <AddVendor showAllVendorList={showAllVendorList} />
                    </div>
                </div>
                <div className="pro_selector">
                    <Space>

                        <Select
                            allowClear
                            placeholder="Select Document Action"
                            optionFilterProp="children"
                            onChange={(value) => setIsDocUpload(value)}
                            style={{ width: '175px' }}
                        >
                            {DocumentUpload.map((opt) => (
                                <Select.Option key={opt.key} value={opt.value}>{opt.label}</Select.Option>
                            ))}
                        </Select>

                        <Select
                            allowClear
                            placeholder="Select Document Approval"
                            optionFilterProp="children"
                            onChange={(value) => setIsDocApprove(value)}
                            style={{ width: '175px' }}
                        >
                            {DocumentApprove.map((opt) => (
                                <Select.Option key={opt.key} value={opt.value}>{opt.label}</Select.Option>
                            ))}
                        </Select>

                        <Select
                            showSearch
                            allowClear
                            placeholder="Select Branch"
                            optionFilterProp="children"
                            onChange={(value) => setBranchId(value)}
                            style={{ width: '175px' }}
                        >
                            {branchData.map((option) => (
                                <Select.Option
                                    key={option._id}
                                    level={option.branchName}
                                    value={option._id}
                                >
                                    {option.branchName}
                                </Select.Option>
                            ))}
                        </Select>

                        <Input
                            allowClear
                            style={{ width: '175px' }}
                            placeholder="Search Name Or Number"
                            suffix={<SearchOutlined />}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </Space>
                </div>
                <div className="content">
                    <div className="shoo_recent_order">
                        {!isLoading ? (
                            <div className="loader_main"><span className="loader2"></span></div>
                        ) : (
                            <Table
                                columns={columns}
                                dataSource={brandList}
                                scroll={{ x: true }}
                                pagination={false}
                                footer={() => (
                                    <div className="pagination">
                                        <Pagination current={current} onChange={onChange} total={totalPage * 10} />
                                    </div>
                                )}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DeliveryPartner;
