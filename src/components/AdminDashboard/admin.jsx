// components/AllFacilities.jsx
import React from "react";
import { Button, Input, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Date Joined",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => <Tag color="green">{status}</Tag>,
  },
];

const data = Array.from({ length: 12 }).map((_, index) => ({
  key: index,
  name: "Admin User",
  email: "admin@example.com",
  role: "Super Admin",
  date: "01 May 2025",
  status: "Active",
}));

const AdminList = () => {
  return (
    <div className="p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Admin Management</h2>
        <div className="w-full md:w-80 flex gap-2">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search"
            className="rounded-xl h-10"
          />
          <Button type="primary" className="h-10 rounded-xl" >
            Add Admin
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="overflow-x-auto rounded-xl"
        />
      </div>
    </div>
  );
};

export default AdminList;
