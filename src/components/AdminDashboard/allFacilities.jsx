// components/AllFacilities.jsx
import React from "react";
import { Input, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "Facility Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "State",
    dataIndex: "state",
    key: "state",
  },
  {
    title: "Registration Date",
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
  name: "Mercy Life",
  type: "Hospital",
  state: "Lagos",
  date: "01 May 2025",
  status: "Verified",
}));

const AllFacilities = () => {
  return (
    <div className="p-0 ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">All Facilities</h2>
        <div className="w-full md:w-80">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search"
            className="rounded-xl h-10"
          />
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

export default AllFacilities;
