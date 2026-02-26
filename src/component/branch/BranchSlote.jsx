import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Button, Card, Form, Image, Popconfirm, Select, Statistic, Switch, Typography, message } from "antd";
import '../../style/master.css'
import { useLocation } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { useAuth } from "../../authentication/context/authContext";
import { FaRegUser } from "react-icons/fa";
import { BranchHook } from "../../pages/CustomHooks";
import { deletedSlot, deliveryTypes, FetchAllbranchSlote, slotActionHandle, SlotDeliveryTypes } from "../../service/api_services";
import AddBranchSlot from "./AddBranchSlot";
import UpdateSlot from "./UpdateSlot";






function BranchSlote() {

    const location = useLocation();
    const [form] = Form.useForm();
    const { token, logout } = useAuth()
    const { branchList, defaultBranchId } = BranchHook(token)
    const [slotId, setSlotId] = useState("")
    const [isAction, setIsAction] = useState(false)
    const [branchId, setBranchId] = useState(null)
    const [sloteList, setSloteList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterSlot, setFilterSlot] = useState("")
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


    const { Title } = Typography;
    const columns = [
        {
            title: 'Branch Code',
            dataIndex: 'branchCode',
            key: 'branchCode',
            ellipsis: true,

            render: branchCode => <Tag color="blue"><strong>{branchCode}</strong></Tag>

        },
        {
            title: 'Branch Alias',
            dataIndex: 'branchId',
            key: 'branchId',
            ellipsis: true,

            render: branchId => branchId?.branchAlias

        },
        {
            title: 'Delivery Type',
            dataIndex: 'deliveryOption',
            key: 'deliveryOption',
            ellipsis: true,

        },
        {
            title: ' From Slot',
            dataIndex: 'timeSlotFrom',
            key: 'timeSlotFrom',
            ellipsis: true,
            render: timeSlotFrom => <Tag color="green" bordered={false}>{timeSlotFrom}</Tag>


        },
        {
            title: ' To Slot ',
            dataIndex: 'timeSlotTo',
            key: 'timeSlotTo',
            ellipsis: true,
            render: timeSlotTo => <Tag color="red" bordered={false}>{timeSlotTo}</Tag>


        },
        {
            title: ' Max  Delivery ',
            dataIndex: 'maxDelivery',
            key: 'maxDelivery',
            ellipsis: true,
            render: (_, { maxDelivery, _id }) => (
                <Space>
                    <span>{maxDelivery}</span>
                </Space>
            )


        },
        {
            title: 'Created At',
            dataIndex: 'addedDate',
            key: 'addedDate',
            ellipsis: true,

        },
        {
            title: ' Status ',
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
            render: (_, { _id, status }) => (
                <Space>
                    <Tag color={status == "ACTIVE" ? "green" : "red"} >{status}</Tag>
                    <Switch size="large" loading={isAction && slotId === _id} checked={status === "ACTIVE"} onClick={() => handelSlotActive(_id)} />

                </Space>
            )

        },
        {
            title: ' Action ',
            dataIndex: '_id',
            key: '_id',
            ellipsis: true,
            fixed: "right",
            render: (_, { _id, maxDelivery }) => (
                <Space>
                    <Popconfirm
                        title="Delete the delete"
                        description="Are you sure to delete this Slot?"
                        onConfirm={() => DeleteSLotHandler(_id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger type="primary" shape="round">Delete</Button>
                    </Popconfirm>
                    <UpdateSlot slotId={_id} maxDelivery={maxDelivery} shhowAllBranchSlote={shhowAllBranchSlote} />

                </Space>

            )

        },
    ];


    const handleCategoryChange = (value) => {
        setBranchId(value)
    }

    const handelSlotActive = async (id) => {
        setSlotId(id)
        setIsAction(true)
        try {
            await slotActionHandle({ branchSlotId: id }, token)
                .then((res) => {
                    console.log("active slot ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        shhowAllBranchSlote()
                        setIsAction(false)
                    }

                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
            setIsAction(false)
        }
    };


    const shhowAllBranchSlote = async () => {
        try {
            await FetchAllbranchSlote(token, branchId, defaultBranchId, filterSlot)
                .then((res) => {
                    console.log(" branch slote list ", res);
                    if (res.status == 200) {
                        setSloteList(res.data.data);
                        setIsLoading(true)
                    } else if (res.data.code == 283) {
                        message.error(res.data.message)
                        logout()

                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setIsLoading(true)

                });
        } catch (error) {
            console.log(error);
            setIsLoading(true)

        }
    };

    useEffect(() => {

        if (defaultBranchId != null) {
            form.setFieldsValue({
                branchId: branchId == null ? defaultBranchId : branchId,
            });
        }
        if (branchList != null) {
            shhowAllBranchSlote()
        }
    }, [branchId, branchList, filterSlot])


    const handleChange = (value) => {
        console.log("value", value)
        setFilterSlot(value)
    }

    const DeleteSLotHandler = async (id) => {
        try {
            const body = { "branchSlotId": id };
            const res = await deletedSlot(body, token);
            if (res.status === 201) {
                message.success(res.data.message);
                shhowAllBranchSlote();
            }
        } catch (error) {
            console.log(error);
            setIsLoading(true);
        }
    };


    const cancel = (e) => {
        console.log(e);
        message.error('Click on No');
    };
    return (
        <section className="main_Section">
            <div className="section_title">
                <div className="section_title_left">
                    <Breadcrumb
                        items={[
                            {
                                title: "Dashboard",
                            },
                            {
                                title: location.pathname,
                            },
                        ]}
                    />
                    <Title level={4}>Branch Slot</Title>
                </div>
                <Space>
                    <div className="section_actions">
                        <Form form={form}>
                            <Space>

                                <Form.Item
                                    name="branchId"

                                >
                                    <Select
                                        showSearch
                                        placeholder="Select Branch "
                                        optionFilterProp="children"
                                        onChange={handleCategoryChange}
                                        style={{ width: '220px' }}
                                    >
                                        {branchList?.map((option) => (
                                            <Select.Option
                                                key={option._id}
                                                level={option.branchName}
                                                value={option._id}
                                            >
                                                {capitalize(option.branchName)}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Select
                                    showSearch
                                    placeholder="Select Delivery Option "
                                    optionFilterProp="children"
                                    onChange={handleChange}
                                    style={{ width: '200px' }}
                                >
                                    {SlotDeliveryTypes?.map((option) => (
                                        <Select.Option
                                            key={option.key}
                                            value={option.values}
                                        >
                                            {option.values}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Space>
                        </Form>
                    </div>
                    <AddBranchSlot shhowAllBranchSlote={shhowAllBranchSlote} />

                </Space>


            </div>

            <div className="content_title">

                <div className="content">
                    <div className="shoo_recent_order">
                        {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
                            <Table columns={columns} dataSource={sloteList} scroll={{ x: true }} />}
                    </div>
                </div>


            </div>

        </section>
    );
}





export default BranchSlote