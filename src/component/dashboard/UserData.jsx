import { Card } from 'antd'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import './dashboard.css'
import CountUp from 'react-countup'
import { fetchDashboardCount } from '../../service/api_services'
import { useAuth } from '../../authentication/context/authContext'




function UserData() {
    const { token } = useAuth()
    const [countData, setCountData] = useState([])

    const userChartInfo = [
        {
            id: 1,
            title: "Customers",
            count: countData?.customerCount,
            url: "https://cdn3d.iconscout.com/3d/free/thumb/free-user-3814118-3187499.png?f=webp"
        },
        {
            id: 2,
            title: "Partners",
            count: countData?.vendorsCount,
            url: "https://i.pinimg.com/originals/d9/12/2c/d9122c6457d92ab4c36aaac135246ab3.png"
        },
        {
            id: 3,
            title: "Orders ",
            count: countData?.totalOrderCount,
            url: "https://cdn3d.iconscout.com/3d/premium/thumb/order-list-5763046-4833547.png?f=webp"
        },
        {
            id: 4,
            title: "Revenue",
            count: countData?.totalRevenue,
            url: "https://cdn3d.iconscout.com/3d/premium/thumb/profit-graph-5328524-4445731.png"

        },

    ]
    async function fetchCountData() {
        try {
            const response = await fetchDashboardCount(token)
            if (response.status === 200) {
                console.log(response)
                setCountData(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCountData()
    }, [])

    return (
        <div className='show_user_chat'>
            <Row>
                {userChartInfo.map((item) => (
                    <Col md={3}>
                        <div className="user_counts">

                            <Card hoverable>
                                <div className='user_data_item'>
                                    <div className="user_chart_logo">
                                        <img src={item.url} />
                                    </div>
                                    <div className="user_chart_text">
                                        <p>{item.title}</p>
                                        {/* <p>{item.count}</p> */}
                                        <CountUp delay={1} end={item.count} style={{ fontSize: "1.5rem", fontWeight: "600" }} />
                                    </div>
                                </div>
                                <div className="order_car_design">
                                    <img src='https://png.pngtree.com/png-vector/20230320/ourmid/pngtree-abstract-poster-background-vector-png-image_6658842.png' />
                                </div>
                            </Card>
                        </div>
                    </Col>
                )
                )}
            </Row>
        </div>
    )
}

export default UserData