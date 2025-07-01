import React, { useEffect, useState } from "react";
import { Input, Table, Tag, Button, message, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { states } from "../enums/state";
import { lgas } from "../enums/lgas";
import {
  getAllFacilities,
  getFacilitiesByType,
} from "../../services/facility";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";

const { Option } = Select;

const columns = (onVerify) => [
  {
    title: "Facility Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Facility Type",
    dataIndex: "hospitalType",
    key: "hospitalType",
    render: (_, record) => {
      if (record.hospitalType && record.hospitalType !== "N/A") {
        return `${record.type} / ${record.hospitalType}`;
      }
      if (record.insuranceType && record.insuranceType !== "N/A") {
        return `${record.type} / ${record.insuranceType}`;
      }
      return record.type || "-";
    },
  },
  {
    title: "State / LGA",
    key: "location",
    render: (_, record) => {
      if (record.lga && record.state) {
        return `${record.lga} / ${record.state}`;
      }
      return record.state || record.lga || "-";
    },
  },
  {
    title: "Document Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={status === "Verified" ? "green" : "orange"}>{status}</Tag>
    ),
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
  {
    title: "Total Referrals",
    dataIndex: "totalReferrals",
    key: "totalReferrals",
    render: (value) => <p className="pl-12 text-gray-800">{value || 0}</p>,
  },
];

const AllFacilities = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState(type || "all");
  const [filterState, setFilterState] = useState("");
  const [filterLga, setFilterLga] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchFacilities = async () => {
    console.log(type, "type is here");
    setLoading(true);
    try {
      const response = type !== "all"
        ? await getFacilitiesByType({ type, page, limit })
        : await getAllFacilities({ page, limit });

      console.log(response, "response is here");

      const formattedData = response.facilities.map((facility, index) => ({
        key: index + (page - 1) * limit,
        _id: facility._id,
        name: facility.name,
        type: facility.type,
        status: facility.status,
        state: facility.state,
        phone: facility.phone,
        lga: facility.lga,
        createdAt: facility.createdAt,
        hospitalType: facility.hospitalType || null,
        insuranceType: facility.insuranceType || null,
        totalReferrals: facility.totalReferrals || 0,
      }));

      setData(formattedData);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch facilities", err);
      message.error("Failed to fetch facilities");
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filtering
  useEffect(() => {
    let filtered = [...data];

    // Filter by search text (name)
    if (searchText) {
      filtered = filtered.filter((item) =>
        item.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by type
    if (filterType && filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    // Filter by state
    if (filterState) {
      filtered = filtered.filter((item) =>
        item.state?.toLowerCase() === filterState.toLowerCase()
      );
    }

    // Filter by LGA
    if (filterLga) {
      filtered = filtered.filter((item) =>
        item.lga?.toLowerCase() === filterLga.toLowerCase()
      );
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    setFilteredData(filtered);
  }, [data, searchText, filterType, filterState, filterLga, filterStatus]);

  const handleVerify = async (id) => {
    try {
      console.log("Verifying facility ID:", id);
      // Placeholder for actual verification API call
      message.success("Facility verified successfully");
      fetchFacilities();
    } catch (error) {
      console.error("Verification failed", error);
      message.error("Failed to verify facility");
    }
  };

  const handleClearFilters = () => {
    setSearchText("");
    setFilterType(type || "all");
    setFilterState("");
    setFilterLga("");
    setFilterStatus("");
  };

  useEffect(() => {
    fetchFacilities();
  }, [type, page]);

  // Options for filters
  const typeOptions = ["Hospital", "Pharmacy", "Ambulance", "Insurance", "Laboratory"];
  const statusOptions = ["Verified", "Pending"];
  const stateOptions = states || [];
  const lgaOptions = Object.values(lgas).flat() || []; // Flatten if lgas is a state-to-LGA mapping

  return (
    <div className="p-2 md:p-6">
      <h2 className="text-2xl font-bold py-3 text-gray-800">
        {type
          ? `${type.charAt(0).toUpperCase() + type.slice(1)} Facilities`
          : "All Facilities"}
      </h2>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <Input
            prefix={<SearchOutlined className="text-gray-500" />}
            placeholder="Search"
            className="h-10 w-full md:w-80 rounded-[10px] border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {/* Type Filter */}
         {type=="all"&& <Select
            placeholder="Filter by Type"
            className="h-10 w-full md:w-44 rounded-[10px] border bg-gray"
            onChange={(value) => setFilterType(value)}
            suffixIcon={<i className="ri-equalizer-line text-gray-500" />} // optional: or use AntD's default icon
          >
            <Option value="">All Types</Option>
            {typeOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>}

          {/* State Filter */}
          <Select
            placeholder="Filter by LGA / State"
            className="h-10 w-full md:w-44 rounded-[10px] border "
            // value={filterState}
            onChange={(value) => {
              setFilterState(value);
              setFilterLga("");
            }}
            showSearch
            suffixIcon={<i className="ri-equalizer-line text-gray-500" />}
          >
            <Option value="">All States</Option>
            {stateOptions.map((state) => (
              <Option key={state} value={state}>
                {state}
              </Option>
            ))}
          </Select>

          {/* Status Filter */}
          <Select
            placeholder="Filter by Status"
            className="h-10 w-full md:w-44 rounded-[10px] border "
            // value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            suffixIcon={<i className="ri-equalizer-line text-gray-500" />}
          >
            <Option value="">Document Status</Option>
            {statusOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>

          {/* Clear Button */}
          <Button
            type="default"
            className="h-10 px-4 rounded-[10px] border border-gray-300 hover:bg-gray-100"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>


      <div className="bg-white rounded-xl shadow">
        <Table
          columns={columns(handleVerify)}
          dataSource={filteredData}
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