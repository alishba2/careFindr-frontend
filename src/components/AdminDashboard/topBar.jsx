// components/Navbar.jsx
import React, { useState } from "react";
import { Layout, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { LogOutIcon } from "lucide-react";

import { useAuth } from "../hook/auth";

const { Header } = Layout;

const Navbar = ({type}) => {

  const {authData} = useAuth();
  return (
    <Header className="bg-white shadow px-6 flex justify-between items-center">
      <div className="flex items-center gap-6 px-8">
        <h1 className="text-[#359DF4] text-3xl  font-bold">Logo</h1>
        <button className="bg-[#AADEE6] text-[#359DF4] font-semibold border border-[#AADEE6] rounded-lg px-3 py-2 text-xs">
          {type} Dashboard
        </button>
      </div>

      <div className="flex items-center justify-end gap-5">
        <button className="flex h-10 w-10 items-center justify-center gap-2.5 rounded-xl">
          <LogOutIcon className="h-6 w-6" />
        </button>
      </div>

    </Header>
  );
};

export default Navbar;
 