"use strict";

import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import "ag-charts-enterprise";
import { AgChartsReact } from "ag-charts-react";
import { getProductData } from "./ChatData";
import { Card } from "antd";

const ProductData = () => {
  const [options, setOptions] = useState({
    data: getProductData(),
    title: {
      text: "Product Parts Selling",
    },
    subtitle: {
      text: "Low and High Selling Spare part",
    },
    series: [
      {
        type: "range-bar",
        xKey: "department",
        yLowKey: "low",
        yHighKey: "high",
      },
    ],
  });

  return (
    <div>
      <Card>
        <AgChartsReact options={options} />
      </Card>
    </div>
  );

};

export default ProductData;
