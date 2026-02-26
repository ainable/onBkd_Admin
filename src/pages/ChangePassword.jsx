import React, { useState } from "react";
import { Button, Drawer, Form, Input, Radio, Space } from "antd";
import { MdOutlineModeEdit } from "react-icons/md";
const ChangePassword = () => {
  const [open, setOpen] = useState(false);
  const [oldPwd,setOldpwd]=useState(null)
  const [newPwd,setNewpwd]=useState(null)
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Space>
      <p className="menuItem" style={{marginBottom:0 }} onClick={showDrawer}>
       <MdOutlineModeEdit /> Change password
       </p>
      </Space>
      <Drawer
        title="Change Password"
        placement="right"
        width={500}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose} shape="round" danger>
              Cancel
            </Button>
            <Button
              type="primary"
              className="primary_btn"
              shape="round"
              onClick={onClose}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          layout="vertical"
          name="basic"
          labelCol={{
            span: 12,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="on"
        >
          <Form.Item
            name="old_password"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input.Password
              placeholder="Old Password"
              value={oldPwd}
              //onChange={handleChange("email")}
            />
          </Form.Item>

          <Form.Item
            name="new_password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              placeholder="new Password"
              value={newPwd}
              //onChange={handleChange("password")}
            />
          </Form.Item>

          
        </Form>
      </Drawer>
    </>
  );
};

export default ChangePassword;
