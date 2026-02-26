import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Divider, Empty, Image, Segmented, Select, Space, Statistic, Typography, message } from "antd";
import '../../../style/cms.css'
import { useLocation } from "react-router-dom";
import { fetchTermCondition } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";
import { FcQuestions } from "react-icons/fc";
import UpdateTerm from "./UpdateTerm";
import AddTermCondition from "./AddTermCondition";
import parse from 'html-react-parser';
const { Title } = Typography;







function TermCondition() {
  const { token, logout } = useAuth()
  const location = useLocation();
  const [termList, setTermList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [edits, setEdits] = useState(false)
  const [types, setTypes] = useState("USER")


  const shhowTermCondition = async () => {
    try {
      await fetchTermCondition(token, types)
        .then((res) => {
          console.log(" all term list ", res);
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
    shhowTermCondition();
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
              <Title level={4}>Terms & Conditions</Title>

            </div>


          </div>
          <div className="content_add">
            {/* <AddProduct /> */}
          </div>
        </div>
        <div className="content">
          <div className="show_term_con">
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
                      Terms & Conditions not found !
                    </Typography.Text>
                  }
                >
                </Empty>
                <Card bordered={false} title="Add Terms &  Conditions" >
                  <AddTermCondition shhowTermCondition={shhowTermCondition} />
                </Card>
              </div> :
                <Card
                  cover={
                    <img
                      id="cover_img"
                      alt="example"
                      src="https://media.istockphoto.com/id/1336169315/photo/t-c-web-banner-the-abbreviation-for-terms-and-conditions-built-from-letters-on-wooden-cubes.jpg?s=612x612&w=0&k=20&c=-XwQK_SkGJGiu-iTHUPUXXOJD1-ASRfxgZdl9bpRH6A="
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
                  {edits == false ? <p><FcQuestions className="term_icon" />{parse(termList.description)}</p> : <UpdateTerm termData={termList} setEdits={setEdits} shhowTermCondition={shhowTermCondition} />}

                </Card>}
          </div>
        </div>


      </div>

    </section>
  );
}




export default TermCondition