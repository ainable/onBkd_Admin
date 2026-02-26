'use strict';

import React, { useState } from 'react';

import 'ag-charts-enterprise';
import { AgChartsReact } from 'ag-charts-react';
import { getVendorData } from './ChatData';
import { Card } from 'antd';

const VendorServices = () => {
    const [options, setOptions] = useState({
        data: getVendorData(),
        
        title: {
            text: 'Revenue by Product Category',
        },
        subtitle: {
            text: 'Millions USD',
        },
        series: [
            {
                type: 'radial-bar',
                radiusKey: 'quarter',
                angleKey: 'software',
                angleName: 'Software',
            },
            {
                type: 'radial-bar',
                radiusKey: 'quarter',
                angleKey: 'hardware',
                angleName: 'Hardware',
            },
            {
                type: 'radial-bar',
                radiusKey: 'quarter',
                angleKey: 'services',
                angleName: 'Services',
            },
        ],
    });

    

    return <AgChartsReact options={options} className="charts"/>
};

export default VendorServices