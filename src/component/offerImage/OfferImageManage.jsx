import React, { useEffect, useState } from "react";
import { Breadcrumb, message, Typography } from "antd";
import '../../style/banner.css'
import { Space } from 'antd';
import { fetchOfferBannerList } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import OfferImageList from "./OfferImageList";
import AddOfferImage from "./AddOfferImage";

const { Title } = Typography;

function OfferImageManage() {
    const { token } = useAuth()
    const [offerBannerList, setOfferBannerList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [viewType, setViewType] = useState("WEB")

    const ShowAllOfferBannerList = async () => {
        try {
            await fetchOfferBannerList(token, viewType)
                .then((res) => {
                    console.log(" all banner list ", res);
                    if (res.status == 200) {
                        setOfferBannerList(res.data.data);
                        setIsLoading(true)
                    }
                })
                .catch((err) => {
                    message.error(err.message);
                    setIsLoading(true)
                });
        } catch (error) {
            message.error(error);
            setIsLoading(true)
        }
    };

    useEffect(() => {
        ShowAllOfferBannerList()
    }, [])

    return (
        <section className="main_Section">
            <Breadcrumb
                items={[
                    {
                        title: <a style={{ textDecoration: 'none' }} href="/dashboard">Dashboard</a>,
                    },
                    {
                        title: "Offer Image",
                    },
                ]}
            />
            <div className="content_title">
                <div className="content_head">
                    <div className="content_titles">
                        <div className="hear_title">
                            <Title level={4}>Offer Image List</Title>
                        </div>
                    </div>
                    <Space>
                        <div className="content_add">
                            <AddOfferImage ShowAllOfferBannerList={ShowAllOfferBannerList} />
                        </div>
                    </Space>
                </div>
                <div className="content">
                    <OfferImageList bannerList={offerBannerList} isLoading={isLoading} ShowAllOfferBannerList={ShowAllOfferBannerList} />
                </div>
            </div>
        </section>
    );
}







export default OfferImageManage