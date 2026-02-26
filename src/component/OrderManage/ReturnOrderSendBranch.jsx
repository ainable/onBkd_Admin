import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Checkbox, Form, Input, Modal, Tag, Tooltip, message } from 'antd';
import { MdOutlineSearch } from "react-icons/md";
import '../../style/product.css'
import { useAuth } from '../../authentication/context/authContext';
import { OrderGotoBranch, fetchAllBranchList } from '../../service/api_services';


const ReturnOrderSendBranch = ({ status, orderId, shhowAllOrderList, branchCode, branchId, deliveryOption }) => {
    const { token } = useAuth()
    const { form } = Form.useForm()
    const [vendrList, setVendorList] = useState([])
    const [newBranchI, setNewBranchId] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checked, setChecked] = useState(false); // Initial unchecked state (false)

    const onChange = (e) => {
        setChecked(e.target.checked); // Get the current state (true or false)
        console.log("Checkbox is:", e.target.checked ? "Checked" : "Unchecked");
    };
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
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const body = {
        orderId: orderId,
        branchId: newBranchI,
    }

    const submitHandler = async () => {
        try {
            await OrderGotoBranch(token, body)
                .then((res) => {
                    console.log(" assing order branch", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setIsModalOpen(false);
                        shhowAllOrderList()
                        form.resetFields();

                    } else if (res.status == 200) {
                        message.error(res.data.message);

                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
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

    }

    return (
        <div className='assign_model'>
            <Button shape="round" id="view_order" onClick={showModal}>Refund Verify </Button>
            <Modal width={400} title="Refund or Replacement Order Send To Branch" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
                <div className="vendor_search_form">
                    <Form layout="vertical" form={form} onFinish={submitHandler} onFinishFailed={onFinishFailed}>
                        <Form.Item>
                            <Checkbox checked={checked} onChange={onChange} >
                                Confirm you are check all return or replacement item image
                            </Checkbox>
                        </Form.Item>
                        <Form.Item name="order">
                            <AutoComplete
                                options={vendrList?.sort((a, b) => {
                                    if (a._id === branchId) return -1; // Place items where branchCode matches at the beginning
                                    if (b._id === branchId) return 1; // Place items where branchCode matches at the beginning
                                    return 0; // Preserve original order for other items
                                })?.map(option => ({
                                    value: (
                                        <span key={[option.branchCode, option.branchName]} className={option._id === branchId ? "DefaultDeletedBranch" : ""}>
                                            ({option.branchCode})--{option.branchName}{' '}
                                            {/* {option._id === branchId && <Tag color='green' bordered={false}>Default</Tag>} */}
                                        </span>
                                    ),
                                    id: option._id
                                }))}
                                suffixIcon={<MdOutlineSearch className='vendor_search' />}
                                onSearch={handleSearch}
                                placeholder="Search Branch"
                                onSelect={handleSelect}
                                filterOption={vendrList?.map(option => ({ value: option.branchName.toUpperCase().indexOf(option.branchName.toUpperCase()) !== -1, id: option._id }))}

                            />


                        </Form.Item>
                        <Form.Item>
                            <div className="order_sent_btn">

                                <Button htmlType='submit' shape='round'>Submit</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};



export default ReturnOrderSendBranch