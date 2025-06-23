// components/Navbar.jsx
import React from "react";
import { Layout, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";

const { Header } = Layout;

const Navbar = ({type}) => {
  return (
    <Header className="bg-white shadow px-6 flex justify-between items-center">
      <div className="flex items-center gap-6 px-8">
        <h1 className="text-[#05A2C2] text-3xl  font-bold">Logo</h1>
        <button className="bg-[#AADEE6] text-[#0C7792] font-semibold border border-[#AADEE6] rounded-lg px-3 py-2 text-xs">
          {type} Dashboard
        </button>
      </div>
      <div>
        <Badge count={4} offset={[0, 0]}>
          <BellOutlined className="text-xl text-gray-700" />
        </Badge>
      </div>
    </Header>
  );
};

export default Navbar;
 