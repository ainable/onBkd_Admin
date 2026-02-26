import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Popover, Switch } from 'antd';
import { MdOutlineSettings } from 'react-icons/md';
import { AddNewGeneralSetting, EditGeneralSetting, fetchGeneralSetting } from '../../service/api_services';
import { useAuth } from '../../authentication/context/authContext';
import { Col } from 'react-bootstrap';
import "../../style/master.css"


const GeneralSetting = () => {
  const [form] = Form.useForm();
  const { token, logout } = useAuth()
  const [open, setOpen] = useState(false);
  const [setting, setSetting] = useState([])
  const [isLoading, setIsLoading] = useState([])
  const [switchValue, setSwitchValue] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    showGeneralSetting()
  };


  const handleSwitchChange = (checked) => {
    console.log('Switch Value:', checked);
    setSwitchValue(checked);
  };



  const showGeneralSetting = async () => {
    try {
      await fetchGeneralSetting(token)
        .then((res) => {
          console.log(" general setting ", res);
          if (res.status == 200) {
            setSetting(res.data.data);
            setSwitchValue(res.data.data.isRemoveAllow)
            form.setFieldsValue({
              deliveryCharge: res.data.data.deliveryCharge,
              isRemoveAllow: res.data.data.isRemoveAllow,
              totalSlotingDay: res.data.data.totalSlotingDay,
            });
            setIsLoading(true)

          } else if (res.data.code == 283) {
            message.error(res.data.message)
            logout()
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(true)
    }
  };

  useEffect(() => {
    showGeneralSetting()
  }, [])


  const AddSettingHandler = async (value) => {
    try {

      await AddNewGeneralSetting({ ...value, isRemoveAllow: switchValue }, token)
        .then((res) => {
          if (res.status == 201) {
            message.success(res.data.message);
            setOpen(false);
            onReset()
            showGeneralSetting()
          } else if (res.status == 200) {
            message.warning(res.data.message);
          }

        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const EditSettingHandler = async (value) => {
    try {
      await EditGeneralSetting({ ...value, generalSettingId: setting?._id, isRemoveAllow: switchValue }, token)
        .then((res) => {
          if (res.status == 201) {
            message.success(res.data.message);
            setOpen(false);
            onReset()
            showGeneralSetting()
          } else if (res.status == 200) {
            message.warning(res.data.message);
          }

        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const onReset = () => {
    form.resetFields();
  };
  const onFinishFailed = (value) => {
    console.log(value)
  }
  const getFormData = () => {
    return (
      <Form
        form={form}
        layout="vertical"
        name="basic"
        className='generalSetting'
        onFinish={setting != null ? EditSettingHandler : AddSettingHandler}
        onFinishFailed={onFinishFailed}
      >

        <Col md={12}>

          <Form.Item
            label="Delivery Charge"
            name="deliveryCharge"
            rules={[
              {
                required: true,
                message: "Please Enter Delivery Charge",
              },
              {
                pattern: /^[0-9]*$/,
                message: 'Please Enter Only Numbers!',
              },
            ]}
          >
            <Input placeholder="Enter Delivery Charge" />
          </Form.Item>
        </Col>
        {/* <Col md={12}>
          <Form.Item
            // label="Order Remove Feature Allow "
            name="isRemoveAllow"
          >
            Order Remove Feature Allow <Switch size='small' checked={switchValue} onChange={handleSwitchChange} ></Switch>
          </Form.Item>
        </Col> */}
        <Col md={12}>
          <Form.Item
            label="Slot Days"
            name="totalSlotingDay"
            rules={[
              {
                required: true,
                message: "Please Enter Slot Days!",
              },
              {
                pattern: /^[0-9]*$/,
                message: 'Please Enter Only Numbers!',
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter Slot Days" />
          </Form.Item>
        </Col>
        <Form.Item>
          <div className="add_setting">
            <Button type="primary" htmlType="submit" shape="round">
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    )
  }

  return (
    <Popover

      content={getFormData()}
      title={<h5>General Setting</h5>}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottomRight"
    >
      <MdOutlineSettings className="icon_navbar" />
    </Popover>
  );
};
export default GeneralSetting;