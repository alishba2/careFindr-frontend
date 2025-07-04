import React, { useState, useEffect } from "react";
import { Table, Button, Input } from "antd";
import moment from "moment";
import { Search, ChevronLeft, ChevronRight, ChevronDown, Calendar } from "lucide-react";
import { useAuth } from "../hook/auth";
// Custom Date Filter Component
const DateFilter = ({ value, onChange }) => {
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedPreset, setSelectedPreset] = useState('');
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const {facilityType} = useAuth();

  const presetOptions = [
    'Today so far',
    'Yesterday',
    'Last 7 days',
    'Last 30 days',
    'This month so far',
    'Last month',
    'All time',
    'Custom'
  ];

  const monthNames = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Sync internal state with value prop
  useEffect(() => {
    if (!value || value.length === 0) {
      setSelectedRange({ start: null, end: null });
      setSelectedPreset('');
      setTempStartDate(null);
      setTempEndDate(null);
      setShowCustomPicker(false);
    }
  }, [value]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const handleDateClick = (day) => {
    if (!day) return;

    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(clickedDate);
      setTempEndDate(null);
    } else {
      if (clickedDate >= tempStartDate) {
        setTempEndDate(clickedDate);
      } else {
        setTempEndDate(tempStartDate);
        setTempStartDate(clickedDate);
      }
    }
  };

  const calculatePresetRange = (preset) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (preset) {
      case 'Today so far':
        return [moment(today), moment(now)];
      case 'Yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return [moment(yesterday), moment(yesterday).endOf('day')];
      case 'Last 7 days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return [moment(sevenDaysAgo), moment(today)];
      case 'Last 30 days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return [moment(thirtyDaysAgo), moment(today)];
      case 'This month so far':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return [moment(monthStart), moment(now)];
      case 'Last month':
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        return [moment(lastMonthStart), moment(lastMonthEnd)];
      case 'All time':
        return [];
      default:
        return [];
    }
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setShowDropdown(false);
    setTempStartDate(null);
    setTempEndDate(null);

    if (preset === 'Custom') {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
      const range = calculatePresetRange(preset);
      onChange(range);
    }
  };

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      const range = [moment(tempStartDate), moment(tempEndDate)];
      setSelectedRange({
        start: tempStartDate,
        end: tempEndDate
      });
      onChange(range);
      setShowCustomPicker(false);
    }
  };

  const isDateInRange = (day) => {
    if (!day || !tempStartDate) return false;

    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (tempStartDate && tempEndDate) {
      return date >= tempStartDate && date <= tempEndDate;
    }

    return date.getTime() === tempStartDate.getTime();
  };

  const isDateRangeEnd = (day) => {
    if (!day || !tempStartDate || !tempEndDate) return false;

    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.getTime() === tempStartDate.getTime() || date.getTime() === tempEndDate.getTime();
  };

  const formatDateInput = (date) => {
    if (!date) return '';
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const getButtonText = () => {
    if (selectedPreset && selectedPreset !== 'Custom') {
      return selectedPreset;
    }
    if (selectedRange.start && selectedRange.end) {
      return `${formatDateInput(selectedRange.start)} - ${formatDateInput(selectedRange.end)}`;
    }
    return 'Date filter';
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative">
      {/* Date Filter Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors w-full md:w-64"
      >
        <Calendar size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700 truncate flex-1 text-left">
          {getButtonText()}
        </span>
        <ChevronDown size={16} className={`text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-48">
          {presetOptions.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetSelect(preset)}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                selectedPreset === preset
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      )}

      {/* Custom Date Picker */}
      {showCustomPicker && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Custom Date Range Inputs */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={formatDateInput(tempStartDate)}
                placeholder="Start date"
                readOnly
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 flex-1"
              />
              <span className="text-gray-400 text-sm">—</span>
              <input
                type="text"
                value={formatDateInput(tempEndDate)}
                placeholder="End date"
                readOnly
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 flex-1"
              />
            </div>
          </div>

          <div className="flex">
            {/* Preset Options */}
            <div className="w-36 border-r border-gray-200 bg-gray-50">
              {presetOptions.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetSelect(preset)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors ${
                    selectedPreset === preset
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div className="flex-1 p-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft size={16} className="text-gray-600" />
                </button>

                <h3 className="text-sm font-medium text-gray-700">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>

                <button
                  onClick={() => navigateMonth(1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}

                {days.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    disabled={!day}
                    className={`h-8 w-8 flex items-center justify-center text-sm rounded transition-colors
                      ${!day
                        ? 'cursor-default'
                        : isDateRangeEnd(day)
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : isDateInRange(day)
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Apply Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleApply}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  APPLY
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {(showDropdown || showCustomPicker) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowDropdown(false);
            setShowCustomPicker(false);
          }}
        />
      )}
    </div>
  );
};

// Main Referrals Component


// Main Referrals Component
const Referrals = ({ facilityType }) => {
  const initialData = [
    {
      key: "1",
      name: "John Doe",
      age: 30,
      sex: "Male",
      phoneNumber: "0000000000",
      symptoms: "High fever, cough",
      medicationRequested: "Paracetamol",
      testRequested: "Blood test",
      pickUpLocation: "123 Main St",
      occupation: "Teacher",
      preferredPlan: "Basic Plan",
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
      symptoms: "Sore throat, fatigue",
      medicationRequested: "Antibiotics",
      testRequested: "Throat swab",
      pickUpLocation: "456 Oak Ave",
      occupation: "Nurse",
      preferredPlan: "Premium Plan",
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
      symptoms: "Sprained ankle",
      medicationRequested: "Painkillers",
      testRequested: "X-ray",
      pickUpLocation: "789 Pine Rd",
      occupation: "Engineer",
      preferredPlan: "Family Plan",
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

  // Define columns based on facilityType
  const getColumns = () => {
    switch (facilityType) {
      case "Hospital":
        return [
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Age", dataIndex: "age", key: "age" },
          { title: "Sex", dataIndex: "sex", key: "sex" },
          { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
          { title: "Symptoms", dataIndex: "symptoms", key: "symptoms" },
          { title: "Differential Diagnosis", dataIndex: "differentialDiagnosis", key: "differentialDiagnosis" },
          { title: "Date", dataIndex: "date", key: "date" },
          { title: "Referral Amount", dataIndex: "referralAmount", key: "referralAmount" },
        ];
      case "Pharmacy":
        return [
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Age", dataIndex: "age", key: "age" },
          { title: "Sex", dataIndex: "sex", key: "sex" },
          { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
          { title: "Medication Requested", dataIndex: "medicationRequested", key: "medicationRequested" },
          { title: "Differential Diagnosis", dataIndex: "differentialDiagnosis", key: "differentialDiagnosis" },
          { title: "Date", dataIndex: "date", key: "date" },
          { title: "Referral Amount", dataIndex: "referralAmount", key: "referralAmount" },
        ];
      case "Laboratory":
        return [
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Age", dataIndex: "age", key: "age" },
          { title: "Sex", dataIndex: "sex", key: "sex" },
          { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
          { title: "Test Requested", dataIndex: "testRequested", key: "testRequested" },
          { title: "Differential Diagnosis", dataIndex: "differentialDiagnosis", key: "differentialDiagnosis" },
          { title: "Date", dataIndex: "date", key: "date" },
          { title: "Referral Amount", dataIndex: "referralAmount", key: "referralAmount" },
        ];
      case "Ambulance":
        return [
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Age", dataIndex: "age", key: "age" },
          { title: "Sex", dataIndex: "sex", key: "sex" },
          { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
          { title: "Pick Up Location", dataIndex: "pickUpLocation", key: "pickUpLocation" },
          { title: "Differential Diagnosis", dataIndex: "differentialDiagnosis", key: "differentialDiagnosis" },
          { title: "Date", dataIndex: "date", key: "date" },
          { title: "Referral Amount", dataIndex: "referralAmount", key: "referralAmount" },
        ];
      case "Insurance":
        return [
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Age", dataIndex: "age", key: "age" },
          { title: "Sex", dataIndex: "sex", key: "sex" },
          { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
          { title: "Occupation", dataIndex: "occupation", key: "occupation" },
          { title: "Preferred Plan", dataIndex: "preferredPlan", key: "preferredPlan" },
          { title: "Date", dataIndex: "date", key: "date" },
          { title: "Referral Amount", dataIndex: "referralAmount", key: "referralAmount" },
        ];
      default:
        return [
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Age", dataIndex: "age", key: "age" },
          { title: "Sex", dataIndex: "sex", key: "sex" },
          { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
          { title: "Symptoms", dataIndex: "symptoms", key: "symptoms" },
          { title: "Differential Diagnosis", dataIndex: "differentialDiagnosis", key: "differentialDiagnosis" },
          { title: "Date", dataIndex: "date", key: "date" },
          { title: "Referral Amount", dataIndex: "referralAmount", key: "referralAmount" },
        ];
    }
  };

  // Check if any filter is applied
  const hasActiveFilters = filterAge || filterSex || (filterDateRange && filterDateRange.length > 0) || searchText;

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
      filtered = filtered.filter((item) => {
        const fieldsToSearch = [
          item.name,
          item.phoneNumber,
          item.differentialDiagnosis,
          // Include facility-specific fields in search
          ...(facilityType === "Hospital" ? [item.symptoms] : []),
          ...(facilityType === "Pharmacy" ? [item.medicationRequested] : []),
          ...(facilityType === "Lab" ? [item.testRequested] : []),
          ...(facilityType === "Ambulance" ? [item.pickUpLocation] : []),
          ...(facilityType === "Insurance" ? [item.occupation, item.preferredPlan] : []),
        ].filter(Boolean); // Remove undefined/null values
        return fieldsToSearch.some((field) => field.toLowerCase().includes(lowerSearch));
      });
    }

    setFilteredData(filtered);
  }, [data, filterAge, filterSex, filterDateRange, searchText, facilityType]);

  const handleClearFilters = () => {
    setFilterAge("");
    setFilterSex("");
    setFilterDateRange([]);
    setSearchText("");
  };

  return (
    <div className="py-6 px-4 sm:px-6">
      <h2 className="text-2xl font-bold mb-4">Referrals - {facilityType || "Hospital"}</h2>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-sm border border-gray-300 rounded-lg">
          <Input
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="h-10 pl-10 pr-4 rounded-xl bg-white border-[3px] border-gray-700 shadow-none focus:ring-0"
            bordered={false}
          />
          <Search className="absolute text-gray-500 left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Date Range Filter - Using Custom Component */}
          <DateFilter
            value={filterDateRange}
            onChange={setFilterDateRange}
          />

          {/* Clear Button (Shown only when filters are applied) */}
          {hasActiveFilters && (
            <Button
              type="default"
              className="h-10 px-4 rounded-md bg-white border border-gray-300 hover:bg-gray-100"
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <Table
          columns={getColumns()}
          dataSource={filteredData}
          pagination={false}
          className="rounded-xl pointer-events-none"
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


