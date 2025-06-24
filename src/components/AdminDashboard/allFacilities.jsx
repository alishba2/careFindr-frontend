import React, { useEffect, useState } from "react";
import { Input, Table, Tag, Button, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  getAllFacilities,
  getFacilitiesByType,
} from "../../services/facility";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";

const columns = (onVerify) => [
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Hospital Type",
    dataIndex: "hospitalType",
    key: "hospitalType",
    render: (_, record) =>
      record.type === "Hospital" ? record.hospitalType || "N/A" : null,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={status === "Verified" ? "green" : "orange"}>{status}</Tag>
    ),
  },
  {
    title: "State",
    dataIndex: "state",
    key: "state",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "LGA",
    dataIndex: "lga",
    key: "lga",
  },
  {
    title: "Registration Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => dayjs(date).format("DD MMM YYYY"),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, record) =>
      record.status !== "Verified" ? (
        <Button
          size="small"
          type="primary"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click
            onVerify(record._id);
          }}
        >
          Verify
        </Button>
      ) : (
        <span className="text-gray-400">Already Verified</span>
      ),
  },
];

const AllFacilities = () => {
  const [searchParams] = useSearchParams(); // ✅ Use this for query param
  const type = searchParams.get("type");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const response = type !=="all"
        ? await getFacilitiesByType({ type, page, limit })
        : await getAllFacilities({ page, limit });

      const formattedData = response.facilities.map((facility, index) => ({
        key: index + (page - 1) * limit,
        _id: facility._id,
        type: facility.type,
        status: facility.status,
        state: facility.state,
        phone: facility.phone,
        lga: facility.lga,
        createdAt: facility.createdAt,
        hospitalType:
          facility.type === "Hospital"
            ? facility.services?.hospital?.type || "N/A"
            : null,
      }));

      setData(formattedData);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch facilities", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      console.log("Verifying facility ID:", id);
      message.success("Facility verified successfully");
      fetchFacilities();
    } catch (error) {
      console.error("Verification failed", error);
      message.error("Failed to verify facility");
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [type, page]);

  return (
    <div className="p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">
          {type
            ? `${type.charAt(0).toUpperCase() + type.slice(1)} Facilities`
            : "All Facilities"}
        </h2>
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
          columns={columns(handleVerify)}
          dataSource={data}
          loading={loading}
          pagination={{
            current: page,
            total: totalPages * limit,
            pageSize: limit,
            onChange: (page) => setPage(page),
            showSizeChanger: false,
          }}
          className="overflow-x-auto rounded-xl"
          onRow={(record) => ({
            onClick: () =>
              navigate(`/admin-dashboard/facilities/${record._id}`),
            style: { cursor: "pointer" },
          })}
        />
      </div>
    </div>
  );
};

export default AllFacilities;
