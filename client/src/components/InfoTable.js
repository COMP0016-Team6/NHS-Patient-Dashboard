import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import { Link, Redirect } from "react-router-dom";
import DrawerForm from './Drawer';
import { SearchOutlined } from '@ant-design/icons';

class SearchableInfoTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      patients: [],
      searchText: '',
      searchedColumn: '',
    };
  }

  componentDidMount() {
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
          this.setState({patients: parseData});
        }
      } catch(err) {
        console.error(err.message);
      }
    }
    getPatients();
    return () => cancelled = true; 
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text => text,

  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: '10%',
        sorter: (a, b) => a.age - b.age,
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('age'),
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        width: '10%',
        ...this.getColumnSearchProps('gender'),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '20%',
        ...this.getColumnSearchProps('email'),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: () => (
        <DrawerForm />
        )
      }
    ];
    const data = [];
      for (let i = 0; i < this.state.patients.length; i++) {
        data.push({
          key: i,
          name: <Link to={`/patientInfo/${this.state.patients[i].user_id}`}>{this.state.patients[i].user_name}</Link>,
          age: this.state.patients[i].patient_age,
          gender: this.state.patients[i].patient_gender,
          email: this.state.patients[i].user_email,
        });
    }
    return <Table columns={columns} dataSource={data} />;
  }
}

export default SearchableInfoTable;