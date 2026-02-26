import { Tag, Tooltip } from "antd";

export const dailyReportColumn = [
    {
        title: 'Average Order Value',
        dataIndex: 'aov',
        key: 'aov',
        ellipsis: true,
    },

    {
        title: 'New Customer',
        dataIndex: 'newCustomerCount',
        key: 'newCustomerCount',
        ellipsis: true,
        render: (_, { newCustomerCount }) => <span>{newCustomerCount || 0}</span>,
    },

    {
        title: 'Total Customers',
        dataIndex: 'totalCustomers',
        key: 'totalCustomers',
        ellipsis: true,

    },
    {
        title: 'Total Orders',
        dataIndex: 'totalOrders',
        key: 'totalOrders',
        ellipsis: true,
        render: (_, { totalOrders }) => <span>{totalOrders || 0}</span>,
    },
    {
        title: 'Total Products',
        dataIndex: 'totalProducts',
        key: 'totalProducts',
        ellipsis: true,
        render: (_, { totalProducts }) => <span>{totalProducts || 0}</span>,
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        ellipsis: true,
    },


    {
        title: 'Payable Amount',
        dataIndex: 'totalPayableAmount',
        key: 'totalPayableAmount',
        render: (_, { totalPayableAmount }) => (
            <span>₹ {totalPayableAmount?.toFixed(2)}</span>

        ),
        ellipsis: true,
    },



];

export const orderHistoryColumn = [
    {
        title: 'Order Code',
        dataIndex: 'orderCode',
        key: 'orderCode',

        render: (_, { orderCode, _id }) => (
            <div className="order_code">
                <span>#</span><span><b>{orderCode}</b></span>

            </div>
        ),
        ellipsis: true,
    },
    // {
    //     title: 'Status',
    //     key: 'status',
    //     dataIndex: 'status',
    //     render: (_, { status, _id }) => (
    //         <>
    //             <Tag key={_id} color={getStatusColor(status)}>{status}</Tag>
    //         </>
    //     ),
    // },
    {
        title: 'Pincode',
        dataIndex: 'pinCode',
        key: 'pinCode',
        render: (_, { pinCode }) => <span>{pinCode || "N/A"}</span>,
        ellipsis: true,
    },

    {
        title: 'Customer Name',
        dataIndex: 'userName',
        key: 'userName',
        ellipsis: true,

    },
    {
        title: 'Mobile No.',
        dataIndex: 'userMobileNo',
        key: 'userMobileNo',
        ellipsis: true,

    },
    {
        title: 'Branch',
        dataIndex: 'branchCode',
        key: 'branchCode',

        render: (_, { branchCode }) => (

            <Tag color="blue">
                {branchCode}
            </Tag>

        ),
        ellipsis: true,
    },

    {
        title: 'Order Date',
        dataIndex: 'addedDate',
        key: 'addedDate',

        ellipsis: true,
        render: (addedDate) => (
            <span>{addedDate}</span>
        )
    },

    {
        title: 'Delivery Type',
        dataIndex: 'deliveryOption',
        key: 'deliveryOption',

        render: (_, { deliveryOption }) => (

            <Tag color={deliveryOption == "DELIVERY" ? "#7ABA78" : "#387ADF"}>
                {deliveryOption}
            </Tag>

        ),
        ellipsis: true,
    },
    {
        title: 'Product Code',
        dataIndex: 'productCode',
        key: 'productCode',

        render: (_, { productCode }) => {
            const codes = JSON?.parse(productCode);
            return (
                <div className="show_product_code">
                    {codes?.map((code, index) => (
                        <Tag key={index}>
                            {code}
                        </Tag>
                    ))}
                </div>
            )
        },
        ellipsis: true,
    },
    {
        title: 'Payment Mode',
        dataIndex: 'paymentMode',

        key: 'paymentMode',
        render: (_, { paymentMode }) => (

            <Tag color={paymentMode != "COD" ? "#7ABA78" : "#F57D1F"}>
                {paymentMode}
            </Tag>

        ),
        ellipsis: true,
    },

    {
        title: 'Payable Amount',
        dataIndex: 'totalPayableAmount',
        key: 'totalPayableAmount',

        render: (_, { totalPayableAmount }) => (
            <span>₹ {totalPayableAmount?.toFixed(2)}</span>

        ),
        ellipsis: true,
    },



];

export const allCustomerColumn = [
    {
        title: 'Mobile No.',
        dataIndex: 'userMobileNo',
        key: 'userMobileNo',
        render: (_, { userMobileNo }) => <span>{userMobileNo || "N/A"}</span>,

        ellipsis: true,
    },

    {
        title: 'Customer Name',
        dataIndex: 'userName',
        key: 'userName',
        ellipsis: true,
        render: (_, { userName }) => <span>{userName || "N/A"}</span>,
    },

    {
        title: ' Gender',
        dataIndex: 'userGender',
        key: 'userGender',
        ellipsis: true,
        render: (_, { userGender }) => <span>{userGender || "N/A"}</span>,
    },
    {
        title: 'Order Code',
        dataIndex: 'orderCode',
        key: 'orderCode',
        ellipsis: true,

    },
    {
        title: 'Pincode',
        dataIndex: 'pinCode',
        key: 'pinCode',
        ellipsis: true,
        render: (_, { pinCode }) => <span>{pinCode || "N/A"}</span>,
    },

    {
        title: 'Created At',
        dataIndex: 'addedDate',
        key: 'addedDate',
        ellipsis: true,
    },


    {
        title: 'Payable Amount',
        dataIndex: 'totalPayableAmount',
        key: 'totalPayableAmount',
        render: (_, { totalPayableAmount }) => (
            <span>₹ {totalPayableAmount?.toFixed(2)}</span>

        ),
        ellipsis: true,
    },



];

export const newCustomerColumn = [


    {
        title: 'Order Count',
        dataIndex: 'orderCount',
        key: 'orderCount',
        ellipsis: true,
        render: (_, { orderCount }) => <span>{orderCount || "N/A"}</span>,
    },

    {
        title: ' Pincode',
        dataIndex: 'pinCode',
        key: 'pinCode',

        ellipsis: true,
        render: (_, { pinCode }) => <span>{pinCode || "N/A"}</span>,
    },

    {
        title: 'Total Customers',
        dataIndex: 'totalNewCustomers',
        key: 'totalNewCustomers',
        ellipsis: true,

        render: (_, { totalNewCustomers }) => <span>{totalNewCustomers || "N/A"}</span>,
    },

    {
        title: 'Date',
        dataIndex: '_id',
        key: '_id',

        ellipsis: true,
    },


    {
        title: 'Average Payable Amount',
        dataIndex: 'averagePayableAmount',
        key: 'averagePayableAmount',

        render: (_, { averagePayableAmount }) => (
            <span>₹ {averagePayableAmount}</span>

        ),
        ellipsis: true,
    },



];

export const oldCustomerColumn = [


    {
        title: 'Order Count',
        dataIndex: 'orderCount',
        key: 'orderCount',
        ellipsis: true,
        render: (_, { orderCount }) => <span>{orderCount || "N/A"}</span>,
    },

    {
        title: ' Pincode',
        dataIndex: 'pinCode',
        key: 'pinCode',

        ellipsis: true,
        render: (_, { pinCode }) => <span>{pinCode || "N/A"}</span>,
    },

    {
        title: 'Total Customers',
        dataIndex: 'totalOldCustomers',
        key: 'totalOldCustomers',
        ellipsis: true,

        render: (_, { totalOldCustomers }) => <span>{totalOldCustomers || 0}</span>,
    },

    {
        title: 'Date',
        dataIndex: '_id',
        key: '_id',

        ellipsis: true,
    },


    {
        title: 'Average Payable Amount',
        dataIndex: 'averagePayableAmount',
        key: 'averagePayableAmount',

        render: (_, { averagePayableAmount }) => (
            <span>₹ {Number(averagePayableAmount).toFixed(2)}</span>

        ),
        ellipsis: true,
    },



];
export const categoryColumn = [


    {
        title: 'Category Name',
        dataIndex: 'categoryName',
        key: 'categoryName',
        ellipsis: true,
        render: (_, { categoryName }) => <span>{categoryName || "N/A"}</span>,
    },

    {
        title: ' Total Revenue',
        dataIndex: 'totalRevenue',
        key: 'totalRevenue',

        ellipsis: true,
        render: (_, { totalRevenue }) => <span>{Number(totalRevenue)?.toFixed(2) || 0}</span>,
    },

    {
        title: 'Total Customers',
        dataIndex: 'totalCustomers',
        key: 'totalCustomers',
        ellipsis: true,

        render: (_, { totalCustomers }) => <span>{totalCustomers || 0}</span>,
    },
    {
        title: 'Total Qty',
        dataIndex: 'totalQty',
        key: 'totalQty',
        ellipsis: true,

        render: (_, { totalQty }) => <span>{totalQty || 0}</span>,
    },
    {
        title: 'All Stores',
        dataIndex: 'allStores',
        key: 'allStores',
        ellipsis: true,

        render: (_, { allStores }) => <span>{allStores || 0}</span>,
    },




];

export const offerColumn = [


    {
        title: 'Product Code',
        dataIndex: 'productCode',
        key: 'productCode',
        ellipsis: true,
    },
    {
        title: ' Product Name',
        dataIndex: 'productName',
        key: 'productName',

        ellipsis: true,
        render: (_, { productName }) => (
            <Tooltip title={productName}>
                <span>{productName?.substr(1, 30) || "N/A"}</span>
            </Tooltip>

        )
    },
    {
        title: 'Offer Type',
        dataIndex: 'offerType',
        key: 'offerType',
        ellipsis: true,

        render: (_, { offerType }) => <span>{offerType || "N/A"}</span>,
    },
    {
        title: 'Branch Code',
        dataIndex: 'branchCode',
        key: 'branchCode',
        ellipsis: true,

    },

    {

        title: ' Brand Name',
        dataIndex: 'brandName',
        key: 'brandName',

        ellipsis: true,
        render: (_, { brandName }) => <span>{brandName || "N/A"}</span>,
    },

    {
        title: 'MRP Price',
        dataIndex: 'mrpPrice',
        key: 'mrpPrice',
        ellipsis: true,

    },
    {
        title: 'Product Price',
        dataIndex: 'productPrice',
        key: 'productPrice',
        ellipsis: true,


    },

    {
        title: 'Category Name',
        dataIndex: 'categoryName',
        key: 'categoryName',
        ellipsis: true,

    },
    {
        title: 'Item Category Name',
        dataIndex: 'itemCategoryName',
        key: 'itemCategoryName',
        ellipsis: true,

    },
    {
        title: 'Sub Category Name',
        dataIndex: 'subCategoryName',
        key: 'subCategoryName',
        ellipsis: true,

    },



];

export const brandColumn = [
    {
        title: 'Brand Name',
        dataIndex: 'brandName',
        key: 'brandName',
        ellipsis: true,
        render: (_, { brandName }) => <span>{brandName || "N/A"}</span>,
    },

    {
        title: ' Total Quantity',
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',

        ellipsis: true,
        render: (_, { totalQuantity }) => <span>{Number(totalQuantity) || 0}</span>,
    },

    {
        title: 'Total Customer',
        dataIndex: 'totalCustomer',
        key: 'totalCustomer',
        ellipsis: true,

        render: (_, { totalCustomer }) => <span>{totalCustomer || 0}</span>,
    },
    {
        title: 'Total Revenue',
        dataIndex: 'totalRevenue',
        key: 'totalRevenue',
        ellipsis: true,
        render: (_, { totalRevenue }) => <span>{totalRevenue || 0}</span>,
    },

];


export const segmentColumn = [


    {
        title: 'Product Code',
        dataIndex: 'productCode',
        key: 'productCode',
        ellipsis: true,
    },
    {
        title: ' Product Name',
        dataIndex: 'productName',
        key: 'productName',

        ellipsis: true,
        render: (_, { productName }) => (
            <Tooltip title={productName}>
                <span>{productName?.substr(1, 30) || "N/A"}</span>
            </Tooltip>

        )
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        ellipsis: true,

        render: (_, { price }) => <span>{price || 0}</span>,
    },
    {
        title: 'Bkd Amount',
        dataIndex: 'bkdAmount',
        key: 'bkdAmount',
        ellipsis: true,
        render: (_, { bkdAmount }) => <span>{bkdAmount || 0}</span>,

    },

    {

        title: ' MRP',
        dataIndex: 'totalMRP',
        key: 'totalMRP',

        ellipsis: true,
        render: (_, { totalMRP }) => <span>{totalMRP || "N/A"}</span>,
    },

    {
        title: ' Quantity',
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
        ellipsis: true,
        render: (_, { totalQuantity }) => <span>{totalQuantity || 0}</span>,

    },
    {
        title: ' Revenue',
        dataIndex: 'totalRevenue',
        key: 'totalRevenue',
        ellipsis: true,
        render: (_, { totalRevenue }) => <span>{totalRevenue || 0}</span>,


    },

    {
        title: ' Users',
        dataIndex: 'totalUsers',
        key: 'totalUsers',
        ellipsis: true,
        render: (_, { totalUsers }) => <span>{totalUsers || 0}</span>,

    },

];


export const searchProductColumn = [


    {
        title: 'Product ',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
    },
    {
        title: ' Category ',
        dataIndex: 'categoryName',
        key: 'categoryName',

        ellipsis: true,

    },
    {
        title: 'Item Category ',
        dataIndex: 'itemCategoryName',
        key: 'itemCategoryName',
        ellipsis: true,

    },
    {
        title: 'Sub Category',
        dataIndex: 'subCategoryName',
        key: 'subCategoryName',
        ellipsis: true,

    },

    {

        title: ' Count',
        dataIndex: 'count',
        key: 'count',
        ellipsis: true,
        render: (_, { count }) => <span>{count || 0}</span>,
    },



];

export const searchKeywordColumn = [


    {
        title: 'Token ',
        dataIndex: 'token',
        key: 'token',
        ellipsis: true,
    },
    {
        title: 'Product Code ',
        dataIndex: 'esBkdCode',
        key: 'esBkdCode',
        ellipsis: true,
    },
    {
        title: ' Product Name ',
        dataIndex: 'productName',
        key: 'productName',

        ellipsis: true,

    },
    {
        title: ' Category ',
        dataIndex: 'categoryName',
        key: 'categoryName',

        ellipsis: true,

    },
    {
        title: 'Item Category ',
        dataIndex: 'itemCategoryName',
        key: 'itemCategoryName',
        ellipsis: true,

    },
    {
        title: 'Sub Category',
        dataIndex: 'subCategoryName',
        key: 'subCategoryName',
        ellipsis: true,

    },

    {

        title: ' Count',
        dataIndex: 'count',
        key: 'count',
        ellipsis: true,
        render: (_, { count }) => <span>{count || 0}</span>,
    },



];


