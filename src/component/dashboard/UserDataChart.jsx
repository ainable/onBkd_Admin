'use strict';

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { AgChartsReact } from 'ag-charts-react';
import { getUserData } from './ChatData';
import { Card } from 'antd';

const UserDataChart = () => {
    const [options, setOptions] = useState({
        data: getUserData(),
        title: {
            text: 'User Data in Week',
        },
        series: [
            {
                type: 'pie',
                calloutLabelKey: 'asset',
                angleKey: 'amount',
                innerRadiusRatio: 0.7,
            },
        ],
    });



    return (
        <div>
            <Card>
                <AgChartsReact options={options} style={{ width: "100px" }} />
            </Card>
        </div>
    )
};


export default UserDataChart

