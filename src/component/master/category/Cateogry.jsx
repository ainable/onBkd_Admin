import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Button, Form, Image, Input, Pagination, Statistic, Typography, message } from "antd";
import '../../../style/master.css'
import { useLocation, useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { FetchAllBrandList, FetchAllCategoryList } from "../../../service/api_services";
import { useAuth } from "../../../authentication/context/authContext";
import { FaUser } from "react-icons/fa";
import { SearchOutlined } from '@ant-design/icons';


const { Title } = Typography;
const columns = [
    {
        title: 'Category ID',
        dataIndex: 'categoryID',
        key: 'categoryID',
        // render: (_, { brnadID }) => (<Tag color="blue">{brnadID}</Tag>)
        render: categoryID => <Tag color="blue"><strong>{categoryID}</strong></Tag>

    },
    {
        title: 'Image',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: (_, { imageUrl }) => (
            <div className="show_cat_img" >
                {imageUrl != null ? <Image src={imageUrl} width={50} height={50} style={{ borderRadius: "100%", objectFit: "contain", background: "lightGray" }} /> : <Avatar size={45} icon={<FaUser />} />}

            </div>
        )
    },
    {
        title: 'Category Name',
        dataIndex: 'categoryName',
        key: 'categoryName',
    },


    {
        title: 'Category Code',
        dataIndex: 'categoryCode',
        key: 'categoryCode',
        render: categoryCode => <strong>{categoryCode}</strong>

    },


];



function Cateogry() {

    const location = useLocation();
    const navigate = useNavigate()
    const { token, logout } = useAuth();

    const [searchInput, setSearchInput] = useState(null)
    const [brandList, setBrandList] = useState([])
    const [isLoading, setIsLoading] = useState(false);


    const [totalPage, setTotalPage] = useState(null);

    const [current, setCurrent] = useState(1);

    const onChange = (page) => {
        setCurrent(page);
        setIsLoading(true);
        console.log("page", page);
    };

    const shhowAllBrandList = async () => {
        try {
            await FetchAllCategoryList(token, current, searchInput)
                .then((res) => {
                    console.log(" all category list ", res);
                    if (res.status == 200) {
                        setBrandList(res.data.data.paginatedData);
                        setTotalPage(res.data.data.totalPage)
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
        shhowAllBrandList();
    }, [current,searchInput]);

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
                    <div className="content_title">
                        <Title level={4}>Category List</Title>
                    </div>
                    <div className="content_add">
                        {/* <AddCategory /> */}
                        <Form.Item>
                            <Input
                                style={{ width: '200px' }}
                                allowClear
                                placeholder="Search Category"
                                suffix={<SearchOutlined />}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </Form.Item>
                    </div>
                </div>
                <div className="content">
                    <div className="shoo_recent_order">
                        {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={columns} dataSource={brandList} scroll={{ x: true }} pagination={false}
                            footer={() => <div className="pagination">
                                <Pagination current={current} onChange={onChange} total={totalPage * 10} />
                            </div>} />}
                    </div>
                </div>


            </div>

        </section >
    );
}




export default Cateogry