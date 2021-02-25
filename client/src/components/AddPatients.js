import React, { Fragment, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { Layout, Menu, Breadcrumb, Divider, Table } from "antd";
import {
  AreaChartOutlined,
  BellOutlined,
  ContactsOutlined,
  SwapLeftOutlined
} from "@ant-design/icons";
import SearchableAddPatientsTable from "./AddPatientsTable";

const { Header, Content, Sider } = Layout;

const AddPatients = () => {
  const [patient_list, setPatientList] = useState([]);

  const onChange = e =>
    setPatientList(e.target.value);

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost:5000/myPatients/add",
        {
          method: "POST",
          headers: { 
            jwt_token: localStorage.token, 
            "Content-type": "application/json"
          },
          body: JSON.stringify({patient_list})
        }
      );
      const parseData = await res.json();
      if (parseData.result === "success") {
        toast.success("Patients are successfully added!");
      } else {
        toast.success(parseData);
      }
    } catch (err) {
        console.error(err.message);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
        <Header className="header">
        <div className="logo" />
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
            <Link to="/dashboard">
                <button className="btn btn-primary mt-5"><SwapLeftOutlined /> Back</button>
            </Link>
            <Divider/>
                <form onSubmit={onSubmitForm}>
                    <SearchableAddPatientsTable />
                    <Divider/>
                    <button className="btn btn-primary btn-block">Submit</button>
                </form>
            </Content>
        </Layout>
        </Layout>
    </Layout>
  )
}

export default AddPatients;