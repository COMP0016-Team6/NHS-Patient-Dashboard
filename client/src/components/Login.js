import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { Row, Col, Layout, Breadcrumb } from "antd";

const { Header, Content, Footer } = Layout;

const Login = ({ setAuth, setIsClinician }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

  const { email, password } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { email, password };
      const response = await fetch(
        "http://localhost:5000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );

      const parseRes = await response.json();
      
      // console.log(parseRes);
    
      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        setAuth(true);
        toast.success("Logged in Successfully");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }

      parseRes.user.user_role === "Clinician"? setIsClinician(true) : setIsClinician(false);
      
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Layout className="loginLayout">
    <Header>
      <img height="40px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/NHS-Logo.svg/200px-NHS-Logo.svg.png"/>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
      </Breadcrumb>
      <div className="site-layout-content">
        <br/><br/><br/><br/><br/><br/>
        <Row justify="space-around" align="middle">
          <Col span={10}>
          <h1 className="mt-5 text-center">Login</h1>
            <form onSubmit={onSubmitForm}>
              <input
                type="text"
                name="email"
                placeholder="email"
                value={email}
                onChange={e => onChange(e)}
                className="form-control my-3"
              />
              <input
                type="password"
                name="password"
                placeholder="password"
                value={password}
                onChange={e => onChange(e)}
                className="form-control my-3"
              />
              <button className="btn btn-primary  btn-block">Submit</button>
            </form>
            <Link to="/register">register</Link>
          </Col>
          <Col span={8}>
            <img src="https://www.gosh.nhs.uk/static/images/logo.e57c277b2a23.svg" />
          </Col>
        </Row>
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>UCL-GOSH Dashboard ©2020-2021 Created by COMP0016 Team6</Footer>
  </Layout>
  );
};

export default Login;