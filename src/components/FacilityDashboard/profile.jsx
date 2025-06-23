import React, { useEffect, useState } from "react";
import { useAuth } from "../hook/auth";
import { Form, Spin, message } from "antd";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { editFacility } from "../../services/facility";

const Profile = () => {
  const { authData } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authData) {
      form.setFieldsValue(authData);
      setLoading(false);
    }
  }, [authData, form]);

  const handleFinish = async (values) => {
    setSaving(true);
    try {
      const res = await editFacility(values);
      console.log("Response:", res);
      message.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Facility Profile</h2>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input className="h-12 rounded-md border border-gray-300" placeholder="Facility Name" />
        </Form.Item>

        <Form.Item label="Facility Type" name="type" rules={[{ required: true }]}>
          <Input className="h-12 rounded-md border border-gray-300" placeholder="Hospital, Clinic, etc." />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ type: "email" }]}>
          <Input className="h-12 rounded-md border border-gray-300" placeholder="Email Address" />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input className="h-12 rounded-md border border-gray-300" placeholder="Primary Phone Number" />
        </Form.Item>

        <Form.Item label="Secondary Phone" name="secondaryPhone">
          <Input className="h-12 rounded-md border border-gray-300" placeholder="Secondary Phone" />
        </Form.Item>

        <Form.Item label="WhatsApp" name="whatsapp">
          <Input className="h-12 rounded-md border border-gray-300" placeholder="WhatsApp Number" />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input className="h-12 rounded-md border border-gray-300" placeholder="Facility Address" />
        </Form.Item>

        <Form.Item label="State" name="state">
          <Input className="h-12 rounded-md border border-gray-300" placeholder="State" />
        </Form.Item>

        <Form.Item label="LGA" name="lga">
          <Input className="h-12 rounded-md border border-gray-300" placeholder="Local Government Area" />
        </Form.Item>

        <Form.Item label="Registration Number" name="registrationNumber">
          <Input className="h-12 rounded-md border border-gray-300" placeholder="Registration Number" />
        </Form.Item>

        <Form.Item label="Website" name="website">
          <Input className="h-12 rounded-md border border-gray-300" placeholder="https://example.com" />
        </Form.Item>

        <div className="md:col-span-2 flex justify-end">
          <Button
            className="flex-1 h-12 bg-primarysolid rounded-xl text-sm font-semibold text-white"
            htmlType="submit"
            disabled={saving}
          >
            {saving ? <Spin size="small" className="text-white" /> : "Save Changes"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Profile;
