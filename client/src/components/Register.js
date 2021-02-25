import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { Row, Col, Layout, Breadcrumb } from "antd";

const { Header, Content, Footer } = Layout;

const Register = ({ setAuth, setIsClinician }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
    role: "Patient",
    patient_list: "",
    age: "",
    gender: "Male",
    diagnosticConclusion: ""
  });
  // for now, no read/write. can do both by default.
  const { email, password, name, role, patient_list, age, gender, diagnosticConclusion } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      // pass in other data to fill in the patients table
      const body = { email, password, name, role, patient_list, age, gender, diagnosticConclusion };
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
          <br/><br/>
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
                  
                  <select name="role" value={role} onChange={e => onChange(e)}>
                    <option value="Patient">Patient</option>
                    <option value="Clinician">Clinician</option>
                  </select>
                  
                  {inputs.role==="Clinician"? <input
                    type="text"
                    name="patient_list"
                    value={patient_list}
                    placeholder="patients emails (delimered by space)"
                    onChange={e => onChange(e)}
                    className="form-control my-3"
                    /> : (
                      // HANDLE THESE! Store those in the patients table, make sure the onchange works and Later verify the values of inputs
                      // make the diagnostic conclusion input a text box
                      <Fragment>
                        <input
                          type="text"
                          name="age"
                          value={age}
                          placeholder="age"
                          onChange={e => onChange(e)}
                          className="form-control my-3"
                        />
                
                        <select name="gender" value={gender} onChange={e => onChange(e)}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                
                        {/** Make this an extendable text box */}
                        <input
                          type="text"
                          name="diagnosticConclusion"
                          value={diagnosticConclusion}
                          placeholder="diagnosticConclusion"
                          onChange={e => onChange(e)}
                          className="form-control my-3"
                        />
                      </Fragment>
                      )
                  }   

                  <button className="btn btn-primary btn-block mt-5">Submit</button>
                </form>
              <Link to="/login">login</Link>
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

export default Register;