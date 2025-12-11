import React, { useState, useEffect } from 'react';
import { Slider, Input, Select, Button, Tooltip, Divider } from 'antd';
import { InfoCircleOutlined, DownloadOutlined, ShareAltOutlined, CalculatorOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image';

const { Option } = Select;

const LoanCalculator = () => {
  // State for input values
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [amortizationData, setAmortizationData] = useState([]);
  const [chartData, setChartData] = useState({});

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate EMI
  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const emiValue =
      (loanAmount *
        monthlyRate *
        Math.pow(1 + monthlyRate, tenure * 12)) /
      (Math.pow(1 + monthlyRate, tenure * 12) - 1);
    
    setEmi(emiValue);
    
    const totalPaymentValue = emiValue * tenure * 12;
    setTotalPayment(totalPaymentValue);
    setTotalInterest(totalPaymentValue - loanAmount);
    
    // Generate amortization data
    generateAmortizationData(loanAmount, monthlyRate, emiValue);
  };

  // Generate amortization schedule
  const generateAmortizationData = (principal, monthlyRate, emi) => {
    let balance = principal;
    const data = [];
    let yearData = [];
    
    for (let i = 1; i <= tenure * 12; i++) {
      const interest = balance * monthlyRate;
      const principalPaid = emi - interest;
      balance -= principalPaid;
      
      if (i % 12 === 0 || i === 1) {
        yearData.push({
          year: Math.ceil(i / 12),
          principal: principalPaid * 12,
          interest: interest * 12,
          balance: balance > 0 ? balance : 0
        });
      }
      
      if (i % 12 === 0 || i === tenure * 12) {
        data.push({
          month: i,
          principal: principalPaid,
          interest,
          balance: balance > 0 ? balance : 0,
          emi
        });
      }
    }
    
    setAmortizationData(yearData);
    prepareChartData(yearData);
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateEMI();
  };

  // Handle download as image
  const handleDownload = async () => {
    const element = document.getElementById('loan-calculator-result');
    if (!element) return;

    try {
      const dataUrl = await htmlToImage.toPng(element);
      const link = document.createElement('a');
      link.download = `loan-calculator-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Loan Calculator Results',
          text: `Check out my loan calculation: EMI: ${formatCurrency(emi)}/month`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(
          `Loan Amount: ${formatCurrency(loanAmount)}\n` +
          `Interest Rate: ${interestRate}%\n` +
          `Tenure: ${tenure} years\n` +
          `EMI: ${formatCurrency(emi)}/month\n` +
          `Total Payment: ${formatCurrency(totalPayment)}\n` +
          `Total Interest: ${formatCurrency(totalInterest)}`
        );
        alert('Results copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Initial calculation on component mount
  useEffect(() => {
    calculateEMI();
  }, []);

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <CalculatorOutlined className="mr-2 text-blue-600" />
        Home Loan EMI Calculator
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
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

        <div>
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

        <div>
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

        <div className="flex space-x-4">
          <Button 
            type="primary" 
            htmlType="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Calculate EMI
          </Button>
        </div>
      </form>

      <div id="loan-calculator-result" className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Loan Summary</h3>
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
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Amortization Schedule (Yearly)</h4>
            <div className="flex space-x-2">
              <Button 
                icon={<DownloadOutlined />} 
                onClick={handleDownload}
                className="flex items-center"
              >
                Save
              </Button>
              <Button 
                icon={<ShareAltOutlined />} 
                onClick={handleShare}
                className="flex items-center"
              >
                Share
              </Button>
            </div>
          </div>
          
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
    </div>
  );
};

export default LoanCalculator;
