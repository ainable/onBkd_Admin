import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Form, Input, Modal, Tag, Tooltip, message } from 'antd';
import { MdOutlineSearch } from "react-icons/md";

import { useAuth } from '../../authentication/context/authContext';
import { OrderGotoBranch, ReassingVendorBranch, fetchAllBranchList } from '../../service/api_services';


const ReassignBranch = ({ vendorId, showAllVendorDetails, branchIds, ApproveStatus }) => {
    const { token } = useAuth()
    const { form } = Form.useForm()
    const [BranchList, setBranchList] = useState([])
    const [branchId, setBranchId] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)


    const showAllBranchList = async () => {
        try {
            await fetchAllBranchList(token)
                .then((res) => {
                    console.log(" branch list", res);
                    if (res.status == 200) {
                        setBranchList(res.data.data.data)

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
        vendorId: vendorId,
        branchId: branchId,
    }
    const submitHandler = async () => {
        setIsLoading(true)
        try {
            await ReassingVendorBranch(token, body)
                .then((res) => {
                    console.log(" assing order branch", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        setIsModalOpen(false);
                        showAllVendorDetails()
                        form.resetFields();
                        setIsLoading(false)

                    } else if (res.status === 200) {
                        message.warning(res.data.message)
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
    }

    const onFinishFailed = (value) => {
        console.log(value)
    }

    const handleSearch = (value) => {
        console.log(value)
    }
    const handleSelect = (value, id) => {
        setBranchId(id.id)
        console.log("branchId", branchId)
        console.log('value', value)
    }

    return (
        <div className='assign_model'>
            <Button disabled={!ApproveStatus} shape="round" id={!ApproveStatus ? "" : "view_order"} onClick={showModal}>Reassign    </Button>
            <Modal width={400} title="Vendor Reassign  Branch" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
                <div className="vendor_search_form">

                    <Form layout="vertical" form={form} onFinish={submitHandler} onFinishFailed={onFinishFailed}>
                        <Form.Item name="order">
                            <AutoComplete

                                options={BranchList?.sort((a, b) => {
                                    if (a._id === branchIds) return -1; // Place items where branchCode matches at the beginning
                                    if (b._id === branchIds) return 1; // Place items where branchCode matches at the beginning
                                    return 0; // Preserve original order for other items
                                })?.map(option => ({
                                    value: (
                                        <span key={[option.branchCode, option.branchName]} className={option._id === branchIds ? "DefaultDeletedBranch" : ""}>
                                            ({option.branchCode})--{option.branchName}{' '}
                                            {option._id === branchIds && <Tag color='green' bordered={false}>Default</Tag>}
                                        </span>
                                    ),
                                    id: option._id
                                }))}
                                suffixIcon={<MdOutlineSearch className='vendor_search' />}
                                onSearch={handleSearch}
                                placeholder="Search Branch"
                                onSelect={handleSelect}
                                filterOption={BranchList?.map(option => ({ value: option.branchName.toUpperCase().indexOf(option.branchName.toUpperCase()) !== -1, id: option._id }))}

                            />



                        </Form.Item>
                        <Form.Item>
                            <div className="submit_btn">
                                <Button loading={isLoading} type='primary' htmlType='submit' shape='round'>Submit</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};


export default ReassignBranch