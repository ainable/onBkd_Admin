import React from "react";
import { Breadcrumb, Button, Card, DatePicker, Form, Input, message, Modal, Radio, Select, Space, Statistic, Typography } from "antd";
import "./dashboard.css";

import { useLocation } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

import UserData from "./UserData";

import OrderStatusReport from "./OrderStatusReport";
import BrandAnalytics from "./BrandAnalytics";
import CategoryAnaltics from "./CategoryAnaltics";
import OfferAnalytics from "./OfferAnalytics";
import { useState } from "react";
import { BranchHook } from "../../pages/CustomHooks";
import { useAuth } from "../../authentication/context/authContext";
import CustomSegmentAnalytics from "./CustomSegmentAnalytics";
import { ExclamationCircleFilled } from '@ant-design/icons';
import { ExportCustomerDetailsReport, ExportCustomerReport, ExportDailyReport, ExportOrderHistoryReport, ExportNewCustomerReport } from "../../service/api_services";
const { confirm } = Modal;


function AdminDashboard() {
  const location = useLocation();
  const { token } = useAuth()
  const { branchList } = BranchHook(token);
  const { RangePicker } = DatePicker;
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [branchId, setBranchId] = useState(null)



  const handleDateRange = (date, dateString) => {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  };


  return (
    <section className="main_Section">
      <div className="dash_data">
        <Breadcrumb
          items={[
            {
              title: "Dashboard",
            },
            {
              title: location.pathname,
            },
          ]}
        />
        <Space>
          <RangePicker format="DD/MM/YYYY" onChange={handleDateRange} />
          <Select style={{ width: "220px" }} allowClear placeholder="Filter On Branch" onChange={(value) => setBranchId(value)}>
            {branchList?.map((item) => (

              <Select.Option key={item._id} value={item._id} label={`${item.branchCode}-${item.branchName}`}>
                ({item.branchCode})-{item.branchName}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </div>
      <div className="content_title">

        <div className="content_head">
        </div>
        <div className="content">
          <UserData />
          <div className="piChart">
            <Row>
              {/* <Col md={6}>
                <TotalCustomer filterData={
                  { startDate: startDate, endDate: endDate, branchId }
                }/>
              </Col> */}

            </Row>
            <Row>

              <Col md={4}>
                <BrandAnalytics filterData={
                  { startDate: startDate, endDate: endDate, branchId, branchId }
                } />
              </Col>
              <Col md={4}>
                <CategoryAnaltics filterData={
                  { startDate: startDate, endDate: endDate, branchId, branchId }
                } />
              </Col>
              <Col md={4}>
                <CustomSegmentAnalytics filterData={
                  { startDate: startDate, endDate: endDate, branchId }
                } />
              </Col>
            </Row>

          </div>
          <div className="graph_chart">
            <OrderStatusReport filterData={
              { startDate: startDate, endDate: endDate, branchId, branchId }
            } />
            <OfferAnalytics filterData={
              { startDate: startDate, endDate: endDate, branchId }
            } />
          </div>

        </div>
      </div>

    </section>
  );
}

export default AdminDashboard;
