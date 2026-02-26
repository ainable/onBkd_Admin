import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Divider, Empty, Image, Segmented, Select, Space, Statistic, Typography, message } from "antd";
import '../../../style/cms.css'
import { useLocation } from "react-router-dom";
import { fetchAboutUs, fetchTermCondition } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";
import { FcQuestions } from "react-icons/fc";
import UpdateAbout from "./UpdateAbout";
import AddAbout from "./AddAbout";
import parse from 'html-react-parser';

const { Title } = Typography;







function AboutUs() {
  const { token, logout } = useAuth()
  const location = useLocation();
  const [aboutData, setAboutData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [edits, setEdits] = useState(false)
  const [types, setTypes] = useState("USER")


  const showAboutUs = async () => {
    try {
      await fetchAboutUs(token, types)
        .then((res) => {
          console.log(" all about list ", res);
          if (res.status == 200) {
            setAboutData(res.data.data);
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
    showAboutUs();
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
              <Title level={4}>About us</Title>
            </div>
          </div>
          <div className="content_add">
            {/* <AddProduct /> */}
          </div>
        </div>
        <div className="content">
          <div className="show_term_con">
            {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> :
              !aboutData ? <div className="add_about">
                <Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  styles={{
                    image: {
                      height: 60,
                    },
                  }}
                  description={
                    <Typography.Text>
                      About not found !
                    </Typography.Text>
                  }
                >
                </Empty>
                <Card bordered={false} title="Add About us" >
                  <AddAbout showAboutUs={showAboutUs} />
                </Card>
              </div> :
                <Card
                  cover={
                    <img
                      id="cover_img"

                      alt="example"
                      src="https://media.istockphoto.com/id/1335204621/photo/about-web-banner-the-word-about-built-from-letters-on-wooden-cubes-for-the-use-as-a-web-banner.jpg?s=170667a&w=0&k=20&c=XZf4BbzRoF_7-nE-LG4HZwIzM_W2QcPR1ZXwLafdfFU="
                    />

                  }
                >
                  {<div className="term_action">
                    <p> Last Updated :{new Date(aboutData?.modifiedDate).toLocaleString()}</p>
                    <Space>
                      <Segmented options={["USER", "VENDOR"]} onChange={(value) => setTypes(value)} />
                      {edits == false ? <Button shape="round" onClick={() => setEdits(true)}>Edit</Button> : null}
                    </Space>
                  </div>}
                  <Divider />
                  {edits == false ? <p>{parse(aboutData.description)}</p> : <UpdateAbout aboutData={aboutData} setEdits={setEdits} shhowAboutUs={showAboutUs} />}

                </Card>}
          </div>
        </div>


      </div>

    </section>
  );
}




export default AboutUs