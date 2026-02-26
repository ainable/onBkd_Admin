import React, { useEffect, useState } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import { Card, DatePicker, message } from 'antd';
import { fetchOfferOrderAnalytics } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';
import moment from 'moment';

const OfferAnalytics = ({filterData}) => {
    const { logout, token } = useAuth();
    const {startDate,endDate,branchId}=filterData

    const [bookingData, setBookingData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
   
    const [options, setOptions] = useState({
        title: {
            text: "Offer Order",
        },
        subtitle: {
            text: 'Offer Base Order Analytics',
        },
        data: [],
        series: [],
        animation: {
            enabled: true,
            duration: 1000,
        },
    });

    const showServiceBookingChart = async () => {
        try {
            const res = await fetchOfferOrderAnalytics(token, startDate, endDate);
            console.log("offer analytics", res);
            if (res.status === 200) {
                const data = res.data.data;
                setBookingData(data);

                const seriesData = [
                    {
                        type: 'bar',
                        xKey: 'categoryName', // Use categoryName for the X-axis
                        yKey: 'totalCount',    // Use totalCount for the Y-axis
                        yName: 'Offer Name',   // Name for the legend
                        label: {
                            enabled: true,
                            formatter: ({ datum }) => `${datum.totalInPercent}%`, // Display percentage next to the bar
                        },
                    },
                ];

                setOptions((prevOptions) => ({
                    ...prevOptions,
                    data: data, // Use the fetched data directly
                    series: seriesData,
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
        showServiceBookingChart();
    }, [filterData]);

    useEffect(() => {
        if (isLoading) {
            setOptions((prevOptions) => ({
                ...prevOptions,
                data: bookingData, // Ensure bookingData is directly used here
            }));
        }
    }, [bookingData, isLoading]);

    return (
        <div className="book_charts">
            <Card>
                <AgChartsReact options={options} />
            </Card>
        </div>
    );
};

export default OfferAnalytics;
