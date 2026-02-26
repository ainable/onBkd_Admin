import React, { useState } from 'react';
import { Avatar, Button, Empty, List, message, Modal, Popconfirm, Rate, Space, Tag } from 'antd';
import { deleteVendorRating, fetchUserRating, fetchVendroRating } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';


const VendorRating = ({ vendorId }) => {

    const { token, logout } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRating, setUserRating] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

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
            const res = await fetchVendroRating(token, vendorId);
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

    const DeleteVendorRate = async (id) => {
        try {

            const res = await deleteVendorRating({ "vendorRatingId": id }, token);
            if (res.status === 201) {
                message.success(res.data.message);
                showUserRatings();
            }
        } catch (error) {
            console.log(error);
        }
    };
    const cancel = () => {
        message.error("your are click no")
    }
    return (
        <>
            <span onClick={showModal}>
                See Rating
            </span>
            <Modal title="All Rating " footer={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {userRating?.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                    <List
                        loading={isLoading}
                        itemLayout="horizontal"
                        dataSource={userRating}
                        renderItem={(item) => (
                            <>

                                <List.Item
                                    actions={[
                                        <Popconfirm
                                            title="Delete the Vendor Rating"
                                            description="Are you sure to delete this Vendor Rating?"
                                            onConfirm={() => DeleteVendorRate(item._id)}
                                            onCancel={cancel}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button shape='round' type='primary' danger>Delete</Button>
                                        </Popconfirm>
                                    ]}
                                >
                                    <List.Item.Meta

                                        // avatar={<Avatar size={50} shape="square" src="https://static.thenounproject.com/png/4527823-200.png" className="order_images" />}
                                        title={<div>
                                            <p>{item.fullName} <Tag color='blue' bordered={false}>{item.orderCode}</Tag></p>
                                        </div>}
                                        description={<div>
                                            <p>{item.rating ? <Rate allowHalf disabled defaultValue={item.rating} /> : null}</p>
                                            <p>{item.review ? item.review : null}</p>
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

export default VendorRating