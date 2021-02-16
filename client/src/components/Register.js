import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { Row, Col, Layout, Breadcrumb } from "antd";

const { Header, Content, Footer } = Layout;

const Register = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: ""
  });

  const { email, password, name } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { email, password, name };
      const response = await fetch(
        "http://localhost:5000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );
      const parseRes = await response.json();

      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        setAuth(true);
        toast.success("Register Successfully");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
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
              <h1 className="mt-5 text-center">Register</h1>
              <form onSubmit={onSubmitForm}>
                <input
                  type="text"
                  name="email"
                  value={email}
                  placeholder="email"
                  onChange={e => onChange(e)}
                  className="form-control my-3"
                />
                <input
                  type="password"
                  name="password"
                  value={password}
                  placeholder="password"
                  onChange={e => onChange(e)}
                  className="form-control my-3"
                />
                <input
                  type="text"
                  name="name"
                  value={name}
                  placeholder="name"
                  onChange={e => onChange(e)}
                  className="form-control my-3"
                />
                <button className="btn btn-primary btn-block">Submit</button>
              </form>
              <Link to="/login">login</Link>
            </Col>
            <Col span={8}>
              <img src="https://www.gosh.nhs.uk/static/images/logo.e57c277b2a23.svg" />
            </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>GOSH ©2020-2021 Created by COMP0016 Team6</Footer>
    </Layout>
  );
};

export default Register;