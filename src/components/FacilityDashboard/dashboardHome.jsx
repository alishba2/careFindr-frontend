// File: src/pages/dashboard/DashboardHome.jsx
import React from "react";
import { Progress, Card, Row, Col } from "antd";
import { Content } from "antd/es/layout/layout";

export default function DashboardHome() {
  return (
    <Content  className="p-6" >
      <div className="font-inter font-semibold text-3xl leading-[36px] tracking-[0.5%] mb-1">
        Dashboard Overview
      </div>
      <p className="font-inter font-normal text-lg leading-28px tracking-[0.5%] text-gray-600 mb-6">
        Welcome back! Here's what's happening with your facility today.
      </p>

      <Card className="rounded-xl shadow border-none mb-5">
        <p><strong>Status:</strong> <span className="text-green-600">Verified ✅</span></p>
        <p className="mt-2 font-semibold">Profile Completion:</p>
        <Progress percent={80} strokeColor="#05A2C2" className="max-w-md" />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="rounded-xl shadow border-none">
            <p className="font-medium">Appointments Today</p>
            <p className="text-2xl font-bold text-primary">5</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="rounded-xl shadow border-none">
            <p className="font-medium">Pending Referrals</p>
            <p className="text-2xl font-bold text-primary">2</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="rounded-xl shadow border-none">
            <p className="font-medium">New Inquiries</p>
            <p className="text-2xl font-bold text-primary">1</p>
          </Card>
        </Col>
      </Row>
    </Content>
  );
}
