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

      console.log(response, "Admin API response");

      // Handle different response structures
      let adminsData = [];
      let paginationData = {
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        total: 0,
      };

      if (response.success && response.admins) {
        // Structure: { success: true, admins: [...], pagination: {...} }
        adminsData = response.admins;
        if (response.pagination) {
          paginationData = {
            current: response.pagination.current,
            pageSize: response.pagination.pageSize,
            total: response.pagination.total,
          };
        } else {
          paginationData.total = response.admins.length;
        }
      } else if (response.admins) {
        // Structure: { admins: [...] }
        adminsData = response.admins;
        paginationData.total = response.admins.length;
      } else if (Array.isArray(response)) {
        // Structure: [admin1, admin2, ...]
        adminsData = response;
        paginationData.total = response.length;
      } else {
        console.error("Unexpected response structure:", response);
        message.error("Unexpected response format from server");
        return;
      }

      // Process admin data and add missing fields
      const processedData = adminsData.map((admin) => ({
        ...admin,
        key: admin._id,
        // Add default status if missing
        status: admin.status || 'active',
        // Ensure accessFunctions is array
        accessFunctions: admin.accessFunctions || [],
        // Add display name for better UX
        displayName: admin.fullName || `${admin.firstName || ''} ${admin.lastName || ''}`.trim(),
      }));

      setData(processedData);
      setPagination(paginationData);

    } catch (error) {
      console.error("Error fetching admins:", error);
      message.error(error.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText !== undefined) {
        fetchAdmins({ current: 1, pageSize: pagination.pageSize });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  // Handle search input change
  const handleSearch = (value) => {
    setSearchText(value);
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
        status: admin.status,
      });
    } else {
      form.resetFields();
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
      setLoading(true);
      let response;

      if (editingAdmin) {
        // Update existing admin
        response = await updateAdmin(editingAdmin._id, values);
      } else {
        // Create new admin
        response = await createAdmin(values);
      }

      // Handle different response structures
      if (response && (response.success !== false)) {
        message.success(
          editingAdmin 
            ? "Admin updated successfully!" 
            : "Admin created successfully!"
        );
        
        await fetchAdmins({
          current: pagination.current,
          pageSize: pagination.pageSize,
        });
        
        handleCancel();
      } else {
        throw new Error(response?.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving admin:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (adminId) => {
    try {
      setLoading(true);
      const response = await deleteAdmin(adminId);
      
      if (response && (response.success !== false)) {
        message.success("Admin deleted successfully!");
        await fetchAdmins({
          current: pagination.current,
          pageSize: pagination.pageSize,
        });
      } else {
        throw new Error(response?.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      message.error(error.message || "Failed to delete admin");
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,
      render: (text, record) => {
        return record.displayName || text || 'N/A';
      }
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
          moderator: "orange",
        };
        const color = colors[accessType] || "default";
        return (
          <Tag color={color}>
            {accessType?.charAt(0).toUpperCase() + accessType?.slice(1) || 'N/A'}
          </Tag>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || 'N/A',
    },
    {
      title: "Date Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        try {
          return date ? new Date(date).toLocaleDateString() : 'N/A';
        } catch (error) {
          return 'Invalid Date';
        }
      },
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => {
    //     const statusValue = status || 'active';
    //     return (
    //       <Tag color={statusValue === "active" ? "green" : "red"}>
    //         {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
    //       </Tag>
    //     );
    //   },
    // },
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
              loading={loading}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Admin"
            description="Are you sure you want to delete this admin?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: loading }}
          >
            <Tooltip title="Delete">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                loading={loading}
              />
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
            className="h-10 rounded-xl bg-primarysolid"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            loading={loading}
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
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
          className="overflow-x-auto rounded-xl"
          scroll={{ x: 800 }}
        />
      </div>

      <Modal
        title={editingAdmin ? "Edit Admin" : "Add New Admin"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="text-center"
        destroyOnClose={true}
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
            rules={[
              { required: true, message: "Please input the full name!" },
              { min: 2, message: "Name must be at least 2 characters!" }
            ]}
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
              { pattern: /^[\+]?[\d\s\-\(\)]+$/, message: "Please enter a valid phone number!" }
            ]}
          >
            <Input className="py-3" placeholder="Enter phone number" />
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
              {/* <Option value="moderator">Moderator</Option> */}
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
            <Button 
            
              htmlType="submit" 
              className="w-full h-12 bg-primarysolid"
              loading={loading}
              
            >
              {editingAdmin ? "Update Admin" : "Add Admin"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminList;