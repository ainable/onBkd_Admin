import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AgChartsReact } from "ag-charts-react";
import { fetchCustomerAnalytics } from "../../service/api_services";
import { Card, DatePicker, Empty, message } from "antd";
import { useAuth } from "../../authentication/context/authContext";

const TotalCustomer = () => {
    const { token, logout } = useAuth();
    const { RangePicker } = DatePicker;
    const [customerData, setCustomerData] = useState(null); // Start with null for clarity
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [options, setOptions] = useState({
        title: {
            text: "Customer Analytics",
        },
        data: {}, // Initialize as an empty array
        series: [
            {
                type: "pie",
                angleKey: "user",
                legendItemKey: "id",
            },
        ],
    });

    const handleDateRange = (date, dateString) => {
        console.log("date", date);
        console.log("year", dateString);
        setStartDate(dateString[0])
        setEndDate(dateString[1])
    };

    const showTotalCustomer = async () => {
        try {
            const res = await fetchCustomerAnalytics(token, startDate, endDate);
            if (res.status === 200) {
                const data = res.data.data;
                if (data) {
                    setCustomerData(data);
                    setOptions((prevOptions) => ({
                        ...prevOptions,
                        data: [
                            {
                                id: "Total Customer",
                                user: data.totalCustomer,

                            },
                            {
                                id: "Active Customer",
                                user: data.totalOrderedCustomer,

                            },

                        ],
                    }));
                }
                setIsLoading(true);
            } else if (res.data.code === 283) {
                message.error(res.data.message);
                logout();
            }
        } catch (error) {
            console.log(error.message);
            setIsLoading(true);
        }
    };

    useEffect(() => {
        showTotalCustomer();
    }, [startDate, endDate]);

    useEffect(() => {
        if (isLoading && customerData) {
            setOptions((prevOptions) => ({
                ...prevOptions,
                data: [
                    {
                        id: "Total Customer",
                        user: customerData?.totalCustomer,
                    },
                    {
                        id: "Active Customer",
                        user: customerData?.totalOrderedCustomer,
                    },
                ],
            }));
        }
    }, [customerData, isLoading]);

    return (
        <>
            {customerData ? (
                <AgChartsReact options={options} />
            ) : (
                <Empty />
            )}
        </>


    );
};

export default TotalCustomer;
