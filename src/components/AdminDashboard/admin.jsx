import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Table,
  Tag,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Space,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../services/admin";

const { Option } = Select;

const AdminList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [form] = Form.useForm();

  // Fetch admins from API
  const fetchAdmins = async (params = {}) => {
    setLoading(true);
    try {
      const response = await getAdmins({
        page: params.current || 1,
        limit: params.pageSize || 10,
        search: searchText,
        ...params,
      });

      if (response.success) {
        setData(
          response.data.map((admin) => ({
            ...admin,
            key: admin._id,
          }))
        );
        setPagination({
          current: response.pagination.current,
          pageSize: response.pagination.pageSize,
          total: response.pagination.total,
        });
      }
    } catch (error) {
      message.error(error.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    fetchAdmins({ current: 1, pageSize: pagination.pageSize });
  };

  // Handle pagination change
  const handleTableChange = (paginationInfo) => {
    fetchAdmins(paginationInfo);
  };

  // Show modal for add/edit
  const showModal = (admin = null) => {
    setEditingAdmin(admin);
    if (admin) {
      form.setFieldsValue({
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        phone: admin.phone,
        accessType: admin.accessType,
      });
    }
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingAdmin(null);
    form.resetFields();
  };

  // Handle form submit
  const onFinish = async (values) => {
    try {
      if (editingAdmin) {
        // Update existing admin
        const response = await updateAdmin(editingAdmin._id, values);
        if (response.success) {
          message.success("Admin updated successfully!");
          fetchAdmins({
            current: pagination.current,
            pageSize: pagination.pageSize,
          });
        }
      } else {
        // Create new admin
        const response = await createAdmin(values);
        if (response.success) {
          message.success("Admin created successfully!");
          fetchAdmins({
            current: pagination.current,
            pageSize: pagination.pageSize,
          });
        }
      }
      handleCancel();
    } catch (error) {
      message.error(error.message || "Operation failed");
    }
  };

  // Handle delete
  const handleDelete = async (adminId) => {
    try {
      const response = await deleteAdmin(adminId);
      if (response.success) {
        message.success("Admin deleted successfully!");
        fetchAdmins({
          current: pagination.current,
          pageSize: pagination.pageSize,
        });
      }
    } catch (error) {
      message.error(error.message || "Failed to delete admin");
    }
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,
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
      title: "Access Type",
      dataIndex: "accessType",
      key: "accessType",
      render: (accessType) => {
        const colors = {
          superAdmin: "red",
          admin: "blue",
          editor: "green",
        };
        return <Tag color={colors[accessType]}>{accessType}</Tag>;
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Date Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this admin?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Admin Management</h2>
        <div className="w-full md:w-80 flex gap-2">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search admins..."
            className="rounded-xl h-10"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            onPressEnter={(e) => handleSearch(e.target.value)}
          />
          <Button
            type="primary"
            className="h-10 rounded-xl"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Add Admin
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          className="overflow-x-auto rounded-xl"
        />
      </div>

      <Modal
        title={editingAdmin ? "Edit Admin" : "Add New Admin"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="text-center"
      >
        <Form
          form={form}
          name="adminForm"
          onFinish={onFinish}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please input the full name!" }]}
          >
            <Input className="py-3" placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input className="py-3" placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input className="py-3" placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please input the role!" }]}
          >
            <Input
              className="py-3"
              placeholder="Enter role (e.g., Manager, Assistant)"
            />
          </Form.Item>

          <Form.Item
            name="accessType"
            label="Access Type"
            rules={[
              { required: true, message: "Please select an access type!" },
            ]}
            className="text-start"
          >
            <Select placeholder="Select access type" className="h-12">
              <Option value="admin">Admin</Option>
              <Option value="superAdmin">Super Admin</Option>
              <Option value="editor">Editor</Option>
            </Select>
          </Form.Item>

          {!editingAdmin && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input the password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password className="py-3" placeholder="Enter password" />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              {editingAdmin ? "Update Admin" : "Add Admin"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminList;
