import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { Layout, Menu, Breadcrumb, Row, Col, Button, Avatar, Popover, Divider } from "antd";
import {
  AreaChartOutlined,
  BellOutlined,
  ContactsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import SearchableDashboardTable from "./DashboardTable";

const { Header, Content, Sider } = Layout;

const ClinicianDashboard = ({ logout }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [patients, setPatients] = useState([]);

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

  useEffect(() => {
    let cancelled = false;

    const getPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/getPatients/", {
          method: "POST",
          headers: { jwt_token: localStorage.token }
        });
        const parseData = await res.json();
        console.log(parseData);
        if (!cancelled) {
          setPatients(parseData);
        }
      } catch(err) {
        console.error(err.message);
      }
    }
    getPatients();
    return () => cancelled = true; 
  }, []);

  let myPatients = [];
  for (var i = 0; i < patients.length; i++) {
    myPatients.push(<h3 key={i} className="text-info"><Link to={`/dashboard/${patients[i].user_id}`}>{patients[i].user_name}</Link></h3>)
  }

  const content = (
    <div>
      <p>Name: {name}</p>
      <p>Email：{email}</p>
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
          <Menu defaultSelectedKeys={["1"]} mode="inline" style={{height: '100%'}}>
            <Menu.Item key="1" icon={<AreaChartOutlined o/>}>
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
            <div>
              <h5 className="mt-5 text-success">Clinician {name} </h5>
              <h1 className="mb-5">My Patients</h1>
              <Divider />
              <SearchableDashboardTable />
              <Divider />
              <Link to="/addPatients">
                <button className="btn btn-primary mt-5 mr-5"> Add Patients </button>
              </Link>
              {/*<Linechart />*/}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ClinicianDashboard;

