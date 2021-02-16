import React, { useEffect, useState } from "react";
import SearchableTable from "./Table";
import { toast } from "react-toastify";
import { Link, Redirect } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Avatar, Row, Col, Popover, Button, Divider } from "antd";
import {
  DesktopOutlined,
  AreaChartOutlined,
  BellOutlined,
  ContactsOutlined,
  UserOutlined
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

const Contacts = ({ setAuth }) => {
  const [name, setName] = useState("");

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/contacts/", {
        method: "POST",
        headers: { jwt_token: localStorage.token }
      });

      const parseData = await res.json();
      setName(parseData.user_name);
    } catch (err) {
      console.error(err.message);
    }
  };

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
      <p>henry@gmail.com</p>
      <Divider />
      <Row>
        <Col offset={5}>
          <Button danger onClick={e => logout(e)}>logout</Button>
        </Col>
      </Row>
    </div>
  );

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
        <Sider>
          <div className="logo">      
          </div>
          <Menu theme="dark" defaultSelectedKeys={["4"]} mode="inline">
            <Menu.Item key="1" icon={<AreaChartOutlined />}>
              <Link to="/Dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              Tasks
            </Menu.Item>
            <Menu.Item key="3" icon={<BellOutlined />}>
              <Link to="/Notifications">Notifications</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<ContactsOutlined />}>
              <Link to="/Contacts">Contacts</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background">
            <Row>
              <Col offset={23}>
                <Popover content={content} title="Title" trigger="click">
                  <Avatar size="large" icon={<UserOutlined />} />
                </Popover>
              </Col>
            </Row>
          </Header>
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <div className="container">
                <SearchableTable />
              </div>
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            GOSH ©2020-2021 Created by COMP0016 Team6
          </Footer>
        </Layout>
    </Layout>
  );
};

export default Contacts;