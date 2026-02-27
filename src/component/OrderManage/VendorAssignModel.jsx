
import React, { useState } from 'react';
import { Avatar, Button, List, message, Modal } from 'antd';
import "../../style/order.css";
import { fetchAllDeliveryBoyList, OrderAssignToVendor, VendorTrackData } from '../../service/api_services';
import { Collapse, Steps } from 'antd';
import { useAuth } from '../../authentication/context/authContext';
import dayjs from 'dayjs';

const VendorAssignModel = ({ orderId, status, ShowOrderList, title }) => {
    const { token, role } = useAuth();
    const [isvendorAssign, setIsVendorAssign] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [venderData, setVendorData] = useState([]); // Delivery boy list
    const [vendorId, setVendorId] = useState(null); // Selected vendor
    const [partnerTrack, setPartnerTrack] = useState([]);

    const showPartnerTracData = async () => {
        try {
            const res = await VendorTrackData(token, orderId);
            setPartnerTrack(res.data.data.vendorReAssginList || []);
        } catch (error) {
            console.log(error);
        }
    };

    const stepItems = partnerTrack.map((item, index) => ({
        title: `From : ${item.fromVendorName || "N/A"} - To : ${item.toVendorName || "N/A"}`,
        description: `Assigned on: ${item.addedDate ? dayjs(item.addedDate).format("DD MMM YYYY, hh:mm A") : "N/A"}`,
    }));

    // Show Modal and load initial data
    const showModal = () => {
        setIsModalOpen(true);
        ShowDeliveryBoyList(); // Fetch data when page updates
        showPartnerTracData();

    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const ShowDeliveryBoyList = async () => {
        setIsLoading(true);
        try {
            const res = await fetchAllDeliveryBoyList(token);
            console.log("res", res)
            if (res?.data?.data) {
                const newData = res.data.data;
                setVendorData(newData)
            }
        } catch (error) {
            console.log('Error:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const assignVendorHandler = async () => {
        setIsVendorAssign(true)
        const body = {
            userOrderId: orderId,
            vendorId: vendorId,
        };
        try {
            const res = await OrderAssignToVendor(body, token);
            if (res.status === 201) {
                message.success(res.data.message);
                setIsModalOpen(false);
                setVendorId(null);
                ShowOrderList();
                setIsVendorAssign(false)
            } else if (res.status === 200) {
                message.info(res.data.message);
                setIsVendorAssign(false)


            }
        } catch (error) {
            console.log(error);
            setIsVendorAssign(false)

        }
    };

    return (
        <div className='vendor_list'>
            <Button disabled={title === "Reassign Delivery Partner" & role !== "BranchAdmin"} className='reassing_vendor' onClick={showModal} shape='round'>
                {title}
            </Button>

            <Modal
                style={{ top: 20, padding: 0 }}
                title="Delivery Partner List"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={
                    <div className='assign_vendor'>
                        {venderData?.length != 0 &&
                            <Button
                                loading={isvendorAssign}
                                onClick={() => assignVendorHandler()}
                            >
                                Assign Delivery Partner
                            </Button>
                        }
                    </div>
                }
            >
                <div className="vendor_track">
                    {partnerTrack.length === 0 ? (
                        null
                    ) : (
                        <Collapse expandIconPosition='right' >
                            <Collapse.Panel header="Delivery Partner Tracks" key="1">
                                <Steps
                                    className='custom-steps'
                                    progressDot
                                    current={partnerTrack.length - 1} // last step as current

                                    direction="vertical"
                                    items={stepItems}
                                />
                            </Collapse.Panel>
                        </Collapse>

                    )}
                </div>
                <section className='vendor_list_show'>
                    <List
                        loading={isLoading}
                        itemLayout="horizontal"
                        dataSource={venderData}
                        renderItem={(item, index) => (
                            <List.Item
                                actions={[
                                    <div className={vendorId === item._id ? "assign_btn" : ""}>
                                        <Button onClick={() => setVendorId(item._id)}>
                                            {vendorId === item._id ? "Selected" : "Select"}
                                        </Button>
                                    </div>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            src={
                                                item.profilePic != null
                                                    ? item.profilePic
                                                    : `https://api.dicebear.com/7.x/miniavs/svg?seed=${item._id}`
                                            }
                                            size={40}
                                        />
                                    }
                                    title={<p>{item.fullName}</p>}
                                    description={<p>Num Orders Assigned: {item.totalOrderAssigned}</p>}
                                />
                            </List.Item>
                        )}
                    />
                </section>
            </Modal>
        </div>
    );
};

export default VendorAssignModel;
