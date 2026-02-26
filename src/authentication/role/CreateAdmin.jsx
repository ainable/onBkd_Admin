import React, { useState } from "react";
import { Button, Drawer, Form, Input, message, Modal, Select } from "antd";
import "../../style/master.css";
import { AddNewAdminUser, RoleTypes } from "../../service/api_services";
import { useAuth } from "../context/authContext";


function CreateAdmin({ ShowAdminUserList, roleData }) {
  const [isLoding, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token, logout } = useAuth()
  const [form] = Form.useForm();

  console.log("roleData2222", roleData)

  const submithandler = async (value) => {
    setIsLoading(true)
    try {
      await AddNewAdminUser(value, token).then(res => {
        console.log(res);
        if (res.status == 201) {
          setIsLoading(false)
          message.success(res.data.message)
          ShowAdminUserList()
          setIsModalOpen(false)
        } else if (res.data.code == 283) {
          message.error(res.data.message)
          logout()
        }
      }).catch(err => {
        message.error(err.response.data.message);

      }).finally(() => {
        setIsLoading(false)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmitFeild = (value) => {
    console.log(value)
  }
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="modalBtns">
      <Button type="primary" shape="round" onClick={showModal}>Add User</Button>
      <div className="create_post">
        <Drawer
          title="Add Admin User"
          onClose={handleCancel}
          open={isModalOpen}
          placement="right"
        >
          <Form
            form={form}
            layout="vertical"
            name="basic"
            onFinish={submithandler}
            onFinishFailed={handleSubmitFeild}
            labelCol={{
              span: 12,
            }}
            wrapperCol={{
              span: 24,
            }}
          >
            <Form.Item
              name="roleId"
              label="Select Role"
              rules={[
                {
                  required: true,
                  message: "Please Select Role",
                },
              ]}
            >
              <Select placeholder="Select Role Type">
                {roleData.map((item) => (
                  // <Select.Option key={item._id} value={item._id}>{item.roleName}</Select.Option>
                  <Select.Option disabled={item?.permissions?.length === 0} key={item._id} label={item.roleNameId?.roleName} value={item._id}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>{item.roleNameId?.roleName}</span> <span>{item?.permissions?.length === 0 ? "Unique" : null}</span></div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Name"
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Please Enter Your Name",
                },
              ]}
            >
              <Input
                placeholder="Name"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please Enter Email!",
                },
              ]}
            >
              <Input
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please Enter Your Password!",
                },
              ]}
            >
              <Input.Password
                placeholder="Password"

              />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 8,
              }}
            >
              <div className="submit_btn">
                <Button
                  loading={isLoding}
                  type="primary"
                  shape="round"
                  htmlType="submit"
                >
                  Submit
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </div>
  );
}




export default CreateAdmin