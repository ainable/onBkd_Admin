import {

    Breadcrumb,
    Button,
    Card,

    Collapse,

    Empty,

    Input,
    Pagination,
    Segmented,
    Space,
    Tag,
    Typography,

    message,
} from "antd";
import React, { useEffect, useState } from "react";


import { useLocation } from "react-router-dom";
import "../../../style/location.css"


// import FaqAction from "./FaqAction";
import { Col, Row } from "react-bootstrap";
import AddFaq from "./AddFaq";
import { useAuth } from "../../../authentication/context/authContext";
import FaqAction from "./FaqAction";
import { FetchFAQList } from "../../../service/api_services";


function FaqList() {
    const { token } = useAuth();
    const { Title } = Typography;
    const [current, setCurrent] = useState(1)
    const location = useLocation()
    const [searchInput,setSearchInput]=useState("")
    const [faqData, setFaqdata] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [types, setTypes] = useState("USER")
    const [totalPage, setTotalPage] = useState(null)

    const onChange = (page) => {
        setCurrent(page);
    };

    // fetch all faq list
    const ShowAllFAQList = async () => {
        setIsLoading(true)
        try {
            await FetchFAQList(token, types)
                .then((res) => {
                    console.log("faq list", res);
                    if (res.status == 200) {
                        setIsLoading(false);
                        setFaqdata(res.data.data);
                        setTotalPage(res.data.data);
                    }
                })
                .catch((err) => {
                    console.log(err.response.msg);
                });
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        ShowAllFAQList();
    }, [types, current]);





    return (
        <section className="main_Section">

            <div className="content_head mb-4">
                <div className="title_section">
                    <h4>FAQ  List</h4>
                </div>
                <div className="action_sections">
                    <Space>
                        <Segmented options={['USER', 'VENDOR']} value={types} onChange={setTypes} />
                        <AddFaq ShowAllFAQList={ShowAllFAQList} />
                    </Space>
                </div>
            </div>
            <div className="content">
                <Row>
                    {isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : faqData.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : faqData.map((item) => (
                        <Col md={6} key={item.faq_id} className="mt-2">
                            <Collapse key={item.faq_id}  >
                                <Collapse.Panel header={<div>
                                    <p>{item.question} </p>
                                </div>} key={item.faq_id}
                                    extra={<FaqAction faqEditDtata={item} ShowAllFAQList={ShowAllFAQList} />}
                                >
                                    <p>{item.answer}  </p>
                                </Collapse.Panel>
                            </Collapse>
                        </Col>
                    ))}
                </Row>
                
            </div>
        </section>



    );
}




export default FaqList