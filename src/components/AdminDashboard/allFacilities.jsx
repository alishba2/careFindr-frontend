import React, { useEffect, useState } from "react";
import { Input, Table, Tag, Button, message, Select, Dropdown, Menu } from "antd";
import { SearchOutlined, MoreOutlined, FilterOutlined } from "@ant-design/icons";
import { states } from "../enums/state";
import { lgas } from "../enums/lgas";
import {
  getAllFacilities,
  getFacilitiesByType,
} from "../../services/facility";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import filter from "../../assets/FunnelSimple.png";
const { Option } = Select;


const columns = (onVerify, onRevise) => [
  {
    title: "Facility Name",
    dataIndex: "name",
    key: "name",
    render: (text) => (
      <span className="font-medium text-gray-900">{text}</span>
    ),
  },
  {
    title: "Facility Type",
    dataIndex: "hospitalType",
    key: "hospitalType",
    render: (_, record) => {
      let displayText = "";
      if (record.hospitalType && record.hospitalType !== "N/A") {
        displayText = `${record.type} / ${record.hospitalType}`;
      } else if (record.insuranceType && record.insuranceType !== "N/A") {
        displayText = `${record.type} / ${record.insuranceType}`;
      } else {
        displayText = record.type || "-";
      }
      return <span className="text-gray-700">{displayText}</span>;
    },
  },
  {
    title: "LGA / State",
    key: "location",
    render: (_, record) => {
      const location = record.lga && record.state
        ? `${record.lga} / ${record.state}`
        : record.state || record.lga || "-";
      return <span className="text-gray-700">{location}</span>;
    },
  },
  {
    title: "Registration Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => (
      <span className="text-gray-700">
        {dayjs(date).format("DD MMM YYYY")}
      </span>
    ),
  },
  {
    title: "Document Status",
    dataIndex: "status",
    key: "status",
    render: (_, record) => {
      return (
        <Tag
          color={
            record.status === "verified"
              ? "green"
              : record.status === "rejected"
              ? "red"
              : "blue"
          }
          className="text-gray-700"
        >
          {record.status}
        </Tag>
      );
    },
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
  const [showClear, setShowClear] = useState(false);

  const fetchFacilities = async (currentPage = page) => {
    console.log(type, "type is here");
    setLoading(true);
    try {
      const response = type && type !== "all"
        ? await getFacilitiesByType({ type, page: currentPage, limit })
        : await getAllFacilities({ page: currentPage, limit });

      console.log(response, "response is here");

      const formattedData = response.facilities.map((facility, index) => ({
        key: index + (currentPage - 1) * limit,
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
    
    } finally {
      setLoading(false);
    }
  };

  // Reset filters when type changes
  useEffect(() => {
    setFilterType(type || "all");
    setSearchText("");
    setFilterState("");
    setFilterLga("");
    setFilterStatus("");
    setPage(1); // Reset to first page when type changes
  }, [type]);

  // Fetch data when type or page changes
  useEffect(() => {
    fetchFacilities(page);
  }, [type, page]);

  // Apply client-side filtering
  useEffect(() => {
    // Check if any filters are active
    const hasActiveFilters = searchText || 
      (filterType && filterType !== "all") || 
      filterState || 
      filterLga || 
      filterStatus;
    
    setShowClear(hasActiveFilters);

    let filtered = [...data];

    // Filter by search text (name)
    if (searchText) {
      filtered = filtered.filter((item) =>
        item.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by type (only apply if we're showing all types and a specific type is selected)
    if (filterType && filterType !== "all" && (!type || type === "all")) {
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
  }, [data, searchText, filterType, filterState, filterLga, filterStatus, type]);

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

  const handleRevise = async (id) => {
    try {
      console.log("Revising facility ID:", id);
      // Placeholder for actual revision API call
      message.success("Facility marked for revision");
      fetchFacilities();
    } catch (error) {
      console.error("Revision failed", error);
      message.error("Failed to mark facility for revision");
    }
  };

  const handleClearFilters = () => {
    setSearchText("");
    setFilterType(type || "all");
    setFilterState("");
    setFilterLga("");
    setFilterStatus("");
  };

  // Options for filters
  const typeOptions = ["Hospital", "Pharmacy", "Ambulance", "Insurance","SpecialistClinic", "Laboratory","Blood Bank"];
  const statusOptions = ["Verified", "Pending", "Need Revision"];
  const stateOptions = states || [];
  const lgaOptions = Object.values(lgas).flat() || [];

  return (
    <div>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {type && type !== "all"
              ? `${type.charAt(0).toUpperCase() + type.slice(1)} Facilities`
              : "All Facilities"}
          </h1>
        </div>

        {/* Filters */}
        <div className="mb-3">
          <div className="flex flex-row lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search"
                className="h-11 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Type Filter - Only show when type is "all" or not specified */}
              {(!type || type === "all") && (
                <Select
                  placeholder="Filter by Type"
                  className="min-w-[160px] ant-select-selector"
                  value={filterType === "all" ? undefined : filterType}
                  onChange={(value) => setFilterType(value || "all")}
                  suffixIcon={<img src={filter} alt="Filter" className="h-6 mb-1 w-6 text-gray-400" />}
                  style={{ height: 40, backgroundColor: "transparent" }}
                  dropdownClassName="ant-select-dropdown"
                >
                  <Option value="">All Types</Option>
                  {typeOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              )}

              {/* State Filter */}
              <Select
                placeholder="Filter by State"
                className="min-w-[180px]"
                value={filterState || undefined}
                onChange={(value) => {
                  setFilterState(value || "");
                  setFilterLga("");
                }}
                showSearch
                suffixIcon={<img src={filter} alt="Filter" className="h-6 mb-1 w-6 text-gray-400" />}
                style={{ height: 44 }}
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
                className="min-w-[160px]"
                value={filterStatus || undefined}
                onChange={(value) => setFilterStatus(value || "")}
                suffixIcon={<img src={filter} alt="Filter" className="h-6 mb-1 w-6 text-gray-400" />}
                style={{ height: 44 }}
              >
                <Option value="">All Statuses</Option>
                {statusOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>

              {/* Clear Filters Button */}
              {showClear && (
                <Button
                  type="default"
                  className="h-11 px-6 rounded-lg border-gray-300 hover:bg-gray-50"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Table
            columns={columns(handleVerify, handleRevise)}
            dataSource={filteredData}
            loading={loading}
            pagination={{
              current: page,
              total: totalPages * limit,
              pageSize: limit,
              onChange: (page) => setPage(page),
              showSizeChanger: false,
              showQuickJumper: false,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              className: "px-6 py-4 border-t border-gray-200",
            }}
            className="rounded-lg"
            onRow={(record) => ({
              onClick: () =>
                navigate(`/admin-dashboard/facilities/${record._id}`),
              className: "cursor-pointer hover:bg-gray-50 transition-colors",
            })}
            scroll={{ x: 1200 }}
            size="large"
            rowClassName="h-16"
          />
        </div>
      </div>
    </div>
  );
};

export default AllFacilities;