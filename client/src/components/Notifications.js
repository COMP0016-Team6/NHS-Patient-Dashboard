import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, Redirect } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Input, Alert, Row, Col, Avatar, Popover, Button , Divider } from "antd";
import {
  DesktopOutlined,
  AreaChartOutlined,
  BellOutlined,
  ContactsOutlined,
  UserOutlined
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const Notifications = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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
        }
        
      } catch (err) {
        console.error(err.message);
      }
    };
    getProfile();
    return () => cancelled = true; 
  }, []);

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logged out Successfully");
    } catch (err) {
      console.error(err.message);
    }
  };

  const content = (
    <div>
      <p>{name}</p>
      <p>{email}</p>
      <Divider />
      <Row>
        <Col offset={5}>
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
          <Menu defaultSelectedKeys={["2"]} mode="inline" style={{height: '100%'}}>
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
            <Alert message="Success" description="This is a success notice." type="success" showIcon closable/> 
            <br/>
            <Alert message="Information" description="This is a information notice." type="info" showIcon closable/> 
            <br/>
            <Alert message="Warning" description="This is a warning notice." type="warning" showIcon closable/>
            <br/>
            <Alert message="Error" description="This is a error notice." type="error" showIcon closable/> 
            <br/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Notifications;

