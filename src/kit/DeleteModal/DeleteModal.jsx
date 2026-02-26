import React from "react";
import { Modal, Button, Typography } from "antd";

const { Text, Title } = Typography;

const DeleteModal = ({ isOpen, onClose, onDelete, item, isBtnLoading, title }) => {
    
    return (
        <Modal
            title={<Title level={5}>Delete {title}</Title>}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose} disabled={isBtnLoading}>
                    Cancel
                </Button>,
                <Button
                    key="delete"
                    type="primary"
                    danger
                    onClick={onDelete}
                    disabled={isBtnLoading}
                >
                    Yes, Delete
                </Button>,
            ]}
            centered
            destroyOnClose
        >
            <Text>
                Are you sure you want to delete <b>{item?.couponCode || "this item"}</b>? This action cannot be undone.
            </Text>
        </Modal>
    );
};

export default DeleteModal;
