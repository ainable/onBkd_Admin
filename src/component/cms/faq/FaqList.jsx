import { Collapse, Empty, Segmented, Space } from "antd";
import React, { useEffect, useState } from "react";
import "../../../style/location.css"
import { Col, Row } from "react-bootstrap";
import AddFaq from "./AddFaq";
import { useAuth } from "../../../authentication/context/authContext";
import FaqAction from "./FaqAction";
import { FetchFAQList } from "../../../service/api_services";

function FaqList() {
    const { token } = useAuth();
    const [faqData, setFaqdata] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [types, setTypes] = useState("USER")

    const ShowAllFAQList = async () => {
        setIsLoading(true)
        try {
            await FetchFAQList(token, types)
                .then((res) => {
                    console.log("faq list", res);
                    if (res.status == 200) {
                        setIsLoading(false);
                        setFaqdata(res.data.data);
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
    }, [types]);

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
                    {isLoading ? (
                        <div className="loader_main">
                            <span class="loader2"></span>
                        </div>
                    ) :
                        faqData.length === 0 ? (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No FAQs Found" />
                        ) : (
                            <Collapse
                                accordion
                                className="faq_custom"
                                 expandIconPosition="start"
                            >
                                {faqData.map((item, index) => (
                                    <Collapse.Panel
                                        key={item.faq_id}
                                        header={
                                            <div className="faq_header">
                                                <div className="faq_circle">{index + 1}</div>

                                                <div className="faq_title">
                                                    {item.question}
                                                </div>
                                            </div>
                                        }
                                        extra={
                                            <FaqAction
                                                faqEditDtata={item}
                                                ShowAllFAQList={ShowAllFAQList}
                                            />
                                        }
                                    >
                                        <div className="faq_answer">
                                            {item.answer}
                                        </div>
                                    </Collapse.Panel>
                                ))}
                            </Collapse>
                        )}
                </Row>
            </div>
        </section>
    );
}

export default FaqList