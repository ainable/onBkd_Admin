import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AgChartsReact } from "ag-charts-react";
import { revenueData } from "./ChatData";
import { Card } from "antd";
import './dashboard.css'

const Revenue = () => {
    const [options, setOptions] = useState({
        title: {
            text: "Six Month Order Delivered Succcessfully",
        },
        data: revenueData(),
        series: [
            {
                type: "line",
                xKey: "monthly",
                yKey: "OrderDeliver",
                yName: "Order Deliver",
            },
            {
                type: "line",
                xKey: "monthly",
                yKey: "Storepickup",
                yName: "Store pickup",
            },
        ],
    });

    return (
        <div className="revanueGraph">
            <Card >

                <AgChartsReact options={options} />;
            </Card>
        </div>
    )
};




export default Revenue