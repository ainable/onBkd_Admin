
'use strict';

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { AgChartsReact } from 'ag-charts-react';
import { getData } from './ChatData';
import { Card } from 'antd';

const BookingChart = () => {
    const [options, setOptions] = useState({
        title: {
            text: "All Booking as a service ",
        },
        subtitle: {
            text: 'In Indian Rupess',
        },
        data: getData(),
        series: [
            {
                type: 'bar',
                xKey: 'quarter',
                yKey: 'iphone',
                yName: 'iPhone',
            },
            {
                type: 'bar',
                xKey: 'quarter',
                yKey: 'mac',
                yName: 'Mac',
            },
            {
                type: 'bar',
                xKey: 'quarter',
                yKey: 'ipad',
                yName: 'iPad',
            },
            {
                type: 'bar',
                xKey: 'quarter',
                yKey: 'wearables',
                yName: 'Wearables',
            },
            {
                type: 'bar',
                xKey: 'quarter',
                yKey: 'services',
                yName: 'Services',
            },
        ],
    });

    

    return <AgChartsReact options={options} />
};


export default BookingChart