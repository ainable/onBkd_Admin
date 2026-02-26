import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Divider, Empty, Image, Segmented, Select, Space, Statistic, Typography, message } from "antd";
import '../../../style/cms.css'
import { useLocation } from "react-router-dom";
import { fetchPrivecyoPolicy } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";
import { FcQuestions } from "react-icons/fc";
import UpdatePolicy from "./UpdatePolicy";
import AddPrivacy from "./AddPrivacy";
import parse from 'html-react-parser';
const { Title } = Typography;



function PrivecyPolicy() {
  const { token, logout } = useAuth()
  const location = useLocation();
  const [termList, setTermList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [edits, setEdits] = useState(false)
  const [types, setTypes] = useState("USER")


  const showPrivacyPolicy = async () => {
    try {
      await fetchPrivecyoPolicy(token, types)
        .then((res) => {
          console.log(" all policy list ", res);
          if (res.status == 200) {
            setTermList(res.data.data);
            setIsLoading(true)
          } else if (res.data.code == 283) {
            message.error(res.data.message)
            logout()

          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(true)
    }
  };

  useEffect(() => {
    showPrivacyPolicy();
  }, [types]);


  return (
    <section className="main_Section">
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
      <div className="content_title">
        <div className="content_head">
          <div className="content_titles">
            <div className="hear_title">
              <Title level={4}>Privacy Policy</Title>
            </div>
          </div>
          <div className="content_add">
            {/* <AddProduct /> */}
          </div>
        </div>
        <div className="content">
          <div className="show_term_cons">
            {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
              !termList ? <div className="add_about">
                <Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  styles={{
                    image: {
                      height: 60,
                    },
                  }}
                  description={
                    <Typography.Text>
                      Privacy Policy not found !
                    </Typography.Text>
                  }
                >
                </Empty>
                <Card bordered={false} title="Add Privacy Policy" >
                  <AddPrivacy showPrivacyPolicy={showPrivacyPolicy} />
                </Card>
              </div> :
                <Card
                  cover={

                    <img
                      id="cover_img"

                      alt="example"
                      src="https://www.altosindia.net/public/page/Policies-banner.jpg"
                    />

                  }
                >
                  {<div className="term_action">
                    <p> Last Updated :{new Date(termList?.modifiedDate).toLocaleString()}</p>
                    <Space>
                      <Segmented options={["USER", "VENDOR"]} onChange={(value) => setTypes(value)} />
                      {edits == false ? <Button shape="round" onClick={() => setEdits(true)}>Edit</Button> : null}
                    </Space>

                  </div>}
                  <Divider />
                  {edits == false ? <p><FcQuestions className="term_icon" />{parse(termList.description)}</p> : <UpdatePolicy termData={termList} setEdits={setEdits} showPrivacyPolicy={showPrivacyPolicy} />}

                </Card>}
          </div>
        </div>


      </div>

    </section>
  );
}




export default PrivecyPolicy