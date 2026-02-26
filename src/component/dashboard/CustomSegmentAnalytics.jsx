import React, { useEffect, useState } from "react";
import { AgChartsReact } from "ag-charts-react";
import { Card, DatePicker, Empty, message } from "antd";
import { fetchCategoryAnalytics, fetchSegmentAnalytics } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import { BranchHook } from "../../pages/CustomHooks";

const CustomSegmentAnalytics = ({filterData}) => {
    const { token, logout } = useAuth();
    const {startDate,endDate,branchId}=filterData

    const [customerData, setCustomerData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isAllZero = customerData.every((item) => item.totalOrder === 0);
    const [options, setOptions] = useState({
        title: {
            text: "Custom Segment Analytics",
        },
        data: [],
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

    

    const showCategoryAnalytics = async () => {
        try {
            const res = await fetchSegmentAnalytics(token, startDate, endDate);
            
            if (res.status === 200) {
                const data = res.data.data;
                if (data) {
                    setCustomerData(data);
                    setOptions((prevOptions) => ({
                        ...prevOptions,
                        data: data.map(item => ({
                            id: item.segmentName?.substr(0, 10),
                            user: item.totalOrder,
                            totalInPercent: `${item.totalInPercent}%`, // Keep it as a number
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
      
            showCategoryAnalytics();
        
    }, [filterData]);

    useEffect(() => {
        if (isLoading && customerData.length > 0) {
            setOptions((prevOptions) => ({
                ...prevOptions,
                data: customerData.map(item => ({
                    id: item.segmentName?.substr(0, 10),
                    user: item.totalOrder,
                    totalInPercent: `${item.totalInPercent}%`, // Ensure numerical
                })),
            }));
        }
    }, [customerData, isLoading]);

    return (
       
        <>
            {!isAllZero  ? (
                <AgChartsReact options={options} />
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                    <div>
                        <strong>Custom Segment Analytics</strong>
                        <p>no data</p>
                    </div>
                } />
            )}
        </>
    );
};



export default CustomSegmentAnalytics