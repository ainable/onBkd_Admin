import React, { useState } from 'react';
import { Alert, Button, Image, Modal } from 'antd';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import '../../style/product.css'
const ViewReturnReplace = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Button type="link"   icon={<MdOutlineRemoveRedEye className='h4' />} onClick={showModal}>
            </Button>
            <Modal title="Reason & Image" footer={false} width={350} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="show_image">
                    <Alert message="This is not same product " type="error" />
                    <Image src="https://rukminim2.flixcart.com/image/850/1000/klo27bk0/gas-lighter/1/e/q/electronic-gas-lighter-butterfly-original-imagyqpxwp9crbf7.jpeg?q=20&crop=false" width={200} height={200} />
                </div>
            </Modal>
        </>
    );
};

export default ViewReturnReplace