import React, { useState } from "react";
import { Button, Drawer, Form, Input, message, Modal, Select } from "antd";
import "../../style/master.css";
import { AddNewAdminUser, InsertNewRole, RoleTypes } from "../../service/api_services";
import { useAuth } from "../context/authContext";


function AddRole({ ShowAllRoleList }) {
  const [isLoding, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token, logout } = useAuth()
  const [form] = Form.useForm();

  const submithandler = async (value) => {
    setIsLoading(true)
    try {
      await InsertNewRole(value, token).then(res => {
        console.log(res);
        if (res.status == 201) {
          setIsLoading(false)
          message.success(res.data.message)
          ShowAllRoleList()
          setIsModalOpen(false)
        } else if (res.data.code == 283) {
          message.error(res.data.message)
          logout()
        }
      }).catch(err => {
        message.error(err.msg);

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
      <Button type="primary" shape="round" onClick={showModal}>Add Role</Button>
      <div className="create_post">
        <Drawer
          title="Add a new role"
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
              label="Role Name"
              name="roleName"
              rules={[
                {
                  required: true,
                  message: "Please Enter Role Name",
                },
              ]}
            >
              <Input
                placeholder="Role Name"
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 8,
              }}
            ><div className="submit_btn">
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




export default AddRole