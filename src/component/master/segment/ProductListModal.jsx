import { Button, Image, Input, message, Modal, Pagination, Select, Space, Table, Tag, Tooltip } from "antd"
import { fetchAllBranchList, fetchSegmentProdcut } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";
import { useEffect, useState } from "react";
import { capitalize } from "lodash";
import DefaultLogo from "../../../assest/png/bkdlogo.png"
import { SearchOutlined } from '@ant-design/icons';
import { useScreen } from "../../../authentication/context/AuthScreen";

function ProductListModal({ open, onCancel, segmentId }) {
    const { screenWidth } = useScreen();
    const isMobile = screenWidth < 768;
    const { token, logout } = useAuth()
    const [current, setCurrent] = useState(1)
    const [segmentList, setSegmentList] = useState([])
    const [totalPage, setTotalPage] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [branchData, setBranchData] = useState([])
    const [branchId, setBranchId] = useState(null)
    const [searchInput, setSearchInput] = useState("")

    const filteredSegmentList = segmentList.filter((item) => {
        if (!searchInput) return true;

        const search = searchInput.toLowerCase();

        return (
            item.productCode?.toLowerCase().includes(search) ||
            item.productName?.toLowerCase().includes(search)
        );
    });

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
        setCurrent(1);
    };

    const onChange = (page) => {
        setCurrent(page);
    };

    const showSegmentDetails = async () => {
        setIsLoading(true)
        try {
            await fetchSegmentProdcut(token, segmentId, branchId, current, 100)
                .then((res) => {
                    if (res.status == 200) {
                        setSegmentList(res.data.data.data);
                        setTotalPage(res.data.data.totalPage);
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
        showSegmentDetails()
    }, [segmentId, current, branchId])

    const getAllBranchList = async () => {
        try {
            const res = await fetchAllBranchList(token);
            if (res.status === 200) {
                setBranchData(res.data.data.data);
                // setBranchId(res.data.data.data[0].branchCode);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllBranchList();
    }, []);

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
                    <Image
                        src={imageUrl[0] != null ? imageUrl[0] : DefaultLogo}
                        onError={(e) => e.currentTarget.src = DefaultLogo}
                        width={50}
                        height={50}
                        style={{ borderRadius: "8px", objectFit: "contain" }}
                    />
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
                </Space>
            )

        },
    ];

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            style={{ top: 20 }}
            loading={isLoading}
            footer={false}
            title={
                <div className="productlist_header">
                    <div>Product List</div>
                    <Select
                        showSearch
                        allowClear
                        placeholder="Select Branch"
                        optionFilterProp="children"
                        onChange={(value) => {
                            setBranchId(value);
                            setCurrent(1);
                        }}
                        style={{ width: isMobile ? '100%' : 220 }}
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
                    <Input
                        allowClear
                        placeholder="Search..."
                        suffix={<SearchOutlined />}
                        onChange={handleSearch}
                        style={{ width: isMobile ? '100%' : 200 }}
                    />
                </div>
            }
            width={1000}
        >
            <div style={{ textAlign: "center", padding: "5px 0" }}>
                <Table
                    columns={columns}
                    dataSource={filteredSegmentList}
                    scroll={{ x: true, y: isMobile ? 560 : 650 }}
                    loading={isLoading}
                    pagination={false}
                    className="product_table"
                    footer={
                        () => <div className="pagination">
                            <Pagination current={current} onChange={onChange} total={totalPage * 10} />
                        </div>
                    }
                />
            </div>
        </Modal>
    )
}

export default ProductListModal