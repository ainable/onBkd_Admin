import React from "react";
import { Breadcrumb, Button, Card, Divider, Image, Select, Statistic, Typography } from "antd";
import '../../style/banner.css'
import { useLocation } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { Col, Row } from "react-bootstrap";
const { Title } = Typography;
const { Meta } = Card;


const BannerData = [
    {
        id: 1,
        title: "Sweet & chocolate ",
        offer: "20% of  for diwali offer",
        url: "https://sweetandsouronline.com/wp-content/uploads/2022/02/Products-mix.png"
    },
    {
        id: 2,
        title: "24 Mantra Organic 7 Grain Atta",
        offer: "20% of  for diwali offer",
        url: "https://www.bigbasket.com/media/uploads/p/xxl/40189426_3-super-saver-wheat-flour-atta.jpg"
    },
    {
        id: 3,
        title: "Baby Care & parsonal care ",
        offer: "20% of  for diwali offer",
        url: "https://media.licdn.com/dms/image/C5612AQEfAXV0zEtORA/article-cover_image-shrink_600_2000/0/1634981984613?e=2147483647&v=beta&t=anWxtp7yTwgZbf8KhfdAshJf_-r6QZ_099W-lucMeWw"
    },
    {
        id: 4,
        title: "Natural Tattva Rock Salt / Sendha Namak ",
        offer: "20% of  for diwali offer",
        url: "https://www.bigbasket.com/media/uploads/p/xxl/40289044-2_2-tata-salt-immuno-edible-common-salt-wwith-zinc-iodine.jpg"
    },
]




function Notifications() {


    const location = useLocation();

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
                            <Title level={4}>All Notification</Title>

                        </div>


                    </div>
                  
                </div>
                <div className="content">
                   
                </div>


            </div>

        </section>
    );
}








export default Notifications