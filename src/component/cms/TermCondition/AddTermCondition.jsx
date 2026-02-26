import React, { useState } from 'react';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { cmsTyps, InsertNewAbout, InsertTermCondition } from '../../../service/api_services';
import { useAuth } from '../../../authentication/context/authContext';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AddTermCondition = ({ shhowTermCondition }) => {
    const { token } = useAuth()
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)
    const [descriptions, setDescriptions] = useState(null)



    const onFinish = async (value) => {
        setIsLoading(false)
        try {
            await InsertTermCondition(token, { for: value.for, description: descriptions })
                .then((res) => {
                    console.log("add about", res);
                    if (res.status == 201) {
                        message.success(res.data.message);
                        onReset()
                        shhowTermCondition()
                        setIsLoading(false)
                    }

                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false)
                });
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    };


    const onFinishFailed = (value) => {
        console.log(value)
    }
    const onReset = () => {
        form.resetFields()
    }
    return (
        <>

            <Form
                form={form}
                layout='vertical'
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    name="for"
                    label="Select Type"
                    rules={[
                        {
                            required: true,
                            message: "Please Select Type",
                        },
                    ]}>
                    <Select placeholder='Select Type '>
                        {cmsTyps.map((item) => (
                            <Select.Option key={item.key} value={item.values}>{item.values}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="description"
                    label="Description"
                    rules={[
                        {
                            required: true,
                            message: "Please Enter Description!",
                        },
                    ]}>
                    <CKEditor
                        editor={ClassicEditor}
                        data={descriptions}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setDescriptions(data)
                        }}
                        config={{
                            placeholder: "Write here..."
                        }}
                    />

                </Form.Item>


                <Form.Item >
                    <div className="model_Submit">
                        <Button
                            loading={isLoading}
                            htmlType="submit"
                            shape="round"
                        >
                            Submit
                        </Button>
                    </div>

                </Form.Item>
            </Form>
        </>
    );
};

export default AddTermCondition