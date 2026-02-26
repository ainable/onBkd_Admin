import React from "react";
import { Card, Empty, Popconfirm, message } from "antd";
import '../../style/banner.css'
import { Col, Row } from "react-bootstrap";
import { deleteOfferBanner } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import { MdOutlineDeleteOutline } from "react-icons/md";
import UpdateOfferImage from "./UpdateOfferImage";

const { Meta } = Card;

function OfferImageList({ bannerList, ShowAllOfferBannerList, isLoading }) {
    const { token } = useAuth()

    const delelteBannerHandler = async (id) => {
        const body = {
            bannerId: id,
        }
        try {
            await deleteOfferBanner(token, body)
                .then((res) => {
                    if (res.status == 201) {
                        message.success(res.data.message);
                        ShowAllOfferBannerList()
                    }
                })
                .catch((err) => {
                    message.error(err.message);
                });
        } catch (error) {
            message.error(error);
        }
    }

    return (
        <section className="main_Section">
            <div className="content">
                <div className="banner_list">
                    <Row>
                        {!isLoading ?
                            <div className="loader_main"> <span class="loader2"></span></div>
                            :
                            bannerList.length == 0 ?
                                <Empty />
                                :
                                bannerList.map((ban) => (
                                    <Col md={4}>
                                        <div className="banner_card">
                                            <Card
                                                actions={[
                                                    <UpdateOfferImage bannerItem={ban} ShowAllOfferBannerList={ShowAllOfferBannerList} />,
                                                    <Popconfirm
                                                        title="Delete the Image"
                                                        description="Are you sure to delete this Image?"
                                                        onConfirm={() => delelteBannerHandler(ban._id)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <MdOutlineDeleteOutline className="remove_icon" />
                                                    </Popconfirm>]}
                                                hoverable
                                                cover={<img alt="example" src={ban.bannerImage} />}
                                            >
                                                <Meta
                                                    title={ban.navigateTo}
                                                    description={<div><p>{ban.navigateToName}</p></div>}
                                                />
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

export default OfferImageList