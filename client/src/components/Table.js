import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import { Link, Redirect } from "react-router-dom";
import DrawerForm from './Drawer';
import { SearchOutlined } from '@ant-design/icons';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend', 'ascend'],
    render: (text) => <Link to="/Info">{ text }</Link>
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    filters: [
      {
        text: "Male",
        value: "Male",
      },
      {
        text: "Female",
        value: "Female",
      },
    ]
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: () => (
    <DrawerForm />
    )
  }
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    gender: "Male",
    email: "john.brown@gmail.com",
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42, 
    gender: "Female",
    email: "jim.green@gmail.com",
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    gender: "Male",
    email: "joe.black@gmail.com",
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    gender: "Female",
    email: "jim.red@gmail.com",
    address: 'London No. 2 Lake Park',
  },
];

class SearchableTable extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
  };

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
        render: (text) => <Link to="/Info">{ text }</Link>
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
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        ...this.getColumnSearchProps('address'),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: () => (
        <DrawerForm />
        )
      }
    ];
    return <Table columns={columns} dataSource={data} />;
  }
}

export default SearchableTable;