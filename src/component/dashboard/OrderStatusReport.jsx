import React, { useEffect, useState } from "react";
import { AgChartsReact } from "ag-charts-react";
import { Card, DatePicker, message } from "antd";
import { fetchOrderStatusAnalytics } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import { BranchHook } from "../../pages/CustomHooks";

const OrderStatusReport = ({filterData}) => {
const { logout, token } = useAuth();
    const {startDate,endDate,branchId}=filterData

    const [orderStatus, setOrderStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    

    const [options, setOptions] = useState({
        data: [],
        title: {
            text: "Order Status",
        },
        subtitle: {
            text: "All Order Status Base Analytics",
        },
        series: [
            {
                type: 'bar',
                xKey: 'status',
                yKey: 'totalOrders',
                yName: 'Total Orders',
            }
        ],
        animation: {
            enabled: true,
            duration: 1000,
        },
    });

   

    const showOrderStatus = async () => {
        

        try {
            const res = await fetchOrderStatusAnalytics(token, startDate, endDate, branchId);
            if (res.status === 200) {
                const data = res.data.data;
                setOrderStatus(data);
                setOptions((prevOptions) => ({
                    ...prevOptions,
                    data: data,
                }));
                setIsLoading(true);
            } else if (res.data.code === 283) {
                message.error(res.data.message);
                logout();
            }
        } catch (err) {
            message.error(err.message);
        }
    };

    useEffect(() => {
      
            showOrderStatus();
        
    }, [filterData]);

    useEffect(() => {
        if (isLoading) {
            setOptions((prevOptions) => ({
                ...prevOptions,
                data: orderStatus,
            }));
        }
    }, [orderStatus, isLoading]);

    return (
        <Card >
            <AgChartsReact options={options} />
        </Card>
    );
};

export default OrderStatusReport;
