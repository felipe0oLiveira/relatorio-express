'use client';

import { useState } from 'react';

// Dados de exemplo baseados na imagem
const sampleData = [
  {
    id: 1,
    retailer: 'Foot Locker',
    retailerId: '1185732',
    invoiceDate: '01 Jan 2020 00:00:00',
    region: 'Northeast',
    state: 'New York',
    city: 'New York',
    product: "Men's Street Footwear",
    pricePerUnit: 50.00,
    unitsSold: 1200,
    totalSales: 600000.00,
    operatingProfit: 300000.00,
    operatingMargin: 50
  },
  {
    id: 2,
    retailer: 'Amazon',
    retailerId: '1185733',
    invoiceDate: '02 Jan 2020 00:00:00',
    region: 'West',
    state: 'California',
    city: 'Los Angeles',
    product: "Women's Athletic Footwear",
    pricePerUnit: 40.00,
    unitsSold: 1000,
    totalSales: 400000.00,
    operatingProfit: 200000.00,
    operatingMargin: 50
  },
  {
    id: 3,
    retailer: 'Walmart',
    retailerId: '1185734',
    invoiceDate: '03 Jan 2020 00:00:00',
    region: 'South',
    state: 'Texas',
    city: 'Houston',
    product: "Men's Apparel",
    pricePerUnit: 35.00,
    unitsSold: 850,
    totalSales: 297500.00,
    operatingProfit: 148750.00,
    operatingMargin: 50
  },
  {
    id: 4,
    retailer: 'Kohl\'s',
    retailerId: '1185735',
    invoiceDate: '04 Jan 2020 00:00:00',
    region: 'Midwest',
    state: 'Illinois',
    city: 'Chicago',
    product: "Women's Apparel",
    pricePerUnit: 30.00,
    unitsSold: 750,
    totalSales: 225000.00,
    operatingProfit: 112500.00,
    operatingMargin: 50
  },
  {
    id: 5,
    retailer: 'Sports Direct',
    retailerId: '1185736',
    invoiceDate: '05 Jan 2020 00:00:00',
    region: 'Southeast',
    state: 'Florida',
    city: 'Miami',
    product: "Men's Athletic Footwear",
    pricePerUnit: 45.00,
    unitsSold: 900,
    totalSales: 405000.00,
    operatingProfit: 202500.00,
    operatingMargin: 50
  },
  {
    id: 6,
    retailer: 'Target',
    retailerId: '1185737',
    invoiceDate: '06 Jan 2020 00:00:00',
    region: 'Midwest',
    state: 'Minnesota',
    city: 'Minneapolis',
    product: "Women's Street Footwear",
    pricePerUnit: 55.00,
    unitsSold: 1100,
    totalSales: 605000.00,
    operatingProfit: 302500.00,
    operatingMargin: 50
  },
  {
    id: 7,
    retailer: 'Best Buy',
    retailerId: '1185738',
    invoiceDate: '07 Jan 2020 00:00:00',
    region: 'North',
    state: 'Michigan',
    city: 'Detroit',
    product: "Men's Apparel",
    pricePerUnit: 25.00,
    unitsSold: 600,
    totalSales: 150000.00,
    operatingProfit: 75000.00,
    operatingMargin: 50
  },
  {
    id: 8,
    retailer: 'Macy\'s',
    retailerId: '1185739',
    invoiceDate: '08 Jan 2020 00:00:00',
    region: 'Northeast',
    state: 'Massachusetts',
    city: 'Boston',
    product: "Women's Athletic Footwear",
    pricePerUnit: 65.00,
    unitsSold: 1300,
    totalSales: 845000.00,
    operatingProfit: 422500.00,
    operatingMargin: 50
  },
  {
    id: 9,
    retailer: 'Nordstrom',
    retailerId: '1185740',
    invoiceDate: '09 Jan 2020 00:00:00',
    region: 'West',
    state: 'Washington',
    city: 'Seattle',
    product: "Men's Street Footwear",
    pricePerUnit: 75.00,
    unitsSold: 800,
    totalSales: 600000.00,
    operatingProfit: 300000.00,
    operatingMargin: 50
  },
  {
    id: 10,
    retailer: 'Dick\'s Sporting Goods',
    retailerId: '1185741',
    invoiceDate: '10 Jan 2020 00:00:00',
    region: 'Northeast',
    state: 'Pennsylvania',
    city: 'Pittsburgh',
    product: "Men's Athletic Footwear",
    pricePerUnit: 60.00,
    unitsSold: 950,
    totalSales: 570000.00,
    operatingProfit: 285000.00,
    operatingMargin: 50
  },
  {
    id: 11,
    retailer: 'H&M',
    retailerId: '1185742',
    invoiceDate: '11 Jan 2020 00:00:00',
    region: 'West',
    state: 'Oregon',
    city: 'Portland',
    product: "Women's Apparel",
    pricePerUnit: 20.00,
    unitsSold: 1500,
    totalSales: 300000.00,
    operatingProfit: 150000.00,
    operatingMargin: 50
  },
  {
    id: 12,
    retailer: 'Zara',
    retailerId: '1185743',
    invoiceDate: '12 Jan 2020 00:00:00',
    region: 'South',
    state: 'Georgia',
    city: 'Atlanta',
    product: "Women's Street Footwear",
    pricePerUnit: 45.00,
    unitsSold: 700,
    totalSales: 315000.00,
    operatingProfit: 157500.00,
    operatingMargin: 50
  },
  {
    id: 13,
    retailer: 'Gap',
    retailerId: '1185744',
    invoiceDate: '13 Jan 2020 00:00:00',
    region: 'Midwest',
    state: 'Ohio',
    city: 'Cleveland',
    product: "Men's Apparel",
    pricePerUnit: 35.00,
    unitsSold: 900,
    totalSales: 315000.00,
    operatingProfit: 157500.00,
    operatingMargin: 50
  },
  {
    id: 14,
    retailer: 'Old Navy',
    retailerId: '1185745',
    invoiceDate: '14 Jan 2020 00:00:00',
    region: 'Southeast',
    state: 'North Carolina',
    city: 'Charlotte',
    product: "Women's Athletic Footwear",
    pricePerUnit: 30.00,
    unitsSold: 1200,
    totalSales: 360000.00,
    operatingProfit: 180000.00,
    operatingMargin: 50
  },
  {
    id: 15,
    retailer: 'Uniqlo',
    retailerId: '1185746',
    invoiceDate: '15 Jan 2020 00:00:00',
    region: 'West',
    state: 'Nevada',
    city: 'Las Vegas',
    product: "Men's Street Footwear",
    pricePerUnit: 40.00,
    unitsSold: 850,
    totalSales: 340000.00,
    operatingProfit: 170000.00,
    operatingMargin: 50
  },
  {
    id: 16,
    retailer: 'Forever 21',
    retailerId: '1185747',
    invoiceDate: '16 Jan 2020 00:00:00',
    region: 'South',
    state: 'Louisiana',
    city: 'New Orleans',
    product: "Women's Apparel",
    pricePerUnit: 25.00,
    unitsSold: 1100,
    totalSales: 275000.00,
    operatingProfit: 137500.00,
    operatingMargin: 50
  },
  {
    id: 17,
    retailer: 'Urban Outfitters',
    retailerId: '1185748',
    invoiceDate: '17 Jan 2020 00:00:00',
    region: 'Northeast',
    state: 'New Jersey',
    city: 'Newark',
    product: "Women's Street Footwear",
    pricePerUnit: 55.00,
    unitsSold: 650,
    totalSales: 357500.00,
    operatingProfit: 178750.00,
    operatingMargin: 50
  },
  {
    id: 18,
    retailer: 'Anthropologie',
    retailerId: '1185749',
    invoiceDate: '18 Jan 2020 00:00:00',
    region: 'West',
    state: 'Colorado',
    city: 'Denver',
    product: "Women's Athletic Footwear",
    pricePerUnit: 70.00,
    unitsSold: 500,
    totalSales: 350000.00,
    operatingProfit: 175000.00,
    operatingMargin: 50
  }
];

export default function Upload() {
  const [data] = useState(sampleData);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(18);

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Toolbar */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Action buttons */}
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Importar dados
            </button>
            <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center">
              Filtro
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Classificar
            </button>
            <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Adicionar
            </button>
            <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Excluir
            </button>
            <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Mais
            </button>
          </div>

          {/* Right side - Search */}
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar dados"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                T
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Retailer
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Retailer ID
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice Date
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                T
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                T
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                T
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                T
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price per Unit
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Units Sold
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Sales
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operating Profi
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                % Operating Marg
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">
                  {row.id}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">
                  T
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">
                  {row.retailer}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">
                  #
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">
                  {row.retailerId}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">
                  {row.invoiceDate}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">
                  T
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">
                  {row.region}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">
                  T
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">
                  {row.state}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">
                  T
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">
                  {row.city}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">
                  T
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">
                  {row.product}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">
                  {formatCurrency(row.pricePerUnit)}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">
                  #
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">
                  {formatNumber(row.unitsSold)}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">
                  {formatCurrency(row.totalSales)}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">
                  {formatCurrency(row.operatingProfit)}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">
                  {row.operatingMargin}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer/Status Bar */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          {/* Left side - Chat icon */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">Here is your Smart Chat (Ctrl+Space)</span>
          </div>

          {/* Right side - Pagination and status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <span className="text-sm text-gray-600">Linhas: {data.length}</span>
            <div className="w-4 h-4 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
} 