import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Table, Button } from "antd";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
} from "recharts";
import { useAuth } from "../../authentication/context/authContext";
import { fetchAnalytics } from "../../service/api_services";
import { ReloadOutlined } from "@ant-design/icons";

const COLORS = ["#1677ff", "#52c41a", "#faad14", "#ff4d4f", "#722ed1"];

function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();

    const getAnalysis = async () => {
        setIsLoading(true)
        try {
            const res = await fetchAnalytics(token);
            const data = res.data;
            setAnalytics(data)
            setIsLoading(false);
        } catch (error) {
            console.log(error.message);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAnalysis();
    }, []);

    const traffic = analytics?.traffic?.results?.[0] || {};
    const timeseries = analytics?.timeseries?.results || [];
    const browsers = analytics?.browsers?.results || [];
    const devices = analytics?.devices?.results || [];
    const pages = analytics?.pages?.results || [];
    const countries = analytics?.countries?.results || [];

    const chartData = timeseries.map((d) => ({
        time: new Date(d.beginTimeSeconds * 1000).toLocaleTimeString(),
        views: d.pageViews,
    }));

    const pageColumns = [
        { title: "Page URL", dataIndex: "pageUrl", key: "pageUrl" },
        { title: "Visits", dataIndex: "count", key: "count" },
    ];

    const countryColumns = [
        { title: "Country", dataIndex: "countryCode", key: "countryCode" },
        { title: "Visits", dataIndex: "count", key: "count" },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col>
                    <h2>Analytics Dashboard</h2>
                </Col>

                <Col>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        loading={isLoading}
                        onClick={getAnalysis}
                    >
                        Refresh
                    </Button>
                </Col>
            </Row>
            {isLoading ? (
                <div>Loading analytics...</div>
            ) : (
                analytics &&
                <>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card>
                                <Statistic title="Page Views" value={traffic.pageViews || 0} />
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card>
                                <Statistic title="Users" value={traffic.users || 0} />
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title="Avg Load Time"
                                    value={traffic.avgLoad?.toFixed(2) || 0}
                                    suffix="s"
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginTop: 20 }}>
                        <Col span={24}>
                            <Card title="Traffic">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="views"
                                            stroke="#1677ff"
                                            strokeWidth={3}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginTop: 20 }}>
                        <Col span={12}>
                            <Card title="Browsers">
                                <PieChart width={350} height={300}>
                                    <Pie
                                        data={browsers}
                                        dataKey="count"
                                        nameKey="facet"
                                        outerRadius={100}
                                        label
                                    >
                                        {browsers.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card title="Devices">
                                <PieChart width={350} height={300}>
                                    <Pie
                                        data={devices}
                                        dataKey="count"
                                        nameKey="facet"
                                        outerRadius={100}
                                        label
                                    >
                                        {devices.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginTop: 20 }}>
                        <Col span={12}>
                            <Card title="Top Pages">
                                <Table
                                    columns={pageColumns}
                                    dataSource={pages}
                                    pagination={false}
                                    rowKey="pageUrl"
                                />
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card title="Countries">
                                <Table
                                    columns={countryColumns}
                                    dataSource={countries}
                                    pagination={false}
                                    rowKey="countryCode"
                                />
                            </Card>
                        </Col>
                    </Row>
                </>

            )}
        </div>
    );
}

export default Analytics;
