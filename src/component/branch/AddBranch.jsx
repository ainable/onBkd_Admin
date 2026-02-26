import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Drawer,
  Form,
  Input,
  Select,
  Skeleton,
  Space,
  Upload,
  message,
} from "antd";

import { Col, Row } from "react-bootstrap"
import DefaultImg from "../../assest/png/NotImg.png"
import { useAuth } from "../../authentication/context/authContext";
import { AddNewBranchManager, fetchBranchRole, InsertNewBranch } from "../../service/api_services";
const AddBranch = ({ shhowAllBranchList }) => {
  const [open, setOpen] = useState(false);

  const { token } = useAuth()
  const [form] = Form.useForm();
  const [formData, setFormData] = useState(new FormData());
  const [uploder, setUploader] = useState(null)
  const [isCreated, setIsCreated] = useState(false);
  const [brachRole, setBranchRole] = useState([])
  const filterRole = brachRole.filter((item) => item.rolename === "BranchAdmin")


  const showDrawer = () => {
    setOpen(true);
  };

  const cartClose = () => {
    setOpen(false);
  };


  const handlerImage = (file) => {
    setUploader(file.fileList)
  }



  const onFinish = async (value) => {
    setIsCreated(true)
    try {
      formData.append("branchImage", value.branchImage.file);
      formData.append("branchName", value.branchName);
      formData.append("branchCode", value.branchCode);
      formData.append("latitude", value.latitude);
      formData.append("longitude", value.longitude);
      formData.append("fullAddress", value.fullAddress);
      formData.append("area", value.area);
      formData.append("state", value.state);
      formData.append("branchAlias", value.branchAlias);

      await InsertNewBranch(token, formData)
        .then((res) => {
          console.log("add branch ", res);
          if (res.status == 201) {
            message.success(res.data.message);
            createBranchAdminHandler(res.data.data._id, value)
            setOpen(false);
            onReset()
            shhowAllBranchList()
            setFormData(new FormData())
            setIsCreated(false)

          }

        })
        .catch((err) => {
          console.log(err);
          setFormData(new FormData())
          setIsCreated(false)


        });
    } catch (error) {
      console.log(error);
      setFormData(new FormData())
      setIsCreated(false)


    }
  };

  const onReset = () => {
    form.resetFields();
  };
  const onFinishFailed = (value) => {
    message.error("some field is empty !")
    console.log(value)
  }

  const createBranchAdminHandler = async (id, value) => {
    const body = {
      branchId: id,
      fullName: value.fullName,
      email: value.email,
      password: value.password,
      roleId: value.roleId

    }

    try {
      await AddNewBranchManager(token, body)
        .then((res) => {
          console.log("add branch member", res);
          if (res.status == 201) {
            message.success(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };




  const shhowAllBranchRole = async () => {
    try {
      await fetchBranchRole(token)
        .then((res) => {
          console.log("  branch role ", res);
          if (res.status == 200) {
            setBranchRole(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    shhowAllBranchRole();
  }, []);

  return (
    <>
      <div className="Add_Addre">
        <Button type="primary" onClick={showDrawer} shape="round" block>
          Add
        </Button>
      </div>
      <Drawer
        title="Add New Branch"
        onClose={cartClose}
        open={open}
        placement="right"
        width={500}
      >



        <div className="add_form">
          <Form
            form={form}
            layout="vertical"
            name="basic"

            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Col md={12} className="upload_branch_img">

              <p>Choose Image</p>
              <Form.Item name="branchImage"
                rules={[
                  {
                    required: true,
                    message: "Please choose image !",
                  },
                ]}
              >
                <Upload
                  multiple={false}
                  listType="picture-circle"
                  beforeUpload={() => false} // To prevent automatic upload
                  accept="jpg/jpeg/pdf"
                  onChange={(e) => handlerImage(e)}
                // disabled={uploder?.length == 1}
                >
                  {uploder?.length != 1 ? <img src="https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg" className="image_hold" /> : null}

                </Upload>

              </Form.Item>

            </Col>
            <Row>
              <Col md={6}>

                <Form.Item
                  label="Branch Code"
                  name="branchCode"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter your Branch Code!",
                    },
                  ]}
                >
                  <Input placeholder="Enter  Branch Code" />
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item
                  label="Branch Name"
                  name="branchName"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter your Branch Name!",
                    },
                  ]}
                >
                  <Input placeholder="Enter  Branch Name " />
                </Form.Item>

              </Col>
            </Row>
            {/* <div className="search_place">
              <GooglePlacesAutocomplete
                apiKey="AIzaSyDTqsRLPVAa5szoM4bH0OuHJ_ZJEneFbK8"
                value={selectedPlace}
                onSelect={handlerSelect}
                selectProps={{
                  placeholder: 'Search Branch Location...',
                  value,
                  onChange: (value) => handleSelect(value)
                }}
              />
            </div> */}
            <Row>
              <Col md={6}>

                <Form.Item
                  label="Latitude"
                  name="latitude"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Latitude!",
                    },
                  ]}
                >
                  <Input placeholder="Enter  Latitude" />
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item
                  label="Longitude"
                  name="longitude"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Longitude!",
                    },
                  ]}
                >
                  <Input placeholder="Enter  Longitude " />
                </Form.Item>

              </Col>
            </Row>
            <Row>

              <Col md={6}>

                <Form.Item
                  label="State"
                  name="state"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter your State!",
                    },
                  ]}
                >
                  <Input placeholder="Enter  State" />
                </Form.Item>
              </Col>
              <Col md={6}>

                <Form.Item
                  label="Alias"
                  name="branchAlias"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Alias!",
                    },
                  ]}
                >
                  <Input placeholder="Enter  Alias" />
                </Form.Item>
              </Col>
            </Row>


            <Col md={12}>
              <Form.Item
                label="Area/Locality"
                name="area"
                rules={[
                  {
                    required: true,
                    message: "Please Enter your Area/Location!",
                  },
                ]}
              >
                <Input placeholder="Enter Area / Location" />
              </Form.Item>

            </Col>


            <Col md={12}>

              <Form.Item
                label="Full Address"
                name="fullAddress"
                rules={[
                  {
                    required: true,
                    message: "Please Enter your Full Address",
                  },
                ]}
              >
                <Input.TextArea placeholder="Enter Full Address" />
              </Form.Item>
            </Col>


            <Row>

              <Col md={6}>

                <Form.Item
                  label="Select Role"
                  name="roleId"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Role",
                    },
                  ]}
                >
                  <Select placeholder="Select Role Type" >
                    {filterRole.map((item) => (
                      <Select.Option key={item._id} value={item._id} >{item.rolename}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item name="fullName" label="User Name"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter User Name!",
                    },
                  ]}>
                  <Input placeholder='Enter User Name' />
                </Form.Item>
              </Col>
            </Row>
            <Row>

              <Col md={6}>
                <Form.Item name="email" label="Email"
                  rules={[
                    // {
                    //     required: true,
                    //     message: "Please Enter Email!",
                    // },
                    { type: "email", message: "Please enter a valid email!" }
                  ]}>
                  <Input placeholder='Enter Email' />
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item name="password" label="Password" rules={[
                  {
                    required: true,
                    message: "Please Enter your Passwork!",
                  },
                ]}>
                  <Input.Password placeholder='Enter Password' />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <div className="add_address_btn">
                <Space>
                  <Button danger shape="round" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button loading={isCreated} type="primary" htmlType="submit" shape="round">
                    Submit
                  </Button>
                </Space>
              </div>
            </Form.Item>
          </Form>

        </div>
      </Drawer>
    </>
  );
};

export default AddBranch;