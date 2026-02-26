import React, { useState } from 'react';
import { Avatar, Button, Empty, List, message, Modal, Rate, Space, Tag } from 'antd';
import { deleteUserReview, fetchUserRating } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';


const ViewRating = ({ userId }) => {

    const { token, logout } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRating, setUserRating] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [totalPage, setTotalPage] = useState(null)

    const showModal = () => {
        setIsModalOpen(true);
        showUserRatings()
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showUserRatings = async () => {
        setIsLoading(true);

        try {
            const res = await fetchUserRating(token, userId);
            console.log("user rating", res)
            if (res.status === 200) {
                setUserRating(res.data.data);
                // setTotalPage(res.data.data.totalPage);
                setIsLoading(false);
            } else if (res.data.code === 283) {
                message.error(res.data.message);
                logout();
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const handleDeleteRating = async (id) => {
        try {
            const body = { "userRatingId": id };
            const res = await deleteUserReview(body, token);
            if (res.status === 201) {
                message.success(res.data.message);
                showUserRatings();
            }
        } catch (error) {
            console.log(error);
            setIsLoading(true);
        }
    };

    return (
        <>
            <Button shape="round" className="view_details" onClick={showModal}>
                Rating
            </Button>
            <Modal title="Customer Rating By Delivery Partner" footer={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {userRating?.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                    <List
                        loading={isLoading}
                        itemLayout="horizontal"
                        dataSource={userRating}
                        renderItem={(item) => (
                            <>

                                <List.Item
                                    actions={[
                                        <Button shape='round' danger onClick={() => handleDeleteRating(item._id)}>Remove</Button>
                                    ]}
                                >
                                    <List.Item.Meta

                                        // avatar={<Avatar size={50} shape="square" src="https://static.thenounproject.com/png/4527823-200.png" className="order_images" />}
                                        title={<div>
                                            <p>{item.fullName} <Tag color='blue' bordered={false}>{item.orderCode}</Tag></p>
                                        </div>}
                                        description={<div>


                                            <p><Rate allowHalf disabled defaultValue={item.rating} /></p>

                                            <p>{item.review != null ? item.review : null}</p>


                                        </div>}
                                    />
                                </List.Item>


                            </>

                        )}
                    />}
            </Modal>
        </>
    );
};

export default ViewRating