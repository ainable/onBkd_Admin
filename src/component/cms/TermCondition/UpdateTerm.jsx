import React, { useEffect, useRef, useState } from "react";
import {

    Button,
    Card,

    Drawer,
    Form,
    Input,

    Select,

    Upload,
    message,
} from "antd";

import { Col, Row } from "react-bootstrap"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { cmsTyps, updateTermCondition } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";


const UpdateTerm = ({ termData, shhowTermCondition, setEdits }) => {

    const { token } = useAuth()
    const inputRef = useRef(null);
    const [form] = Form.useForm();
    const [descriptions, setDescriptions] = useState(null)

    if (termData) {
        form.setFieldsValue({
            for: termData?.for
        })
    }






    const onFinish = async (value) => {

        const body = {
            termAndCondtionId: termData?._id,
            description: descriptions,
        }
        try {
            await updateTermCondition(token, body)
                .then((res) => {
                    console.log("term update ", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        onReset()
                        setEdits(false)
                        shhowTermCondition()
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    };


    const onFinishFailed = (value) => {
        console.log(value)
    }

    const onReset = () => {
        form.resetFields();
    };
    return (
        <>



            <div className="add_form">
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"

                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name="for"
                        label="Select Type"
                    >
                        <Select placeholder='Select Type ' disabled>
                            {cmsTyps.map((item) => (
                                <Select.Option key={item.key} value={item.values}>{item.values}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Col md={12}>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Enter description!",
                                },
                            ]}
                        >
                            <CKEditor
                                editor={ClassicEditor}
                                data={termData?.description}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setDescriptions(data)
                                }}
                                placeholder="Write here..."
                            />

                        </Form.Item>
                    </Col>

                    <Form.Item>
                        <div className="add_address_btn">
                            <Button type="primary" htmlType="submit" shape="round">
                                Update
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};



export default UpdateTerm