import React from 'react';
import { Table, Radio, Input, Space, Button } from 'antd';
import { SearchOutlined } from "@ant-design/icons";

class SearchableAddPatientsTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          patients: [],
          searchText: '',
          searchedColumn: '',
          selectedRowKeys: [],
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
    
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    
    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
          selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ],
        };
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.length - b.name.length,
                sortDirections: ['descend', 'ascend'],
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                sorter: (a, b) => a.email.length - b.email.length,
                sortDirections: ['descend', 'ascend'],
            },
          ];
          
        const data = [];
        for (let i = 0; i < this.state.patients.length; i++) {
            data.push({
              key: i,
              name: this.state.patients[i].user_name,
              email: this.state.patients[i].user_email,
            });
        }
        return <Table rowSelection={rowSelection} columns={columns} dataSource={data} />;
    }
}

export default SearchableAddPatientsTable;