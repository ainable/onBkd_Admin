import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Checkbox, Statistic, Switch, Typography, message } from "antd";
import '../../style/location.css'
import { useLocation, useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import AddBranch from "./AddBranch";
import { Col, Row } from "react-bootstrap";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { fetchAllBranchList } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import ShowMoreText from 'react-show-more-text';

import { MdKeyboardBackspace } from "react-icons/md";
import BranchAuthentication from "./BranchAuthentication";
import EditBranch from "./EditBranch";
const { Meta } = Card;


const { Title } = Typography;




function BranchManage() {
    const navigate = useNavigate()
    const location = useLocation();
    const { token, logout } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [brandList, setBranchList] = useState(false)
    const [IsAutharize, setIsAutharize] = useState(false)
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


    const shhowAllBranchList = async () => {
        try {
            await fetchAllBranchList(token)
                .then((res) => {
                    console.log(" all branch list ", res);
                    if (res.status == 200) {
                        setBranchList(res.data.data.data);
                        // setTotalPage(res.data.data.totalPage)
                        setIsLoading(true)
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()

                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
            setIsLoading(true)
        }
    };

    useEffect(() => {
        shhowAllBranchList();
    }, []);
    // const handleClick = (location) => {
    //     // Open Google Maps in a new tab with the specified latitude and longitude
    //     window.open(`https://www.google.com/maps?q=${location.coordinates[0]},${location.coordinates[1]}`);
    //   };


    return (
        <section className="main_Section">
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
            <div className="content_title">
                <div className="content_head">
                    <div className="content_title">

                        <Title level={4}>
                        Manage Branches</Title>


                    </div>
                    <div className="content_add">
                        <AddBranch shhowAllBranchList={shhowAllBranchList} />

                    </div>
                </div>
                <div className="Branch_content">
                    <div className={isLoading ? "show_all_branch_list" :""}>
                        {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : brandList.map((item) => (
                            <Card
                                actions={[<BranchAuthentication branchData={item} shhowAllBranchList={shhowAllBranchList} />, <EditBranch branchData={item} shhowAllBranchList={shhowAllBranchList} />]}
                                hoverable
                                bordered
                                cover={
                                    <img
                                        alt="example"
                                        src={item.branchImage}
                                        id="branch_img"
                                        onClick={() => navigate(`/dashboard/branch-details/${item._id}`)}
                                    />
                                }
                            >

                                <Meta 
                                        onClick={() => navigate(`/dashboard/branch-details/${item._id}`)}

                                    // avatar={<Avatar src={item.url} />}
                                    title={<div className="branch_name"><p>{capitalize(item.branchName)}</p>


                                        <p>({capitalize(item.area)})</p></div>}
                                    description={<div className="branch_des">
                                        <p>Branch Code : {item.branchCode}</p>
                                        <ShowMoreText
                                            lines={1}
                                            more={<span className="viewMore"> more</span>}
                                            less={<span className="viewMore"> less</span>}

                                            anchorClass="show-more-less-clickable"
                                            expanded={false}
                                            truncatedEndingComponent={"... "}
                                        >
                                            {capitalize(item.fullAddress) } 
                                        </ShowMoreText>
                                        <p>{capitalize(item.state)}</p>

                                    </div>}
                                />
                            </Card>
                        ))}
                    </div>
                </div>


            </div>

        </section>
    );
}




export default BranchManage