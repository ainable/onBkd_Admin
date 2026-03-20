import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Form, Input, Modal, Spin, Tag, Tooltip, message } from 'antd';
import { MdOutlineSearch } from "react-icons/md";
import '../../style/product.css'
import { useAuth } from '../../authentication/context/authContext';
import { OrderGotoBranch, fetchAllBranchList } from '../../service/api_services';
import { CloseSquareFilled } from '@ant-design/icons';
import { useScreen } from '../../authentication/context/AuthScreen';

const OrderSendBranch = ({ status, orderId, shhowAllOrderList, branchCode, branchId, deliveryOption, showOrderCount, buttonType = "link", buttonShape = "default", buttonVariant = "text", }) => {
    const { screenWidth } = useScreen();
    const isMobile = screenWidth < 768;
    const { token } = useAuth()
    const [form] = Form.useForm()
    const [vendrList, setVendorList] = useState([])
    const [newBranchI, setNewBranchId] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSendOrder, setIsSendOrder] = useState(false);
    const [isVendorLoading, setIsVendorLoading] = useState(false)
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();



    const showAllBranchList = async () => {
        setIsVendorLoading(true)
        try {
            await fetchAllBranchList(token)
                .then((res) => {
                    console.log(" branch list", res);
                    if (res.status == 200) {
                        setVendorList(res.data.data.data)
                        setIsVendorLoading(false)
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setIsVendorLoading(false)
                });
        } catch (error) {
            console.log(error);
            setIsVendorLoading(false)
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

    // const getBranchDisplayValue = (id) => {
    //     const branch = vendrList.find(item => item._id === id);
    //     if (!branch) return "";

    //     return `${branch.branchCode}-${capitalize(branch.branchName)}`;
    // };

    // useEffect(() => {
    //     if (isModalOpen && vendrList.length && branchId) {
    //         form.setFieldsValue({
    //             branchId: getBranchDisplayValue(branchId)
    //         });

    //         setNewBranchId(branchId);
    //     }
    // }, [vendrList, branchId, isModalOpen]);

    return (
        <div className='assign_models'>

            {(status === "PENDING") ? (
                buttonVariant === "button" ? (
                    <Button
                        type={buttonType}
                        shape={buttonShape}
                        onClick={showModal}
                        disabled={deliveryOption !== "DELIVERY"}
                        size={isMobile ? 'small' : 'middle'}
                    >
                        Send to Branch
                    </Button>
                ) : (
                    <span
                        onClick={showModal}
                        disabled={deliveryOption !== "DELIVERY"}
                    >
                        Send to Branch
                    </span>
                )
            ) : (status === "ASSIGNED") ? (
                buttonVariant === "button" ? (
                    <Button
                        type={buttonType}
                        shape={buttonShape}
                        onClick={showModal}
                        disabled={deliveryOption !== "DELIVERY"}
                        size={isMobile ? 'small' : 'middle'}
                    >
                        ReAssign to Branch {" "}<span style={{color:'lightgray',marginLeft:'5px'}}>({branchCode})</span>
                    </Button>
                ) : (
                    <span
                        onClick={showModal}
                        disabled={deliveryOption !== "DELIVERY"}
                    >
                        ReAssign to Branch <span style={{color:'lightgray',marginLeft:'5px'}}>({branchCode})</span>
                    </span>
                )
            ) : (
                <Tooltip title={`Order Assigned to ${branchCode} `}>
                    <Button
                        type={buttonType}
                        shape={buttonShape}
                        onClick={showModal}
                        disabled
                    >
                        Assign {branchCode}
                    </Button>
                </Tooltip>
            )
            }
            <Modal width={400} title="Order Send To Branch" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
                {isVendorLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',padding:'30px 0' }}>
                        <Spin size="small" />
                    </div>
                ) : (
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
                )}
            </Modal>
        </div >
    );
};


export default OrderSendBranch