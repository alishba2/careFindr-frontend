import React, { useState, useEffect } from "react";
import { Input, Table, Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const Referrals = () => {
  const navigate = useNavigate();

  // Dummy data
  const initialData = [
    {
      key: "1",
      name: "John Doe",
      age: 30,
      sex: "Male",
      phoneNumber: "0000000000",
      differentialDiagnosis: "Fever",
      facilityReferred: "Yes / Company name",
      referralAmount: 5,
    },
    {
      key: "2",
      name: "Jane Smith",
      age: 25,
      sex: "Female",
      phoneNumber: "1111111111",
      differentialDiagnosis: "Cold",
      facilityReferred: "No",
      referralAmount: 3,
    },
    {
      key: "3",
      name: "Alice Johnson",
      age: 35,
      sex: "Female",
      phoneNumber: "2222222222",
      differentialDiagnosis: "Injury",
      facilityReferred: "Yes / Health Inc",
      referralAmount: 2,
    },
  ];

  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [searchText, setSearchText] = useState("");
  const [filterAge, setFilterAge] = useState("");
  const [filterSex, setFilterSex] = useState("");
  const [filterFacility, setFilterFacility] = useState("");

  const totalReferrals = data.length;
  const totalAmount = data.reduce((sum, record) => sum + record.referralAmount, 0);

  // Filter logic
  useEffect(() => {
    let filtered = [...data];

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterAge) {
      filtered = filtered.filter((item) => item.age === parseInt(filterAge));
    }

    if (filterSex) {
      filtered = filtered.filter((item) => item.sex === filterSex);
    }

    if (filterFacility) {
      filtered = filtered.filter((item) =>
        item.facilityReferred.toLowerCase().includes(filterFacility.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [data, searchText, filterAge, filterSex, filterFacility]);

  const handleClearFilters = () => {
    setSearchText("");
    setFilterAge("");
    setFilterSex("");
    setFilterFacility("");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Sex", dataIndex: "sex", key: "sex" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Differential Diagnosis", dataIndex: "differentialDiagnosis", key: "differentialDiagnosis" },
    { title: "Facility Referred", dataIndex: "facilityReferred", key: "facilityReferred" },
    { title: "Referral Amount", dataIndex: "referralAmount", key: "referralAmount" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Referrals</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by Name"
          className="h-10 rounded-md border border-gray-300 md:w-80"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Select
            placeholder="Filter by Age"
            className="h-10 w-full md:w-40 rounded-md border border-gray-300"
            value={filterAge}
            onChange={(value) => setFilterAge(value)}
            allowClear
          >
            <Option value="">All Ages</Option>
            <Option value="25">25</Option>
            <Option value="30">30</Option>
            <Option value="35">35</Option>
          </Select>

          <Select
            placeholder="Filter by Sex"
            className="h-10 w-full md:w-40 rounded-md border border-gray-300"
            value={filterSex}
            onChange={(value) => setFilterSex(value)}
            allowClear
          >
            <Option value="">All Sexes</Option>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>

          <Select
            placeholder="Filter by Facility Referred"
            className="h-10 w-full md:w-48 rounded-md border border-gray-300"
            value={filterFacility}
            onChange={(value) => setFilterFacility(value)}
            showSearch
            allowClear
          >
            <Option value="">All Facilities</Option>
            <Option value="yes">Yes</Option>
            <Option value="no">No</Option>
            <Option value="company">Company name</Option>
            <Option value="health">Health Inc</Option>
          </Select>

          <Button
            type="default"
            className="h-10 px-4 rounded-md border border-gray-300 hover:bg-gray-100"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          className="overflow-x-auto rounded-xl"
          onRow={(record) => ({
            onClick: () => navigate(`/admin-dashboard/referrals/${record.key}`),
            style: { cursor: "pointer" },
          })}
        />
      </div>

      <div className="mt-4 text-gray-600">
        Total Referrals: <strong>{totalReferrals}</strong>
        <span className="ml-4">Total Amount: <strong>{totalAmount}</strong></span>
      </div>
    </div>
  );
};

export default Referrals;
