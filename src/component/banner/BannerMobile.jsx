import React, { useEffect, useState } from "react";
import { Badge, Breadcrumb, Button, Card, Divider, Empty, Image, Popconfirm, Select, Statistic, Typography, message } from "antd";
import '../../style/banner.css'
import { useLocation } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { Col, Row } from "react-bootstrap";
import AddBanner from "./AddBanner";
import { deleteBanner, fetchBannerList } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import { MdOutlineDeleteOutline } from "react-icons/md";
import UpdateBanner from "./UpdateBanner";
// import AddProduct from "./AddProduct";







function BannerMobile({ bannerList, ShowAllBannerList, isLoading }) {
    const location = useLocation();
    const { token } = useAuth()

    const delelteBannerHandler = async (id) => {
        const body = {
            bannerId: id,
        }
        try {
            await deleteBanner(token, body)
                .then((res) => {
                    console.log("  banner delete ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        ShowAllBannerList()
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
        }
    }


    const cancel = (e) => {
        console.log(e);
        message.error('Click on No');
    };

    return (
        <section className="main_Section">
            <div className="content">
                <div className="banner_list">
                    <Row>

                        {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : bannerList.length == 0 ? <Empty /> : bannerList.map((ban) => (
                            <Col md={4}>
                                <div className="banner_card">
                                    <Card


                                        actions={[<UpdateBanner bannerItem={ban} ShowAllBannerList={ShowAllBannerList} />,
                                        <Popconfirm
                                            title="Delete the Banner"
                                            description="Are you sure to delete this Banner?"
                                            onConfirm={() => delelteBannerHandler(ban._id)}
                                            onCancel={cancel}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <MdOutlineDeleteOutline className="remove_icon" />
                                        </Popconfirm>]}
                                        hoverable
                                        cover={<img alt="example" src={ban.bannerImage} />} // Replace the image source with your actual image URL
                                    >

                                        <Card.Meta title={<span>{ban.navigateTo}</span>}
                                            description={<div>
                                                <p> {ban.navigateToName}</p>
                                            </div>} />

                                    </Card>
                                </div>
                            </Col>
                        ))}

                    </Row>
                </div>
            </div>
        </section>
    );
}

export default BannerMobile