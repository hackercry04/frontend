import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import axiosInstance from '../AdminComponents/AdminAxios';
import SERVERURL from '../Serverurl';
import Chartview from '../AdminComponents/Chartview';
import ProductPieChart from '../AdminComponents/ProductPieChart';

// DateRangePicker component
const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <DatePicker
        selected={startDate}
        onChange={onStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className="border border-gray-300 rounded-md p-2"
      />
      <span>to</span>
      <DatePicker
        selected={endDate}
        onChange={onEndDateChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        className="border border-gray-300 rounded-md p-2"
      />
    </div>
  );
};

// Dashboard component
const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date(2023, 0, 1));
  const [endDate, setEndDate] = useState(new Date());
  const [reportType, setReportType] = useState('daily');
  const [data, setData] = useState({});
  const [salescount,setSalescount]=useState([1]);
  const [top_products,setTopproducts]=useState([1]);
  const [top_categories,setTopCategories]=useState([1]);


  // Update date range based on the selected report type
  useEffect(() => {
    const today = new Date();
    let newStartDate = new Date();
    let newEndDate = new Date();

    axiosInstance.post(`https://${SERVERURL}/admin/generate/report/`, {
      startDate: new Date(newStartDate.setDate(today.getDate() - 1)).toISOString(),
      endDate: new Date(endDate.setDate(today.getDate() + 1)).toISOString(),
      reportType: reportType,
    })
    .then((res) => {
      setData(res.data.data);
      setSalescount(res.data.total_sale_date)
      setTopproducts(res.data.top_products)
      setTopCategories(res.data.top_categories)
    })
    .catch((error) => {
      console.error("Error fetching report data:", error);
    });









    switch (reportType) {
      case 'daily':
        newStartDate = today;
        newEndDate = today;
        break;
      case 'weekly':
        newStartDate.setDate(today.getDate() - 7);
        newEndDate = today;
        break;
      case 'monthly':
        newStartDate.setMonth(today.getMonth() - 1);
        newEndDate = today;
        break;
      case 'yearly':
        newStartDate.setFullYear(today.getFullYear() - 1);
        newEndDate = today;
        break;
      default:
        break;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);               
  }, [reportType]);

  // Filter sales data based on selected date range and report type


  // Fetch sales report based on the selected date range and report type
  const handleShow = async () => {
    try {
      const response = await axiosInstance.post(`https://${SERVERURL}/admin/generate/report/`, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        reportType: reportType,
      });
      setData(response.data.data);
      setSalescount(response.data.total_sale_date)

    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const generateReportData = () => {

    return [
      ['Report Type', reportType],
      ['Date Range', `${startDate.toDateString()} - ${endDate.toDateString()}`],
      ['Total Sales', data.total_sales],
      ['Total confirmed Sales', `${data.total_paid_sales.toLocaleString()}`],
      ['Total Amount', `$${data.total_sale_amount.toLocaleString()}`],
      ['Pending Payment', `$${data.total_sale_amount-data.total_confirmed_sale_amount}`],
      ['Total Discount', `$${data.total_discount.toLocaleString()}`],
    ];
  };

  // Handle download for PDF and Excel
  const handleDownload = (format) => {
    const reportData = generateReportData();

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text('Sales Report', 14, 15);
      doc.autoTable({
        startY: 20,
        head: [['Metric', 'Value']],
        body: reportData,
      });
      doc.save('sales_report.pdf');
    } else if (format === 'excel') {
      const ws = XLSX.utils.aoa_to_sheet([['Metric', 'Value'], ...reportData]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
      XLSX.writeFile(wb, 'sales_report.xlsx');
    }
  };

  return (
    <>
    <Chartview salescount={salescount}/>     
    <div className="container mx-auto p-4">
    <div className='flex justify-around my-8'>
  <ProductPieChart top_products={top_products} label={'Product Sale Distribution'} />
  <ProductPieChart top_products={top_categories} label={'Category Sale Distribution'} />
</div>

      <h1 className="text-2xl font-bold mb-4">Sales Report</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
          >
          <option value="daily">Today</option>
          <option value="weekly">Last Week</option>
          <option value="monthly">Last Month</option>
          <option value="yearly">Last Year</option>
        </select>

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium">Total Sales</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
          </div>
          <div className="text-2xl font-bold">{data.total_sales || 0}</div>
          {console.log(data)}
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium">Total Amount</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
          </div>
          <div className="text-2xl font-bold">${data.total_sale_amount?.toLocaleString() || '0'}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium">Total Discount</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
          </div>
          <div className="text-2xl font-bold">${data.total_discount?.toLocaleString() || '0'}</div>
        </div>


        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium">Pending </h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
          </div>
          <div className="text-2xl font-bold">${data.total_sale_amount-data.total_confirmed_sale_amount?.toLocaleString() || '0'}</div>
        </div>




        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium">Confirmed Orders </h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
          </div>
          <div className="text-2xl font-bold">{data.total_paid_sales?.toLocaleString() || '0'}</div>
        </div>
        
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleShow}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
          Show Report
        </button>
        <button
          onClick={() => handleDownload('pdf')}
          className="bg-green-500 text-white py-2 px-4 rounded-md"
          >
          Download PDF
        </button>
        <button
          onClick={() => handleDownload('excel')}
          className="bg-yellow-500 text-white py-2 px-4 rounded-md"
          >
          Download Excel
        </button>
      </div>
      <div className='p-6'/>
    </div>
          </>
  );
};

export default Dashboard;
