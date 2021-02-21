import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Image, Tabs, Row, Col, Empty, Button, Avatar, Popover, Divider } from "antd";
import {
  DesktopOutlined,
  AreaChartOutlined,
  BellOutlined,
  ContactsOutlined,
  UserOutlined
} from "@ant-design/icons";
import DrawerForm from "./Drawer";

const { Header, Content, Footer, Sider } = Layout;
const { TabPane } = Tabs;

const Info = ({ setAuth }) => {
  const [name, setName] = useState("");

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/info/", {
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
    <Layout style={{ minHeight: '100vh' }}>
    <Header className="header">
      <div className="logo" />
      <Row>
        <Col offset={23}>
          <Popover content={content} title="Title" trigger="click">
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
          <h1 className="mb-5 text-center">John Brown</h1>
          <Row>
            <Col span={9} offset = {2}>
              <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
            </Col>
            <Col span={9} offset={2}>
              <div className="card-container">
                <Tabs type="card" defaultActiveKey="3">
                  <TabPane tab="Background" key="1">
                    <Empty
                      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                      imageStyle={{ height: 60, }}
                      description="Customize Description">
                      <Button type="primary"><DrawerForm /></Button>
                    </Empty>
                  </TabPane>
                  <TabPane tab="Diagonsis" key="2">
                    <Empty
                      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                      imageStyle={{ height: 60, }}
                      description="Customize Description">
                      <Button type="primary"><DrawerForm /></Button>
                    </Empty>
                  </TabPane>
                  <TabPane tab="Treatment" key="3">
                    <Empty
                      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                      imageStyle={{ height: 60, }}
                      description="Customize Description">
                      <Button type="primary"><DrawerForm /></Button>
                    </Empty>
                  </TabPane>
                </Tabs>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  </Layout>
  );
};

export default Info;



