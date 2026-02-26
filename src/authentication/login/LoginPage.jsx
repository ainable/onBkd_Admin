import React, { useState } from "react";
import "./loginpage.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Divider, Form, Input, Spin, message } from "antd";
import { useAuth } from "../context/authContext";
import LoginLogo from "../../assest/chat/logo.png";
import { Col, Row } from "react-bootstrap";
import { LoginAdmin } from "../../service/api_services";
import LoginImage from "../../assest/png/login_img.avif"

function LoginPage() {
  const { login, fcmtoken } = useAuth();
  const navigate = useNavigate();
  const [isLoding, setIsLoading] = useState(false);
  // const [loginData, setLoginData] = useState({
  //   email: "pathaks411@gmail.com",
  //   password: "sachin@123",
  // });
  // console.log("fcmtoken login", fcmtoken)


  const onFinish = async (value) => {
    setIsLoading(true)
    try {
      await LoginAdmin({ ...value, fcmToken: fcmtoken })
        .then((res) => {
          setIsLoading(true);
          console.log(res);
          if (res.status == 201) {
            login(res.data.data.accessToken);
            localStorage.setItem("token", res.data.data.accessToken);
            setIsLoading(false);
            message.success(res.data.message);
            navigate("/dashboard");
          } else if (res.status == 200) {
            message.error(res.data.message)
          }
        })
        .catch((err) => {
          message.error(err.message);
          setIsLoading(false);
        }).finally((res) => {
          setIsLoading(false);

        })
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const onFinishFailed = (value) => {
    console.log(value)
  }


  return (
    <section>
      <div className="loginSection">

      </div>
      <div className="login">
        <Row>
          <Col md={7}>
            <div className="loginLogo">
              {/* <img src={LoginImg} /> */}
              <img src={LoginImage} />
            </div>
          </Col>
          <Col md={5}>
            <div className="loginField">
              <div className="form_title_image ">
                <img src={LoginLogo} className="mb-3"/>
                <h4>Admin Login</h4>
              </div>

              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                name="basic"
                // initialValues={loginData}
                autoComplete="on"
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Your Email!",
                    },
                  ]}
                >
                  <Input

                    placeholder="Enter Email"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Your Password!",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter Password"
                  />
                </Form.Item>
                <Form.Item
                >
                  <div className="login_submit">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoding}
                      shape="round"
                      size="large"
                    >
                      Login
                    </Button>
                  </div>
                </Form.Item>
              </Form>
              <p>Don't have an account please contact your admin</p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}

export default LoginPage;
