import React from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select } from 'antd';

const { Option } = Select;

class DrawerForm extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <>
        <a type="primary" onClick={this.showDrawer}>
          Edit Profile
        </a>
        <Drawer
          title="Edit a new patient's profile"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div style={{ textAlign: 'right',}}>
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.onClose} type="primary">
                Submit
              </Button>
            </div>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: "Please enter patient's name" }]}
                >
                  <Input placeholder="Please enter name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="age"
                  label="Age"
                  rules={[{ required: true, message: 'Please enter age' }]}
                >
                  <Input placeholder="Please enter age"/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true, message: "Please select patient's gender" }]}
                >
                  <Select placeholder="Please select a gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: "Please enter patient's loggin Email" }]}
                >
                  <Input placeholder="Please enter Email"/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="background"
                  label="Background"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the patient's background",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="Please enter the patient's background" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="diagnosis"
                  label="Diagnosis"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the patient's diagnosis",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="Please enter the patient's diagnosis" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="treatment"
                  label="Treatment"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the patient's treatment",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="Please enter the patient's treatment" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </>
    );
  }
}

export default DrawerForm;