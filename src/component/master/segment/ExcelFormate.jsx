import { Button } from 'antd'
import React from 'react'
import { DownloadOutlined } from '@ant-design/icons';
import excelFile from '../../../assest/file/productCodeSegment.xlsx'
import poolExcelFile from '../../../assest/file/poolProductExcel.xlsx'
import delivery from "../../../assest/file/allowedDCProductCode.xlsx"
import stock from "../../../assest/file/productCodeStockLimit.xlsx"

function ExcelFormate({ title }) {

    const getUrls = () => {
        let url;
        if (title === "segment") {
            url = excelFile
        } else if (title === "Delivery") {
            url = delivery
        } else if (title === "stock_limit") {
            url = stock
        } else {
            url = poolExcelFile
        }
        return url
    }

    return (
        <div>
            <a href={getUrls()} download={title === "segment" ? "segment-product.xlsx" : title === "Delivery" ? "delivery-charge-allow-product.xlsx" : title === "stock_limit" ? "stock-limit-product.xlsx" : "pool-product.xlsx"}>
                <Button type={title === "segment" ? "link" : 'primary'} shape='round' icon={<DownloadOutlined />}>Sample XLS </Button>
            </a>
        </div>
    )
}

export default ExcelFormate