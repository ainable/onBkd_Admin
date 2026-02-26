import React, { useEffect, useState } from "react";
import { AgChartsReact } from "ag-charts-react";
import { Card, DatePicker, Empty, message } from "antd";
import { fetchBrandAnalytics } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import { BranchHook } from "../../pages/CustomHooks";

const BrandAnalytics = ({ filterData }) => {
    const { token, logout } = useAuth();
    const { startDate, endDate, branchId } = filterData

    const [customerData, setCustomerData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [options, setOptions] = useState({
        title: {
            text: "Brand Analytics",
        },
        data: [], // Initialize as an empty array for storing chart data
        series: [
            {
                type: "pie",
                angleKey: "user",
                legendItemKey: "id",
                calloutLabelKey: 'totalInPercent',

                sectorLabel: {
                    color: 'white',
                    fontWeight: 'bold',
                },
                innerRadius: 50, // Adjust this to control the inner radius of the pie chart
                outerRadius: 100,
            },
        ],
    });



    const showBrandAnalytics = async () => {

        try {
            const res = await fetchBrandAnalytics(token, startDate, endDate, branchId);
            if (res.status === 200) {
                const data = res.data.data;
                if (data) {
                    setCustomerData(data);
                    setOptions((prevOptions) => ({
                        ...prevOptions,
                        data: data.map(item => ({
                            id:item.brandName,
                            user: item.totalCount,
                            totalInPercent: `${item.totalInPercent}%`,
                        })),
                    }));
                }
                setIsLoading(true);
            } else if (res.data.code === 283) {
                message.error(res.data.message);
                logout();
            }
        } catch (error) {
            console.error(error.message);
            setIsLoading(true);
        }
    };

    useEffect(() => {

        showBrandAnalytics();

    }, [filterData]); // Include defaultBranchId

    useEffect(() => {
        if (isLoading && customerData) {
            setOptions((prevOptions) => ({
                ...prevOptions,
                data: customerData.map(item => ({
                    id: item.brandName,
                    user: item.totalCount,
                    totalInPercent: `${item.totalInPercent}%`,

                })),
            }));
        }
    }, [customerData, isLoading]);

    return (
        <>

            {customerData?.length > 0 ? ( // Check if data length is greater than 0
                <AgChartsReact options={options} />
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                    <div>
                        <strong>Brand Analytics</strong>
                        <p>no data</p>
                    </div>
                } />
            )}
        </>
        // <Card
        // style={{  margin: "0 auto" }}
        //     bordered={false}
        //     title={
        //         <div>
        //             <RangePicker format="DD/MM/YYYY" onChange={handleDateRange} />
        //         </div>

        //     }
        // >


    );
};

export default BrandAnalytics;
