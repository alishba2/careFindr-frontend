import React, { useState } from "react";
import { Button, Input, Table, Tag, Modal, Form, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

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

const AdminList = () => {
  const [data, setData] = useState(
    Array.from({ length: 12 }).map((_, index) => ({
      key: index,
      name: "Admin User",
      email: "admin@example.com",
      role: "Super Admin",
      date: "01 May 2025",
      status: "Active",
    }))
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    const newAdmin = {
      key: data.length,
      name: values.name,
      email: values.email,
      role: values.role,
      date: "01 Jul 2025", // Current date
      status: "Active",
    };
    setData([...data, newAdmin]);
    setIsModalVisible(false);
    form.resetFields();
    message.success("Admin added successfully!");
  };

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
          <Button type="primary" className="h-10 rounded-xl" onClick={showModal}>
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

      <Modal
        title="Add New Admin"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="text-center"
      >
        <Form
          form={form}
          name="addAdmin"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input className="py-3" placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input className="py-3"  placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
            className="text-start"
          >
            <Select placeholder="Select a role" className="h-12">
              <Option value="Admin">Admin</Option>
              <Option value="Super Admin">Super Admin</Option>
              <Option value="Editor">Editor</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Add Admin
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminList;