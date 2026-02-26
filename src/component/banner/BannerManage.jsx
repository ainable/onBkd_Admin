import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Divider, Empty, Image, Popconfirm, Segmented, Select, Statistic, Typography, message } from "antd";
import '../../style/banner.css'
import { useLocation } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { Col, Row } from "react-bootstrap";
import AddBanner from "./AddBanner";
import { deleteBanner, fetchBannerList } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import { MdOutlineDeleteOutline } from "react-icons/md";
import UpdateBanner from "./UpdateBanner";
import BannerWebsite from "./BannerWebsite";
import BannerMobile from "./BannerMobile";
// import AddProduct from "./AddProduct";
const { Title } = Typography;
const { Meta } = Card;






function BannerManage() {
    const location = useLocation();
    const { token } = useAuth()
    const [bannerList, setBannerList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [viewType, setViewType] = useState("WEB")


    const ShowAllBannerList = async () => {
        try {
            await fetchBannerList(token, viewType)
                .then((res) => {
                    console.log(" all banner list ", res);
                    if (res.status == 200) {
                        setBannerList(res.data.data);
                        setIsLoading(true)
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
        ShowAllBannerList()
    }, [viewType])

   
    let bannerSegment;

    if (viewType === "WEB") {
        bannerSegment = <BannerWebsite bannerList={bannerList} isLoading={isLoading} ShowAllBannerList={ShowAllBannerList} />
    } else if (viewType === "MOBILE") {
        bannerSegment = <BannerMobile bannerList={bannerList} isLoading={isLoading} ShowAllBannerList={ShowAllBannerList}/>
    }

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
                    <div className="content_titles">
                        <div className="hear_title">
                            <Title level={4}> Banner List</Title>

                        </div>


                    </div>
                    <Space>
                        <div className="order_status_action">
                            <Segmented options={["WEB", "MOBILE"]} onChange={(value) => {
                                setViewType(value);
                                console.log(value); // string
                            }} />
                        </div>
                        <div className="content_add">
                            <AddBanner ShowAllBannerList={ShowAllBannerList} />
                        </div>
                    </Space>
                </div>
                <div className="content">
                    {bannerSegment}
                </div>


            </div>

        </section>
    );
}







export default BannerManage