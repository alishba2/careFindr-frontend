import React from "react";
import { Progress, Card, Row, Col } from "antd";
import { Content } from "antd/es/layout/layout";

export default function DashboardHome() {
  return (


    <Content  className="h-full" >

      <div className="font-inter font-semibold text-3xl leading-[36px] tracking-[0.5%] mb-1">
        Dashboard Overview
      </div>
      <p className="font-inter font-normal text-lg leading-28px tracking-[0.5%] text-gray-600 mb-6">
        Welcome back! Here's what's happening with your facility today.
      </p>


    
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>

          <Card className="rounded-xl shadow border-none">
            <p className="text-base text-gray-500">New Referrals</p>
            <p className="text-2xl font-bold text-primary">5</p>
             <p className="text-base text-[#259678]">
                  +2 This week
                </p>
                <div  className="w-14 h-14  bg-[#E5FFD1] rounded-full  absolute top-5 right-7">
      
                </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="rounded-xl shadow border-none">
            <p className="text-base text-gray-500">Total Referrals</p>
            <p className="text-2xl font-bold text-primary">308</p>
            <p className="text-base text-[#259678]">
                  +2 This week
                </p>
                <div  className="w-14 h-14  bg-[#D1FFFB] rounded-full  absolute top-5 right-7">
      
                </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="rounded-xl shadow border-none">
            <p className="text-base text-gray-500">Profile Completion</p>
            <p className="text-2xl font-bold text-primary">10%</p>
            <p className="text-base text-gray-800">
                  Continue completing profile
                </p>
                <div  className="w-14 h-14  bg-[#D1E5FF] rounded-full  absolute top-5 right-7">
      
                </div>
          </Card>
        </Col>
      </Row>

       {/* Recent Activity section */}
      <Card className="mt-6 rounded-xl shadow border-none h-2/4 ">
        <Content className="p-6 flex flex-col ">
          <h2 className="font-inter font-semibold text-2xl leading-[24px] tracking-[0.5%] text-[#1f2937] mb-4">
            Recent Activity
          </h2>
          <div className="flex-1 flex items-center justify-center">
            <p className="font-inter font-normal text-lg leading-28px tracking-[0.5%] text-gray-600">
              No recent activity
            </p>
          </div>
        </Content>
      </Card>


    </Content>

  );
}
