import React, { useState, useEffect } from "react";
import { Table, Select, Button, DatePicker, Input } from "antd";
import moment from "moment";
import funnel from "../../assets/FunnelSimple.png"; // your custom funnel icon
import { SearchIcon } from "lucide-react";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Referrals = () => {
  const initialData = [
    {
      key: "1",
      name: "John Doe",
      age: 30,
      sex: "Male",
      phoneNumber: "0000000000",
      differentialDiagnosis: "Fever",
      date: "2025-06-15",
      referralAmount: "5 ₦",
    },
    {
      key: "2",
      name: "Jane Smith",
      age: 25,
      sex: "Female",
      phoneNumber: "1111111111",
      differentialDiagnosis: "Cold",
      date: "2025-06-20",
      referralAmount: "3 ₦",
    },
    {
      key: "3",
      name: "Alice Johnson",
      age: 35,
      sex: "Female",
      phoneNumber: "2222222222",
      differentialDiagnosis: "Injury",
      date: "2025-07-01",
      referralAmount: "2 ₦",
    },
  ];

  const [data] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [filterAge, setFilterAge] = useState("");
  const [filterSex, setFilterSex] = useState("");
  const [filterDateRange, setFilterDateRange] = useState([]);
  const [searchText, setSearchText] = useState("");

  const totalReferrals = filteredData.length;
  const totalAmount = filteredData.reduce((sum, record) => {
    const numericValue = parseFloat(record.referralAmount.toString().replace(/[^\d.]/g, ""));
    return sum + numericValue;
  }, 0);

  useEffect(() => {
    let filtered = [...data];

    if (filterAge) {
      filtered = filtered.filter((item) => item.age === parseInt(filterAge));
    }

    if (filterSex) {
      filtered = filtered.filter((item) => item.sex === filterSex);
    }

    if (filterDateRange && filterDateRange.length === 2) {
      const [fromDate, toDate] = filterDateRange;
      filtered = filtered.filter((item) => {
        const itemDate = moment(item.date, "YYYY-MM-DD");
        return itemDate.isSameOrAfter(fromDate, "day") && itemDate.isSameOrBefore(toDate, "day");
      });
    }

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearch) ||
          item.phoneNumber.includes(lowerSearch) ||
          item.differentialDiagnosis.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredData(filtered);
  }, [data, filterAge, filterSex, filterDateRange, searchText]);

  const handleClearFilters = () => {
    setFilterAge("");
    setFilterSex("");
    setFilterDateRange([]);
    setSearchText("");
  };

  const FunnelIcon = () => (
    <img
      src={funnel}
      alt="filter"
      className="w-4 h-4 absolute right-3 top-3 pointer-events-none"
    />
  );

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Sex", dataIndex: "sex", key: "sex" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Differential Diagnosis", dataIndex: "differentialDiagnosis", key: "differentialDiagnosis" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Referral Amount", dataIndex: "referralAmount", key: "referralAmount" },
  ];

  return (
    <div className="py-6 px-4 sm:px-6">
      <h2 className="text-2xl font-bold mb-4">Referrals</h2>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-sm border border-gray-300 rounded-lg">
          <Input
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="h-10 pl-10 pr-4 rounded-xl bg-white border-[3px] border-gray-700 shadow-none focus:ring-0"
            bordered={false}
          />
          <SearchIcon className="absolute text-gray-500 left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Age Filter */}
          <div className="relative w-full md:w-40">
            <Select
              placeholder="Filter by Age"
              value={filterAge || ""}
              onChange={(value) => setFilterAge(value)}
              allowClear
              showArrow={false}
              className="w-full h-10 rounded-xl border-gray-300 border focus:!shadow-none"
              dropdownClassName="bg-white"
            >
              <Option value="" disabled hidden>
                Filter by Age
              </Option>
              <Option value="25">25</Option>
              <Option value="30">30</Option>
              <Option value="35">35</Option>
            </Select>
            <FunnelIcon />
          </div>

          {/* Sex Filter */}
          <div className="relative w-full md:w-40">
            <Select
              placeholder="Filter by Sex"
              value={filterSex || ""}
              onChange={(value) => setFilterSex(value)}
              allowClear
              showArrow={false}
              className="w-full h-10 rounded-xl border-gray-300 border focus:!shadow-none"
              dropdownClassName="bg-white"
            >
              <Option value="" disabled hidden>
                Filter by Sex
              </Option>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
            <FunnelIcon />
          </div>

          {/* Date Range Filter */}
          <div className="relative w- md:w-64">
            <RangePicker
              placeholder={["From", "To"]}
              className="w-full h-10 rounded-md bg-gray-100 border-gray-300 pl-3 pr-10"
              value={filterDateRange}
              onChange={(dates) => setFilterDateRange(dates)}
              format="YYYY-MM-DD"
              allowClear
              style={{ backgroundColor: "#f3f4f6", width: "100%" }}
            />
          </div>

          {/* Clear Button */}
          <Button
            type="default"
            className="h-10 px-4 rounded-md bg-white border border-gray-300 hover:bg-gray-100"
            onClick={handleClearFilters}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          className="rounded-xl"
        />
      </div>

      {/* Totals */}
      <div className="flex mt-4 justify-between text-gray-600">
        <span>Total Referrals: <strong>{totalReferrals}</strong></span>
        <span>Total Amount: <strong>₦{totalAmount}</strong></span>
      </div>
    </div>
  );
};

export default Referrals;
