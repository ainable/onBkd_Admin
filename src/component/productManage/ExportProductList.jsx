import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Select, Space } from 'antd';
import SelecteBrandData from './SelectBrandData';
import CategoryFilter from './CategoryFilter';
import { ExpotProductList, fetchAllBranchList, FetchAllCategorItemList } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';
import { Col, Row } from 'react-bootstrap';


const ExportProductList = () => {
    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { token, logout } = useAuth();
    const [branchData, setBranchData] = useState([]);
    const [branchId, setBranchId] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [brandId, setBrandId] = useState(null);
    const [itemCategoryId, setItemCategoryId] = useState(null);
    const [catgoryItem, setCategoryItem] = useState([]);
    const [current, setCurrent] = useState(1);

    const [noOfItem, setNoOfItem] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };



    const getAllCategoryItem = async () => {
        try {
            const res = await FetchAllCategorItemList(token,
                categoryId,
                current,
                searchInput,);
            if (res.status === 200) {
                setCategoryItem(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (categoryId != null) {
            getAllCategoryItem();
        }
    }, [categoryId]);

    const getAllBranchList = async () => {
        try {
            const res = await fetchAllBranchList(token);
            if (res.status === 200) {
                setBranchData(res.data.data.data);
                form.setFieldsValue({
                    branchCode: branchId != null ? branchId : res.data.data.data[0].branchCode,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllBranchList();
    }, []);


    const handelExportData = async () => {

        setIsLoading(true)
        try {
            const res = await ExpotProductList(token, brandId, categoryId, itemCategoryId, branchId, noOfItem);
            console.log("res", res)
            if (res.status === 200) {
                const fileUrl = res.data.data.exportExcel
                form.resetFields();
                handleCancel();
                setIsLoading(false)
                setCategoryId(null)
                setBranchId(null)
                setBrandId(null)
                setItemCategoryId(null)
                if (fileUrl?.length != 0) {
                    // Trigger file download
                    window.open(fileUrl, '_blank');
                }

            } else if (res.data.code === 283) {
                message.error(res.data.message);
                logout();
            } else {
                message.error("Failed to export data");
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error);
            message.error("An error occurred during export");
            setIsLoading(false)
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handelNumnerData = (value) => {
        setNoOfItem(value)
    }
    return (
        <>
            <Button type="primary" onClick={showModal}>
                Export
            </Button>
            <Modal style={{
                top: 20
            }} footer={false} title="Export Product  Excel Sheet  " open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="export">
                    <Form
                        form={form}
                        layout="vertical"
                        name="filter-product"
                        className="filter"
                        onFinish={handelExportData}
                        onFinishFailed={onFinishFailed}
                    >
                        <Row>
                            <Col md={6}>
                                <Form.Item

                                    name="branchCodeExport">
                                    <Select
                                        showSearch
                                        allowClear
                                        placeholder="Select Branch"
                                        optionFilterProp="children"
                                        onChange={(value) => setBranchId(value)}
                                        style={{ width: '220px' }}
                                    >
                                        {branchData?.map((option) => (
                                            <Select.Option
                                                key={option.branchCode}
                                                level={option.branchName}
                                                value={option.branchCode}
                                            >
                                                {capitalize(option.branchName)}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={6}>
                                <CategoryFilter setCategoryId={setCategoryId} />
                            </Col>
                            <Col md={6}>
                                <Form.Item

                                    name="categoryItemId">
                                    <Select
                                        showSearch
                                        allowClear
                                        placeholder="Select Category Item"
                                        optionFilterProp="children"
                                        onChange={(value) => setItemCategoryId(value)}
                                        style={{ width: '220px' }}
                                    >
                                        {catgoryItem?.map((option) => (
                                            <Select.Option
                                                key={option.itemCategoryId}
                                                level={option.itemCategoryName}
                                                value={option.itemCategoryId}
                                            >
                                                {option.itemCategoryName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                            </Col>
                            <Col md={6}>
                                <SelecteBrandData setBrandId={setBrandId} brandId={brandId} />
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter No of Data!',
                                        },
                                        {
                                            pattern: /^[1-9][0-9]*$/, // Ensures only numbers greater than 0
                                            message: 'Please Enter Only  Number & Greater Than 0!',
                                        },
                                    ]}
                                    name="itemsPerPage"
                                >
                                    <InputNumber placeholder="Enter No of Data" style={{ width: "100%" }} onChange={handelNumnerData} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <div className="submit_btn">

                                <Button loading={isLoading} type='primary' htmlType='submit'>Export Product</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default ExportProductList