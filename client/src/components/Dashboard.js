import React, { useEffect, useState } from "react";
import Linechart from "./LineChart";
import { toast } from "react-toastify";
import { Link, Redirect } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Row, Col, Button, Avatar, Popover, Divider } from "antd";
import {
  AreaChartOutlined,
  BellOutlined,
  ContactsOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

const Dashboard = ({ logout }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [user_id, setUserId] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const getProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/dashboard/", {
          method: "POST",
          headers: { jwt_token: localStorage.token }
        });
        const parseData = await res.json();
        if (!cancelled) {
          setName(parseData.user_name);
          setEmail(parseData.user_email);
          setUserId(parseData.user_id);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getProfile();
    return () => cancelled = true; 
  }, []);

  const content = (
    <div>
      <p>Name: {name}</p>
      <p>Email：{email}</p>
      <Divider />
      <Row>
        <Col offset={7}>
          <Button danger onClick={e => logout(e)}>logout</Button>
        </Col>
      </Row>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header">
        <div className="logo" />
        <Row>
          <Col offset={22}>
            <Popover content={content} title="Your Proflie" trigger="click">
              <Avatar size="large" icon={<UserOutlined />} />
            </Popover>
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider collapsible width={200} className="site-layout-background">
          <Menu defaultSelectedKeys={["1"]} mode="inline" style={{height: '100%'}}>
            <Menu.Item key="1" icon={<AreaChartOutlined />}>
              <Link to="/Dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<BellOutlined />}>
              <Link to="/Notifications">Notifications</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ContactsOutlined />}>
              <Link to="/Contacts">Contacts</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <h1 className="mt-5">My Dashboard {user_id}</h1>
            {user_id === 0? null : <Linechart patient_id={user_id} />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;