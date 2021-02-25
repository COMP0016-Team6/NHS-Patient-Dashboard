import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { Layout, Menu, Breadcrumb, Image, Tabs, Row, Col, Empty, Button, Avatar, Popover, Divider } from "antd";
import {
  DesktopOutlined,
  AreaChartOutlined,
  BellOutlined,
  ContactsOutlined,
  UserOutlined
} from "@ant-design/icons";
import DrawerForm from "./Drawer";

const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;

const PatientInfo = ({ match }) => {
  const initialInfo = {
    patient_name: "",
    patient_email: "",
    patient_gender: "",
    patient_age: "", // change to DOB
    diagnostic_conclusion: ""
  };

  const [info, setInfo] = useState(initialInfo);

  useEffect (() => {
    let cancelled = false;
    const getPatientInfo = async() => {
      try {
        const res = await fetch(`http://localhost:5000/patientInfo/?id=${match.params.id}`, {
            method: "POST",
            headers: { jwt_token: localStorage.token,
              "Content-type": "application/json"
            }
        });
        const parseData = await res.json();
        
        if (!cancelled) {
          setInfo({
            patient_name: parseData.user_name,
            patient_email: parseData.user_email,
            patient_gender: parseData.patient_gender,
            patient_age: parseData.patient_age,
            diagnostic_conclusion: parseData.diagnostic_conclusion
          });
        }
        console.log(parseData);
      } catch(err) {
          console.error(err.message);
      }
    };
    getPatientInfo();
    return () => cancelled = true; 
  }, []);
  
  // edit the returning jsx
  return (
    <>
      {
      info == initialInfo? null :
      (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="header">
            <div className="logo" />
            </Header>
            <Layout>
            <Sider collapsible width={200} className="site-layout-background">
                <Menu defaultSelectedKeys={["3"]} mode="inline" style={{height: '100%'}}>
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
                <h1 className="mb-5 text-center">{info.patient_name}</h1>
                <Row>
                    <Col span={9} offset = {2}>
                    <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                    </Col>
                    <Col span={9} offset={2}>
                    <div className="card-container">
                        <Tabs type="card" defaultActiveKey="3">
                        <TabPane tab="Background" key="1">
                        <div>
                            <p>{info.patient_name} ({info.patient_email})</p>
                            <p>Age: {info.patient_age}. Gender: {info.patient_gender}</p>
                        </div>
                        </TabPane>
                        <TabPane tab="Diagonsis" key="2">
                            <p>{info.diagnostic_conclusion}</p>
                        </TabPane>
                        <TabPane tab="Treatment" key="3">
                            <Empty
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            imageStyle={{ height: 60, }}
                            description="No Data">
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
      ) 
      }
    </>
  )
}

export default PatientInfo;


