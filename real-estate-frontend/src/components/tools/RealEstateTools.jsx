import React, { useState, useEffect } from 'react';
import { Tabs, Card, Slider, InputNumber, Select, Button, Tooltip, Divider, message, Row, Col } from 'antd';
import { 
  CalculatorOutlined, 
  FileTextOutlined, 
  DollarOutlined, 
  SwapOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';
import 'chart.js/auto';

const { TabPane } = Tabs;
const { Option } = Select;

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const RealEstateTools = () => {
  // Loan Calculator States
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [amortizationData, setAmortizationData] = useState([]);
  const [chartData, setChartData] = useState({});

  // Stamp Duty States
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [state, setState] = useState('Maharashtra');
  const [stampDuty, setStampDuty] = useState(0);
  const [registrationFee, setRegistrationFee] = useState(0);

  // Loan Eligibility States
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [existingEmis, setExistingEmis] = useState(20000);
  const [eligibilityRate, setEligibilityRate] = useState(8.5);
  const [eligibilityTenure, setEligibilityTenure] = useState(20);
  const [eligibleAmount, setEligibleAmount] = useState(0);

  // Resale Value States
  const [purchasePrice, setPurchasePrice] = useState(5000000);
  const [purchaseYear, setPurchaseYear] = useState(new Date().getFullYear() - 5);
  const [currentYear] = useState(new Date().getFullYear());
  const [propertyType, setPropertyType] = useState('apartment');
  const [resaleValue, setResaleValue] = useState(0);
  const [appreciationRate, setAppreciationRate] = useState(0);

  // Calculate EMI
  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const emiValue =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure * 12)) /
      (Math.pow(1 + monthlyRate, tenure * 12) - 1);
    
    setEmi(emiValue || 0);
    
    const totalPaymentValue = emiValue * tenure * 12;
    setTotalPayment(totalPaymentValue || 0);
    setTotalInterest((totalPaymentValue - loanAmount) || 0);
    
    // Generate amortization data
    generateAmortizationData(loanAmount, monthlyRate, emiValue);
  };

  // Generate amortization data
  const generateAmortizationData = (principal, monthlyRate, emi) => {
    let balance = principal;
    const data = [];
    
    for (let i = 1; i <= tenure * 12; i++) {
      const interest = balance * monthlyRate;
      const principalPaid = emi - interest;
      balance -= principalPaid;
      
      if (i % 12 === 0 || i === 1 || i === tenure * 12) {
        data.push({
          year: Math.ceil(i / 12),
          principal: principalPaid * (i % 12 === 0 ? 12 : 1),
          interest: interest * (i % 12 === 0 ? 12 : 1),
          balance: balance > 0 ? balance : 0
        });
      }
    }
    
    setAmortizationData(data);
    prepareChartData(data);
  };

  // Prepare chart data
  const prepareChartData = (data) => {
    setChartData({
      labels: data.map(item => `Year ${item.year}`),
      datasets: [
        {
          label: 'Principal',
          data: data.map(item => item.principal),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Interest',
          data: data.map(item => item.interest),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  // Calculate stamp duty
  const calculateStampDuty = () => {
    const rates = {
      'Maharashtra': 0.05,  // 5%
      'Karnataka': 0.05,    // 5%
      'Delhi': 0.06,        // 6%
      'Uttar Pradesh': 0.07, // 7%
      'Tamil Nadu': 0.07,   // 7%
      'default': 0.06       // 6% for other states
    };
    
    const rate = rates[state] || rates['default'];
    const duty = propertyValue * rate;
    const regFee = propertyValue * 0.01; // 1% registration fee
    
    setStampDuty(duty);
    setRegistrationFee(regFee);
  };

  // Calculate loan eligibility
  const calculateEligibility = () => {
    const maxEmi = monthlyIncome * 0.6 - existingEmis; // 60% FOIR
    const monthlyRate = eligibilityRate / 12 / 100;
    const loanAmount = 
      (maxEmi * (Math.pow(1 + monthlyRate, eligibilityTenure * 12) - 1)) / 
      (monthlyRate * Math.pow(1 + monthlyRate, eligibilityTenure * 12));
    
    setEligibleAmount(Math.max(0, Math.floor(loanAmount / 100000) * 100000));
  };

  // Calculate resale value
  const calculateResaleValue = () => {
    const years = currentYear - purchaseYear;
    const rates = {
      'apartment': 0.08,    // 8% annual appreciation
      'villa': 0.10,       // 10%
      'plot': 0.12,        // 12%
      'commercial': 0.15,  // 15%
      'default': 0.10      // 10% default
    };
    
    const rate = rates[propertyType] || rates['default'];
    const value = purchasePrice * Math.pow(1 + rate, years);
    
    setAppreciationRate(rate * 100);
    setResaleValue(Math.round(value / 10000) * 10000);
  };

  // Handle tab change
  const handleTabChange = (key) => {
    // Recalculate when switching tabs
    if (key === '1') calculateEMI();
    else if (key === '2') calculateStampDuty();
    else if (key === '3') calculateEligibility();
    else if (key === '4') calculateResaleValue();
  };

  // Handle download as image
  const handleDownload = async (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    try {
      const dataUrl = await htmlToImage.toPng(element);
      const link = document.createElement('a');
      link.download = `estate-tool-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
      message.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      message.error('Failed to download image');
    }
  };

  // Initial calculations
  useEffect(() => {
    calculateEMI();
    calculateStampDuty();
    calculateEligibility();
    calculateResaleValue();
  }, []);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  // States data
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
    'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  return (
    <div className="real-estate-tools">
      <Tabs 
        defaultActiveKey="1" 
        onChange={handleTabChange}
        className="real-estate-tabs"
        tabPosition="top"
        items={[
          {
            key: '1',
            label: (
              <span>
                <CalculatorOutlined />
                <span className="ml-2 hidden sm:inline">Loan Calculator</span>
              </span>
            ),
            children: (
              <Card id="loan-calculator" className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Loan Details</h3>
                    
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Loan Amount (₹)
                          <Tooltip title="Enter the loan amount you wish to borrow">
                            <InfoCircleOutlined className="ml-1 text-gray-500" />
                          </Tooltip>
                        </label>
                        <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {formatCurrency(loanAmount)}
                        </span>
                      </div>
                      <Slider
                        min={500000}
                        max={10000000}
                        step={50000}
                        value={loanAmount}
                        onChange={(value) => setLoanAmount(value)}
                        tooltip={{ formatter: (value) => formatCurrency(value) }}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>₹5L</span>
                        <span>₹1Cr</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Interest Rate (% p.a.)
                          <Tooltip title="Annual interest rate for the loan">
                            <InfoCircleOutlined className="ml-1 text-gray-500" />
                          </Tooltip>
                        </label>
                        <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                          {interestRate}%
                        </span>
                      </div>
                      <Slider
                        min={5}
                        max={15}
                        step={0.1}
                        value={interestRate}
                        onChange={(value) => setInterestRate(value)}
                        tooltip={{ formatter: (value) => `${value}%` }}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>5%</span>
                        <span>15%</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Loan Tenure (Years)
                          <Tooltip title="Loan repayment period in years">
                            <InfoCircleOutlined className="ml-1 text-gray-500" />
                          </Tooltip>
                        </label>
                        <span className="text-sm font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {tenure} years
                        </span>
                      </div>
                      <Slider
                        min={1}
                        max={30}
                        value={tenure}
                        onChange={(value) => setTenure(value)}
                        tooltip={{ formatter: (value) => `${value} years` }}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1 year</span>
                        <span>30 years</span>
                      </div>
                    </div>

                    <Button 
                      type="primary" 
                      onClick={calculateEMI}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Calculate EMI
                    </Button>
                  </div>

                  <div id="loan-calculator-result" className="p-6 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Loan Summary</h3>
                      <div className="flex space-x-2">
                        <Tooltip title="Download as Image">
                          <Button 
                            icon={<DownloadOutlined />} 
                            onClick={() => handleDownload('loan-calculator-result')}
                            size="small"
                          />
                        </Tooltip>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm text-gray-500">Monthly EMI</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(emi)}</p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm text-gray-500">Total Interest</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalInterest)}</p>
                        <p className="text-xs text-gray-500">over {tenure} years</p>
                      </div>
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm text-gray-500">Total Payment</p>
                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalPayment)}</p>
                        <p className="text-xs text-gray-500">Principal + Interest</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-3 text-gray-700">Payment Breakup</h4>
                      <div className="h-64">
                        {chartData.labels && (
                          <Line data={chartData} options={chartOptions} />
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-3 text-gray-700">Amortization Schedule (Yearly)</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Principal</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Interest</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Remaining</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {amortizationData.map((yearData, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-700">{yearData.year}</td>
                                <td className="px-4 py-2 text-sm text-right text-green-600">{formatCurrency(yearData.principal)}</td>
                                <td className="px-4 py-2 text-sm text-right text-red-500">{formatCurrency(yearData.interest)}</td>
                                <td className="px-4 py-2 text-sm text-right text-gray-600">{formatCurrency(yearData.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <InfoCircleOutlined className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Note:</strong> This calculator provides an estimate only. Actual loan terms and interest rates may vary based on your credit score, income, and other factors. Please consult with your financial advisor for personalized advice.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ),
          },
          {
            key: '2',
            label: (
              <span>
                <FileTextOutlined />
                <span className="ml-2 hidden sm:inline">Stamp Duty Calculator</span>
              </span>
            ),
            children: (
              <Card id="stamp-duty-calculator" className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Calculate Stamp Duty</h3>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Value (₹)
                        <Tooltip title="Enter the total property value">
                          <InfoCircleOutlined className="ml-1 text-gray-500" />
                        </Tooltip>
                      </label>
                      <InputNumber
                        className="w-full"
                        min={100000}
                        max={100000000}
                        step={10000}
                        value={propertyValue}
                        onChange={(value) => setPropertyValue(value || 0)}
                        formatter={(value) => `₹${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/₹\s?|(,*)/g, '')}
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/UT
                        <Tooltip title="Select the state where the property is located">
                          <InfoCircleOutlined className="ml-1 text-gray-500" />
                        </Tooltip>
                      </label>
                      <Select
                        className="w-full"
                        value={state}
                        onChange={(value) => setState(value)}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {states.map((state) => (
                          <Option key={state} value={state}>
                            {state}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <Button 
                      type="primary" 
                      onClick={calculateStampDuty}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Calculate Stamp Duty
                    </Button>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">Stamp Duty & Registration</h3>
                      <Tooltip title="Download as Image">
                        <Button 
                          icon={<DownloadOutlined />} 
                          onClick={() => handleDownload('stamp-duty-result')}
                          size="small"
                        />
                      </Tooltip>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                        <div>
                          <p className="text-sm text-gray-500">Property Value</p>
                          <p className="text-lg font-semibold">{formatCurrency(propertyValue)}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                        <div>
                          <p className="text-sm text-gray-500">Stamp Duty ({state})</p>
                          <p className="text-lg font-semibold text-blue-600">{formatCurrency(stampDuty)}</p>
                          <p className="text-xs text-gray-500">Approx. {(stampDuty / propertyValue * 100).toFixed(2)}% of property value</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                        <div>
                          <p className="text-sm text-gray-500">Registration Fee</p>
                          <p className="text-lg font-semibold text-green-600">{formatCurrency(registrationFee)}</p>
                          <p className="text-xs text-gray-500">1% of property value</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Total Additional Cost</p>
                          <p className="text-xl font-bold">{formatCurrency(stampDuty + registrationFee)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Important Notes:</h4>
                      <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                        <li>Stamp duty rates vary by state and property type</li>
                        <li>Additional charges may apply for legal documentation</li>
                        <li>First-time homebuyers may be eligible for concessions</li>
                        <li>Consult a legal expert for accurate calculations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ),
          },
          {
            key: '3',
            label: (
              <span>
                <DollarOutlined />
                <span className="ml-2 hidden sm:inline">Loan Eligibility</span>
              </span>
            ),
            children: (
              <Card id="loan-eligibility" className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Check Your Loan Eligibility</h3>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Income (₹)
                        <Tooltip title="Your gross monthly income (before taxes)">
                          <InfoCircleOutlined className="ml-1 text-gray-500" />
                        </Tooltip>
                      </label>
                      <InputNumber
                        className="w-full"
                        min={10000}
                        max={1000000}
                        step={5000}
                        value={monthlyIncome}
                        onChange={(value) => setMonthlyIncome(value || 0)}
                        formatter={(value) => `₹${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/₹\s?|(,*)/g, '')}
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Existing EMIs (₹)
                        <Tooltip title="Total of all your existing monthly loan EMIs">
                          <InfoCircleOutlined className="ml-1 text-gray-500" />
                        </Tooltip>
                      </label>
                      <InputNumber
                        className="w-full"
                        min={0}
                        max={monthlyIncome}
                        step={1000}
                        value={existingEmis}
                        onChange={(value) => setExistingEmis(value || 0)}
                        formatter={(value) => `₹${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/₹\s?|(,*)/g, '')}
                      />
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Interest Rate (% p.a.)
                        </label>
                        <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                          {eligibilityRate}%
                        </span>
                      </div>
                      <Slider
                        min={5}
                        max={15}
                        step={0.1}
                        value={eligibilityRate}
                        onChange={(value) => setEligibilityRate(value)}
                        tooltip={{ formatter: (value) => `${value}%` }}
                        className="mb-4"
                      />
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Loan Tenure (Years)
                        </label>
                        <span className="text-sm font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {eligibilityTenure} years
                        </span>
                      </div>
                      <Slider
                        min={5}
                        max={30}
                        value={eligibilityTenure}
                        onChange={(value) => setEligibilityTenure(value)}
                        tooltip={{ formatter: (value) => `${value} years` }}
                        className="mb-4"
                      />
                    </div>

                    <Button 
                      type="primary" 
                      onClick={calculateEligibility}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Check Eligibility
                    </Button>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">Eligibility Results</h3>
                      <Tooltip title="Download as Image">
                        <Button 
                          icon={<DownloadOutlined />} 
                          onClick={() => handleDownload('eligibility-result')}
                          size="small"
                        />
                      </Tooltip>
                    </div>

                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500 mb-1">Based on your income and expenses, you are eligible for</p>
                      <p className="text-3xl font-bold text-blue-600 mb-4">{formatCurrency(eligibleAmount)}</p>
                      
                      <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Monthly Income:</span>
                          <span className="font-medium">{formatCurrency(monthlyIncome)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Existing EMIs:</span>
                          <span className="font-medium">{formatCurrency(existingEmis)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Interest Rate:</span>
                          <span className="font-medium">{eligibilityRate}% p.a.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loan Tenure:</span>
                          <span className="font-medium">{eligibilityTenure} years</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">How to increase your eligibility?</h4>
                        <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5 text-left">
                          <li>Increase your down payment amount</li>
                          <li>Opt for a longer loan tenure</li>
                          <li>Consider a joint loan with a co-applicant</li>
                          <li>Improve your credit score</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ),
          },
          {
            key: '4',
            label: (
              <span>
                <SwapOutlined />
                <span className="ml-2 hidden sm:inline">Resale Value</span>
              </span>
            ),
            children: (
              <Card id="resale-value" className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Calculate Property Resale Value</h3>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purchase Price (₹)
                        <Tooltip title="The price you originally paid for the property">
                          <InfoCircleOutlined className="ml-1 text-gray-500" />
                        </Tooltip>
                      </label>
                      <InputNumber
                        className="w-full"
                        min={100000}
                        max={100000000}
                        step={10000}
                        value={purchasePrice}
                        onChange={(value) => setPurchasePrice(value || 0)}
                        formatter={(value) => `₹${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/₹\s?|(,*)/g, '')}
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purchase Year
                        <Tooltip title="The year when you purchased the property">
                          <InfoCircleOutlined className="ml-1 text-gray-500" />
                        </Tooltip>
                      </label>
                      <Select
                        className="w-full"
                        value={purchaseYear}
                        onChange={(value) => setPurchaseYear(value)}
                      >
                        {Array.from({length: 30}, (_, i) => currentYear - i).map((year) => (
                          <Option key={year} value={year}>{year}</Option>
                        ))}
                      </Select>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type
                        <Tooltip title="Select the type of property">
                          <InfoCircleOutlined className="ml-1 text-gray-500" />
                        </Tooltip>
                      </label>
                      <Select
                        className="w-full"
                        value={propertyType}
                        onChange={(value) => setPropertyType(value)}
                      >
                        <Option value="apartment">Apartment</Option>
                        <Option value="villa">Villa/Independent House</Option>
                        <Option value="plot">Plot/Land</Option>
                        <Option value="commercial">Commercial Property</Option>
                      </Select>
                    </div>

                    <Button 
                      type="primary" 
                      onClick={calculateResaleValue}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Calculate Resale Value
                    </Button>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">Resale Value Estimate</h3>
                      <Tooltip title="Download as Image">
                        <Button 
                          icon={<DownloadOutlined />} 
                          onClick={() => handleDownload('resale-value-result')}
                          size="small"
                        />
                      </Tooltip>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-lg shadow text-center">
                        <p className="text-sm text-gray-500 mb-1">Estimated Current Value</p>
                        <p className="text-3xl font-bold text-green-600">{formatCurrency(resaleValue)}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Appreciation: {appreciationRate}% p.a.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow">
                        <h4 className="font-medium text-gray-700 mb-3">Appreciation Summary</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Purchase Price ({purchaseYear}):</span>
                            <span className="font-medium">{formatCurrency(purchasePrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Value ({currentYear}):</span>
                            <span className="font-medium text-green-600">{formatCurrency(resaleValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Appreciation:</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(resaleValue - purchasePrice)} ({(resaleValue / purchasePrice * 100 - 100).toFixed(1)}%)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Holding Period:</span>
                            <span className="font-medium">{currentYear - purchaseYear} years</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Factors Affecting Resale Value</h4>
                        <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                          <li>Location and neighborhood development</li>
                          <li>Property condition and maintenance</li>
                          <li>Market trends and economic factors</li>
                          <li>Infrastructure projects in the area</li>
                          <li>Demand and supply dynamics</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ),
          },
        ]}
      />

      <style jsx global>{`n        .real-estate-tools .ant-tabs-nav {
          margin-bottom: 24px;
        }
        .real-estate-tools .ant-tabs-tab {
          padding: 12px 16px;
          margin: 0 4px;
          font-size: 14px;
        }
        .real-estate-tools .ant-tabs-tab-active {
          color: #2563eb;
          font-weight: 500;
        }
        .real-estate-tools .ant-tabs-ink-bar {
          background: #2563eb;
        }
        .real-estate-tools .ant-slider-handle::after {
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        .real-estate-tools .ant-slider-handle:focus::after,
        .real-estate-tools .ant-slider-handle:hover::after {
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
        }
        .real-estate-tools .ant-slider-track {
          background-color: #2563eb;
        }
        .real-estate-tools .ant-slider-handle {
          border-color: #2563eb;
        }
        .real-estate-tools .ant-btn-primary {
          background: #2563eb;
          border-color: #2563eb;
        }
        .real-estate-tools .ant-btn-primary:hover,
        .real-estate-tools .ant-btn-primary:focus {
          background: #1d4ed8;
          border-color: #1d4ed8;
        }
        @media (max-width: 768px) {
          .real-estate-tools .ant-tabs-nav {
            overflow-x: auto;
            white-space: nowrap;
            padding-bottom: 4px;
          }
          .real-estate-tools .ant-tabs-tab {
            padding: 8px 12px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default RealEstateTools;
