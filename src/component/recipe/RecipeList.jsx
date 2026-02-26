import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Button, Image, Pagination, Popconfirm, Statistic, Typography, message } from "antd";
import '../../style/master.css'
import { useLocation, useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { deleteRecipe, fetchRacipeList } from "../../service/api_services";
import { useAuth } from "../../authentication/context/authContext";
import AddNewRecipe from "./AddNewRecipe";
import DefaultLogo from "../../assest/png/racipe.png"


function RecipeList() {
    const location = useLocation();
    const navigate = useNavigate()
    const { token, logout } = useAuth();
    const [racipeList, setRacipeList] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(null);
    const [current, setCurrent] = useState(1);

    const { Title } = Typography;



    const cancel = (e) => {
        console.log(e);
        message.error('Click on No');
    };
    const columns = [

        {
            title: 'Image',
            dataIndex: 'recipeImages',
            key: 'recipeImages',
            render: (_, { recipeImages }) => (
                <div className="show_cat_img" >
                    {recipeImages ? <Image src={recipeImages[0]} width={40} height={40} style={{ borderRadius: "100%", objectFit: "contain", background: "lightGray" }} /> : <Avatar size={40} src={DefaultLogo} />}

                </div>
            )
        },
        {
            title: 'Title',
            dataIndex: 'recipeTitle',
            key: 'recipeTitle',
            ellipsis: true,
            render: recipeTitle => <strong>{recipeTitle}</strong>
        },
        {
            title: 'Cooking Time',
            dataIndex: 'cookingTime',
            key: 'cookingTime',
            ellipsis: true,

        },
        {
            title: 'Description',
            dataIndex: 'recipeDescription',
            key: 'recipeDescription',
            render: recipeDescription => <span>{recipeDescription?.substr(0, 20)}.</span>,

            ellipsis: true,


        },
        {
            title: 'No. of Ingredients',
            dataIndex: 'ingredients',
            key: 'ingredients',
            ellipsis: true,
            // render: productName => <strong>{productName}</strong>

        },
        {
            title: 'No. of Steps',
            dataIndex: 'cookingSteps',
            key: 'cookingSteps',
            ellipsis: true,
            render: cookingSteps => <span>{cookingSteps?.length}</span>

        },
        {
            title: 'Create At',
            dataIndex: 'addedDate',
            key: 'addedDate',
            // render: productName => <strong>{productName}</strong>

        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => <Tag color={status === "ACTIVE" ? "green" : "red"} bordered={false}>{status}</Tag>

        },

        {
            title: 'Action',
            dataIndex: '_id',
            fixed: "right",
            key: '_id',
            render: (_, { _id }) => (
                <Space>
                    <Popconfirm
                        title="Delete the Recipe"
                        description="Are you sure to delete this Recipe?"
                        onConfirm={()=>deleteRecipeHandler(_id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger shape="round">Delete</Button>
                    </Popconfirm>

                    <Button type="primary" onClick={() => navigate(`/dashboard/recipe-details/${_id}`)} shape="round">View </Button>
                </Space>
            )

        },
    ];

    const onChange = (page) => {
        setCurrent(page);
        setIsLoading(true);
        console.log("page", page);
    };

    const showAllRacipeList = async () => {
        try {
            await fetchRacipeList(token, current)
                .then((res) => {
                    console.log(" racipe  list ", res);
                    if (res.status == 200) {
                        setRacipeList(res.data.data.data);
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
        showAllRacipeList();
    }, [current]);

    const deleteRecipeHandler = async (id) => {
        try {
            const res = await deleteRecipe(id, token);
            if (res.status === 201) {
                message.success(res.data.message);
                showAllRacipeList();
            }
        } catch (error) {
            console.log(error);
            setIsLoading(true);
        }
    };
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
                        <Title level={4}>Recipe List</Title>
                    </div>
                    <div className="content_add">
                        <AddNewRecipe showAllRacipeList={showAllRacipeList} />
                    </div>
                </div>
                <div className="content">
                    <div className="shoo_recent_order">
                        {!isLoading ? <div className="loader_main"> <span class="loader2"></span></div> : <Table columns={columns} dataSource={racipeList} scroll={{ x: true }} pagination={false}
                            footer={() => <div className="pagination">
                                <Pagination current={current} onChange={onChange} total={totalPage * 10} />
                            </div>} />}
                    </div>
                </div>
            </div>

        </section>
    );
}




export default RecipeList