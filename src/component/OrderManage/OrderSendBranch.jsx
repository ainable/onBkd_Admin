import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Form, Input, Modal, Tag, Tooltip, message } from 'antd';
import { MdOutlineSearch } from "react-icons/md";
import '../../style/product.css'
import { useAuth } from '../../authentication/context/authContext';
import { OrderGotoBranch, fetchAllBranchList } from '../../service/api_services';
import { CloseSquareFilled } from '@ant-design/icons';

const OrderSendBranch = ({ status, orderId, shhowAllOrderList, branchCode, branchId, deliveryOption ,showOrderCount}) => {
    const { token } = useAuth()
    const { form } = Form.useForm()
    const [vendrList, setVendorList] = useState([])
    const [newBranchI, setNewBranchId] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSendOrder, setIsSendOrder] = useState(false);
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();



    const showAllBranchList = async () => {
        try {
            await fetchAllBranchList(token)
                .then((res) => {
                    console.log(" branch list", res);
                    if (res.status == 200) {
                        setVendorList(res.data.data.data)

                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
        }
    }



    const showModal = () => {
        setIsModalOpen(true);
        showAllBranchList()
        setIsSendOrder(false)
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const body = {
        userOrderId: orderId,
        branchId: newBranchI,
    }
    const submitHandler = async () => {
        setIsSendOrder(true)

        try {
            await OrderGotoBranch(token, body)
                .then((res) => {
                    console.log(" assing order branch", res);
                    if (res.status === 201) {
                        message.success(res.data.message);
                        setIsModalOpen(false);
                        shhowAllOrderList()
                        showOrderCount()
                        form.resetFields();
                        setIsSendOrder(false)
                        setNewBranchId("")

                    } else if (res.status == 200) {
                        message.error(res.data.message);
                        setIsSendOrder(false)
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
            setIsSendOrder(false)

        }
    }

    const onFinishFailed = (value) => {
        console.log(value)
    }

    const handleSearch = (value) => {
        console.log(value)
    }
    const handleSelect = (value, id) => {
        setNewBranchId(id.id)
        console.log("branchId", branchId)
        console.log('value', value)
    }

    return (
        <div className='assign_models'>

            {status == "PENDING" || "ACCEPTED" ?
                <span onClick={showModal} disabled={deliveryOption != "DELIVERY"}>Send to branch   </span> : <Tooltip title={`Order Assigned to ${branchCode} `}><Button type='link' disabled>Assign {branchCode} </Button>   </Tooltip>}
            <Modal width={400} title="Order Send To Branch" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
                <div className="vendor_search_form">
                    <Form layout="vertical" form={form} onFinish={submitHandler} onFinishFailed={onFinishFailed}>
                        <Form.Item name="branchId">                                    <AutoComplete
                            allowClear={{
                                clearIcon: <CloseSquareFilled />,
                            }}
                            options={vendrList
                                .sort((a, b) => {
                                    if (a._id === branchId) return -1;
                                    if (b._id === branchId) return 1;
                                    return 0;
                                })
                                .map(option => ({
                                    value: `${option.branchCode}-${capitalize(option.branchName)}`,
                                    label: (
                                        <span key={option._id} className={option._id === branchId ? "DefaultDeletedBranch" : ""}>
                                            {option.branchCode}-{capitalize(option.branchName)}

                                        </span>
                                    ),
                                    id: option._id
                                }))
                            }
                            suffixIcon={<MdOutlineSearch className='vendor_search' />}
                            onSearch={handleSearch}
                            placeholder="Search Branch"
                            onSelect={(value, option) => handleSelect(value, option)}
                            filterOption={(inputValue, option) =>
                                option.value.toLowerCase().includes(inputValue.toLowerCase())
                            }
                        />


                        </Form.Item>
                        <Form.Item>
                            <div className="order_sent_btn">

                                <Button htmlType='submit' shape='round' loading={isSendOrder}>Submit</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};


export default OrderSendBranch