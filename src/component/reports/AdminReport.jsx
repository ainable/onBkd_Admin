import { Breadcrumb, Button, Card, DatePicker, Form, Input, message, Select, Space, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../dashboard/dashboard.css'
import { ExportBrandReport, ExportSegmentWiseReport, ExportCategoryLeval, ExportCustomerReport, ExportDailyReport, ExportNewCustomerReport, ExportOfferOrder, ExportOldCustomerReport, ExportOrderHistoryReport, ExportSearchValueData, fetchOfferTypeData, ExportSearchKeywords } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';
import SelectedCategory from '../master/pool/SelectedCategory';
import SelectedBranch from './SelectedBranch';
import SelecteBrandData from '../productManage/SelectBrandData';
import SelectedSegment from './SelectedSegment';
import dayjs from "dayjs";
import ReportTable from './ReportTable';
import { allCustomerColumn, brandColumn, categoryColumn, dailyReportColumn, newCustomerColumn, offerColumn, oldCustomerColumn, orderHistoryColumn, searchKeywordColumn, searchProductColumn, segmentColumn } from './ColumnList';
function AdminReport() {
    const [form] = Form.useForm();
    const { token } = useAuth()
    const { RangePicker } = DatePicker;
    const [tableData, setTableData] = useState([])
    const [mobileNumber, setMobileNumber] = useState(null)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const [isReport, setIsReport] = useState(false)
    const [selectTab, setSelectTab] = useState(1)
    const [offerType, setOfferType] = useState([])
    const [categoryId, setCategoryId] = useState(null)
    const [branchId, setBranchId] = useState(null)
    const [offerId, setOfferId] = useState(null)
    const [brandId, setBrandId] = useState(null)
    const [segmentId, setSegmentId] = useState(null)


    const handleDateRange = (date, dateString) => {
        setStartDate(dateString[0]);
        setEndDate(dateString[1]);
    };

    const fetchOfferTypes = async () => {
        try {
            const res = await fetchOfferTypeData(token)
            console.log("fetchOfferTypeData", res)
            setOfferType(res.data.data.uniqueOffers)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (selectTab === "6") {
            fetchOfferTypes()
        }
    }, [selectTab === "6"])

    const fetchReport = async () => {
        setIsReport(true)
        const urlMap = {
            1: ExportDailyReport,
            2: ExportOrderHistoryReport,
            3: ExportCustomerReport,
            4: ExportNewCustomerReport,
            5: ExportCategoryLeval,
            6: ExportOfferOrder,
            7: ExportOldCustomerReport,
            8: ExportBrandReport,
            9: ExportSegmentWiseReport,
            10: ExportSearchValueData,
            11: ExportSearchKeywords
        };

        const selectedExportUrl = urlMap[selectTab];
        const args = [token, startDate, endDate];
        console.log("mobileNumber", mobileNumber)
        switch (selectTab) {
            case "3":
                args.push(mobileNumber || "");
                break;
            case "5":
                args.push(categoryId || "", branchId || "");
                break;
            case "6":
                args.push(categoryId || "", brandId || "", offerId || "");
                break;
            case "8":
                args.push(brandId || "");
                break;
            case "9":
                args.push(segmentId || "");
                break;
            case "10":
                args.push(categoryId || "");
                break;
            case "11":
                args.push(categoryId || "");
                break;
            default:
                break;
        }

        try {
            const res = await selectedExportUrl(...args);
            if (res.status === 200) {
                console.log("report", res)
                const fetchData = res.data.data;
                setTableData(fetchData.dataForTable)
                setIsReport(false)


            }

        } catch (error) {
            console.log(error)
            setIsReport(false)

        }
    }
    useEffect(() => {
        if (!startDate || !endDate) return; // always required
        if (selectTab === "9") {
            if (segmentId) {
                fetchReport();
            }
        } else {
            fetchReport();
        }
    }, [selectTab, startDate, endDate, mobileNumber, categoryId, branchId, brandId, segmentId, offerId]);



    const downloadReportHandler = async (value) => {
        // console.log("body", value)
        const urlMap = {
            1: ExportDailyReport,
            2: ExportOrderHistoryReport,
            3: ExportCustomerReport,
            4: ExportNewCustomerReport,
            5: ExportCategoryLeval,
            6: ExportOfferOrder,
            7: ExportOldCustomerReport,
            8: ExportBrandReport,
            9: ExportSegmentWiseReport,
            10: ExportSearchValueData,
            11: ExportSearchKeywords
        };

        const selectedExportUrl = urlMap[selectTab];
        setIsLoading(true)
        const args = [token, startDate, endDate];

        switch (selectTab) {
            case "3":
                args.push(value?.userMobileNo);

                break;
            case "5":
                args.push(value?.categoryId, value?.branchCode);
                break;
            case "6":
                args.push(value?.categoryId, value?.brnadId, value?.offerType);
                break;
            case "8":
                args.push(value?.brnadId);
                break;
            case "9":
                args.push(value?.staticCustomSegmentId);
                break;
            case "10":
                args.push(value?.categoryId);
                break;
            case "11":
                args.push(value?.categoryId);
                break;
            default:
                break;
        }


        try {
            const res = await selectedExportUrl(...args);
            if (res.status === 200) {
                console.log("report", res)
                const fetchData = res.data.data;
                const fileUrl =
                    fetchData?.dailyReportExcel ||
                    fetchData?.customerReportExcel ||
                    fetchData?.orderHistoryExcel ||
                    fetchData?.newCustomerExcel ||
                    fetchData?.categoryLevelsExcel ||
                    fetchData?.offerExcel ||
                    fetchData?.oldCustomerExcel ||
                    fetchData?.segmentWiseReportExcel ||
                    fetchData?.categoryLevelsExcel ||
                    fetchData?.keywordWiseSearchExcel ||
                    fetchData?.brandReportExcel
                message.success(res.data.message);
                setIsLoading(false)

                if (fileUrl) {
                    window.open(fileUrl, "_blank");
                }

            }

        } catch (error) {
            console.log(error)
            setIsLoading(false)

        }
    }


    const filterForm = () => {
        return (

            <Form form={form}
                onFinish={downloadReportHandler}
                layout="vertical">
                <div className='reportTable'>
                    <Form.Item
                        label="Please Select Date Range"
                        name="range"
                        rules={[{ required: true, message: "Please Select Date" }]}
                    >
                        <RangePicker size="large" format="DD/MM/YYYY" onChange={handleDateRange}
                            disabledDate={(current) => current && current > dayjs().endOf("day")}
                        />
                    </Form.Item>

                    {selectTab === "3" && <Form.Item
                        label="Customer Mobile No."
                        name="userMobileNo"
                    >
                        <Input size='large' allowClear placeholder="Enter Mobile No." onChange={(e) => setMobileNumber(e.target.value)}
                        />
                    </Form.Item>}
                    {(selectTab === "5" || selectTab === "6" || selectTab === "10" || selectTab === "11") && (
                        <SelectedCategory setCategoryId={setCategoryId} isFilter={true} />
                    )}
                    {(selectTab === "5") && (
                        <SelectedBranch setBranchId={setBranchId} isFilter={true} />
                    )}
                    {selectTab === "8" || selectTab === "6" && <SelecteBrandData setBrandId={setBrandId} isFilter={true} />}
                    {selectTab === "9" && <SelectedSegment setSegmentId={setSegmentId} />}
                    {selectTab === "6" && <Form.Item label="Select Offer" name="offerType">
                        <Select placeholder="Select Offer type" size='large' allowClear onChange={(value) => setOfferId(value)}>
                            {offerType?.map((opt, index) => (<Select.Option key={index} value={opt}>{opt}</Select.Option>))}
                        </Select>
                    </Form.Item>}
                    <Form.Item label="Export Excel File">
                        <Button size='large' loading={isLoading} type='primary' htmlType='submit' shape='round' >Export </Button>
                    </Form.Item>
                </div>

            </Form >
        )
    }

    const reportTypes = [
        {
            id: 1,
            title: " Daily Report",
            content: <ReportTable column={dailyReportColumn} tableData={tableData} filterForm={filterForm} isReport={isReport} />

        },
        {
            id: 2,
            title: " Order History",
            content: <ReportTable column={orderHistoryColumn} tableData={tableData || []} filterForm={filterForm} isReport={isReport} />


        },
        {
            id: 3,
            title: "All Customer ",
            content: <ReportTable column={allCustomerColumn} tableData={tableData} filterForm={filterForm} isReport={isReport} />


        },
        {
            id: 4,
            title: "New Customer ",
            content: <ReportTable column={newCustomerColumn} tableData={tableData} filterForm={filterForm} isReport={isReport} />


        },
        {
            id: 5,
            title: "Category Level  ",
            content: <ReportTable column={categoryColumn} tableData={tableData} filterForm={filterForm} isReport={isReport} />


        },
        {
            id: 6,
            title: "Offer Order",
            content: <ReportTable column={offerColumn} tableData={tableData} filterForm={filterForm} isReport={isReport} />
        },
        {
            id: 7,
            title: "Old Customer",
            content: <ReportTable column={oldCustomerColumn} tableData={tableData} filterForm={filterForm} isReport={isReport} />
        },
        {
            id: 8,
            title: "Brand Report",
            content: <ReportTable column={brandColumn} tableData={tableData} filterForm={filterForm} isReport={isReport} />
        },
        {
            id: 9,
            title: "Custom Segment ",
            content: <ReportTable column={segmentColumn} tableData={tableData} filterForm={filterForm} isReport={isReport} />
        },
        {
            id: 10,
            title: "Search Product  ",
            content: <ReportTable column={searchProductColumn} tableData={tableData} filterForm={filterForm} isReport={isReport} />


        },
        {
            id: 11,
            title: "Search Keyword  ",
            content: <ReportTable column={searchKeywordColumn} tableData={tableData} filterForm={filterForm} isReport={isReport} />

        },
    ]

    const handleTabValue = (key) => {
        setSelectTab(key)
        setStartDate("")
        setEndDate("")
        setCategoryId(null)
        setBranchId(null)
        setBrandId(null)
        setOfferId(null)
        setSegmentId(null)
        setTableData([])
        form.resetFields();
    }
    return (
        <section className="main_Section">
            <div className="dash_data">
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
            </div>
            <div className="content_titles">
                <div className='reports'>
                    <Tabs tabPosition='left' defaultActiveKey="1" onChange={handleTabValue}>
                        {reportTypes.map((item) => (
                            <Tabs.TabPane tab={item.title} key={item.id}>
                                <div>{item.content}</div>
                            </Tabs.TabPane>
                        ))}
                    </Tabs>
                </div>
            </div>
        </section>
    )
}

export default AdminReport