import React, { useState } from 'react';
import { Button, Modal, Skeleton, Spin } from 'antd';
import { fetchKotAllDetails } from '../../service/api_services';
import KOT from './KOT';
import { HiOutlineDownload } from 'react-icons/hi';
import { useAuth } from '../../authentication/context/authContext';
import { useLocation } from 'react-router-dom';
import '../../style/order.css'
import { MdLocalPrintshop } from 'react-icons/md';

const KotDetails = ({ orderId }) => {
    const location = useLocation()
    const { token } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [kotData, setKotData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const showModal = () => {
        setIsModalOpen(true);
        ShowKotDetails();

    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const ShowKotDetails = async () => {
        setIsLoading(true)
        try {
            await fetchKotAllDetails(token, orderId)
                .then((res) => {
                    console.log("kot info", res);
                    if (res.status == 200) {
                        setKotData(res.data.data);
                        setIsLoading(false)
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setIsLoading(false)

                });
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    };

    return (
        <>
            {location?.pathname === "/dashboard/order" ?
                <Button
                    type='primary'
                    size="large"
                    shape="circle"
                    onClick={showModal}
                    icon={<HiOutlineDownload className="order_icons" />}
                ></Button>
                :
                <Button
                    type='primary'
                    onClick={showModal}
                    shape="round"
                    style={{ backgroundColor: "#2671eb" }}
                    icon={<MdLocalPrintshop />}
                >
                    Print KOT
                </Button>
            }
            <Modal
                width={360}
                footer={false}
                style={{ top: 10 }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div className="bill-containers">
                    {isLoading ? <Skeleton active /> : <KOT data={kotData} handleCancel={handleCancel} />}
                </div>
            </Modal>
        </>
    );
};
export default KotDetails