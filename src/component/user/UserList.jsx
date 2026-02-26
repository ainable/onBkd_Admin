


import React, { useEffect, useState, useCallback } from "react";
import { Avatar, Breadcrumb, Button, Card, Descriptions, Empty, Image, Pagination, Statistic, Typography, message, Form, Input, DatePicker, Tooltip } from "antd";
import '../../style/master.css';
import { useLocation, useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { fetchAllUserList, fetchUserDetails, updateAllUserReferralCode } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import { FaRegUser, FaUser } from "react-icons/fa";
import { jsonToCSV, usePapaParse } from 'react-papaparse';
import moment from "moment";

import { SearchOutlined, CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import _ from 'lodash'; // Import lodash
import { CSVLink } from 'react-csv'; // Import the CSVLink component
import ExportData from "./ExportData";
import ViewRating from "./ViewRating";


const { Title } = Typography;



function UserList() {
  const { RangePicker } = DatePicker;

  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(null);
  const [current, setCurrent] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [refreshLoading, setRefreshLoading] = useState(false);

  const handleCopyReferralCode = (code) => {
    navigator.clipboard.writeText(code);
    message.success('Referral code copied!');
  };

  const columns = [
    {
      title: ' Customer ID',
      dataIndex: '_id',
      key: '_id',
      ellipsis: true,
      render: _id => (
        <Tooltip title={_id}>
          <strong>...{_id.slice(-6)}</strong>
        </Tooltip>
      )
    },
    {
      title: 'Image',
      dataIndex: 'profilePic',
      key: 'profilePic',
      render: (_, { profilePic }) => (
        <div className="show_cat_img">
          {profilePic != null ? <Image src={profilePic} width={50} height={50} style={{ borderRadius: "100%", objectFit: "contain", background: "lightGray" }} /> : <Avatar size={45} icon={<FaRegUser className="pro_icon" />} />}
        </div>
      )
    },
    {
      title: ' Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: ' Number',
      dataIndex: 'mobileNo',
      key: 'mobileNo',
    },
    {
      title: ' Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => email != null ? email : "N/A"
    },
    {
      title: ' Total Order',
      dataIndex: 'totalOrder',
      key: 'totalOrder',
      ellipsis: true,

    },
    {
      title: 'Total Revenue',
      dataIndex: 'totalCompletedOrderRevenue',
      key: 'totalCompletedOrderRevenue',
      ellipsis: true,

    },
    {
      title: ' Delivery Partner Rating',
      dataIndex: 'totalVendorRating',
      key: 'totalVendorRating',
      ellipsis: true,

    },
    {
      title: ' Product Rating',
      dataIndex: 'totalProductRating',
      key: 'totalProductRating',
      ellipsis: true,

    },
    // {
    //   title: ' City',
    //   dataIndex: 'city',
    //   key: 'city',
    // },
    // {
    //   title: ' State',
    //   dataIndex: 'state',
    //   key: 'state',
    // },
    {
      title: ' Address',
      dataIndex: 'userLocationInfo',
      key: 'userLocationInfo',
      ellipsis: true,
      render: userLocationInfo => (
        <Tooltip title={userLocationInfo?.area}>
          <span>{userLocationInfo?.area != null ? <span>{userLocationInfo?.area.substr(0, 24)}...</span> : "N/A"}</span>
        </Tooltip>
      )
    },
    {
      title: 'Referral Code',
      dataIndex: 'referralCode',
      key: 'referralCode',
      ellipsis: true,
      render: (referralCode) => (
        referralCode ? (
          <Space>
            <span>{referralCode}</span>
            <CopyOutlined style={{ cursor: 'pointer' }} onClick={() => handleCopyReferralCode(referralCode)} />
          </Space>
        ) : 'N/A'
      )
    },
    {
      title: 'Created At',
      dataIndex: 'addedDate',
      key: 'addedDate',
      ellipsis: true,

      render: addedDate => new Date(addedDate).toLocaleDateString()
    },
    {
      title: 'Action',
      dataIndex: '_id',
      key: '_id',
      fixed: "right",
      render: (_id) => (
        <Space>
          <Button shape="round" className="view_details" onClick={() => navigate(`/dashboard/user-details/${_id}`)}> View</Button>
          <ViewRating userId={_id} />
        </Space>
      )
    },
  ];

  const onChange = (page) => {
    setCurrent(page);
    setIsLoading(true);
  };


  const limit = 25
  const fetchAllUsers = async () => {
    try {
      const res = await fetchAllUserList(token, current, limit, searchInput, startDate, endDate);
      if (res.status === 200) {
        setUserData(res.data.data.data);
        setTotalPage(res.data.data.totalPage);
        setIsLoading(true);
      } else if (res.data.code === 283) {
        message.error(res.data.message);
        logout();
      }
    } catch (error) {
      console.log(error);
      setIsLoading(true);
    }
  };

  const debouncedFetchAllUsers = useCallback(_.debounce(fetchAllUsers, 1000), [current, searchInput, startDate]);

  useEffect(() => {
    debouncedFetchAllUsers();
    return () => {
      debouncedFetchAllUsers.cancel();
    };
  }, [debouncedFetchAllUsers]);


  const handelDatePicker = (dates, dateStrings) => {
    console.log('Selected dates:', dateStrings);
    setStartDate(dateStrings[0])
    setEndDate(dateStrings[1])
  };

  const disabledDate = (current) => {
    // Disable future dates
    return current && current > moment().endOf('day');
  };



  // Handler for refreshing referral codes
  const handleRefreshReferralCode = async () => {
    setRefreshLoading(true);
    try {
      const res = await updateAllUserReferralCode(token);
      if (res.status === 200) {
        message.success("Referral codes refreshed successfully.");
        fetchAllUsers(); // Optionally refresh user list
      } else {
        message.error(res.data?.message || "Failed to refresh referral codes.");
      }
    } catch (error) {
      message.error("Error refreshing referral codes.");
    }
    setRefreshLoading(false);
  };

  return (
    <section className="main_Section">
      <Breadcrumb
        items={[
          { title: "Dashboard" },
          { title: location.pathname },
        ]}
      />
      <div className="content_title">
        <div className="content_head">
          <div className="content_title">
            <Title level={4}>CUSTOMER LIST</Title>
          </div>
          <div className="content_add">
            <Space>
              <RangePicker onChange={handelDatePicker} disabledDate={disabledDate} format="DD/MM/YYYY" />
              <Input
                style={{ width: '200px' }}
                allowClear
                placeholder="Search Name & Number"
                suffix={<SearchOutlined />}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <ExportData />
              <Button type="primary" onClick={handleRefreshReferralCode} loading={refreshLoading} icon={refreshLoading ? <LoadingOutlined /> : null}>
                Refresh Referral Code
              </Button>
            </Space>
          </div>
        </div>
        <div className="content">
          <div className="shoo_recent_order">
            {!isLoading ? (
              <div className="loader_main">
                <span className="loader2"></span>
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={userData}
                scroll={{ x: true }}
                pagination={false}
                footer={() => (
                  <div className="pagination">
                    <Pagination current={current} onChange={onChange} total={totalPage * 10} />
                  </div>
                )}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserList;
