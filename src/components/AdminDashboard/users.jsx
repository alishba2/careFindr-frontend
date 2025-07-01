import React from "react";
import { Table, Tag } from "antd";

const Users = () => {
  // Dummy data for the Users table
  const dummyData = [
    {
      key: "1",
      name: "John Doe",
      sex: "Male",
      address: "ABC Suite 3l",
      phoneNumber: "0000000000",
      insuranceDetails: "Yes / Company name",
      conversations: 5,
    },
    {
      key: "2",
      name: "Jane Smith",
      sex: "Female",
      address: "XYZ Lane 12",
      phoneNumber: "1111111111",
      insuranceDetails: "No",
      conversations: 2,
    },
    {
      key: "3",
      name: "Alice Johnson",
      sex: "Female",
      address: "PQR Street 5",
      phoneNumber: "2222222222",
      insuranceDetails: "Yes / Health Inc",
      conversations: 8,
    },
    {
      key: "4",
      name: "Bob Brown",
      sex: "Male",
      address: "LMN Avenue 9",
      phoneNumber: "3333333333",
      insuranceDetails: "No",
      conversations: 0,
    },
  ];

  // Define columns for the table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Insurance Details",
      dataIndex: "insuranceDetails",
      key: "insuranceDetails",
    },
    {
      title: "Conversations",
      dataIndex: "conversations",
      key: "conversations",
      render: (text) => <span>{text} {text > 0 ? "Messages" : "No Messages"}</span>,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <div className="bg-white rounded-xl shadow">
        <Table
          columns={columns}
          dataSource={dummyData}
          pagination={false} // Disable pagination for simplicity; add if needed
          className="overflow-x-auto rounded-xl"
        />
      </div>
    </div>
  );
};

export default Users;