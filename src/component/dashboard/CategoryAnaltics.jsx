import React, { useEffect, useState } from "react";
import { AgChartsReact } from "ag-charts-react";
import { Card, DatePicker, Empty, message } from "antd";
import { fetchCategoryAnalytics } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import { BranchHook } from "../../pages/CustomHooks";

const CategoryAnalytics = ({filterData}) => {
    const { token, logout } = useAuth();
    const {startDate,endDate,branchId}=filterData

    const [customerData, setCustomerData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [options, setOptions] = useState({
        title: {
            text: "Category Analytics",
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
            const res = await fetchCategoryAnalytics(token, startDate, endDate, branchId);
            if (res.status === 200) {
                const data = res.data.data;
                if (data) {
                    setCustomerData(data);
                    setOptions((prevOptions) => ({
                        ...prevOptions,
                        data: data.map(item => ({
                            id: item.categoryName?.substr(0, 10),
                            user: item.totalCount,
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
                    id: item.categoryName?.substr(0, 10),
                    user: item.totalCount,
                    totalInPercent: `${item.totalInPercent}%`, // Ensure numerical
                })),
            }));
        }
    }, [customerData, isLoading]);

    return (
        // <Card
        //     bordered={false}
        //     title={
        //         <div>
        //             <RangePicker format="DD/MM/YYYY" onChange={handleDateRange} />
        //         </div>
        //     }
        // >
        <>
            {customerData.length > 0 ? (
                <AgChartsReact options={options} />
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                    <div>
                        <strong>Category Analytics</strong>
                        <p>no data</p>
                    </div>
                } />
            )}
        </>
    );
};

export default CategoryAnalytics;
