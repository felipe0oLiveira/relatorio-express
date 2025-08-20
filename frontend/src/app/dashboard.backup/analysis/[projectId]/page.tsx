'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import ChartComponent from '../../../../components/ChartComponent';
import ChartCard from '../../../../components/ChartCard';
import DataQualityBadge from '../../../../components/DataQualityBadge';
import SankeyChart from '../../../../components/SankeyChart';

type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'histogram' | 'area' | 'column' | 'heatmap';



// Função para gerar dados completos (simulando um arquivo Excel grande)
const generateCompleteData = () => {
  const retailers = [
    'Foot Locker', 'Amazon', 'Walmart', 'Kohl\'s', 'Sports Direct', 'Target', 'Best Buy', 'Macy\'s', 
    'Nordstrom', 'Dick\'s Sporting Goods', 'H&M', 'Zara', 'Gap', 'Old Navy', 'Uniqlo', 'Forever 21', 
    'Urban Outfitters', 'Anthropologie', 'Nike', 'Adidas', 'Under Armour', 'Puma', 'New Balance', 
    'Converse', 'Vans', 'Timberland', 'Dr. Martens', 'Clarks', 'Steve Madden', 'Nine West'
  ];
  
  const regions = ['Northeast', 'West', 'South', 'Midwest', 'North', 'Southeast'] as const;
  const states: Record<string, string[]> = {
    'Northeast': ['New York', 'Massachusetts', 'Pennsylvania', 'New Jersey', 'Connecticut', 'Rhode Island'],
    'West': ['California', 'Washington', 'Oregon', 'Nevada', 'Colorado', 'Arizona'],
    'South': ['Texas', 'Georgia', 'Louisiana', 'Florida', 'Alabama', 'Mississippi'],
    'Midwest': ['Illinois', 'Minnesota', 'Ohio', 'Michigan', 'Indiana', 'Wisconsin'],
    'North': ['Michigan', 'Minnesota', 'Wisconsin', 'North Dakota', 'South Dakota'],
    'Southeast': ['Florida', 'North Carolina', 'South Carolina', 'Tennessee', 'Kentucky', 'Virginia']
  };
  
  const cities: Record<string, string[]> = {
    'New York': ['New York', 'Buffalo', 'Rochester', 'Syracuse'],
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
    'Illinois': ['Chicago', 'Springfield', 'Peoria', 'Rockford']
  };
  
  const products = [
    "Men's Street Footwear", "Women's Athletic Footwear", "Men's Apparel", "Women's Apparel",
    "Men's Athletic Footwear", "Women's Street Footwear", "Kids' Footwear", "Accessories",
    "Sports Equipment", "Outdoor Gear", "Fitness Wear", "Casual Wear", "Formal Wear"
  ];
  
  const data = [];
  let id = 1;
  
  // Gerar 1500+ linhas de dados (simulando um arquivo Excel completo)
  for (let i = 0; i < 1500; i++) {
    const retailer = retailers[Math.floor(Math.random() * retailers.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const state = states[region][Math.floor(Math.random() * states[region].length)];
    const cityOptions = cities[state] || [state + ' City', state + ' Town', state + ' Village'];
    const city = cityOptions[Math.floor(Math.random() * cityOptions.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    
    // Gerar data aleatória em 2020
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2020-12-31');
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const invoiceDate = randomDate.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }) + ' 00:00:00';
    
    const pricePerUnit = Math.floor(Math.random() * 100) + 20; // $20-$120
    const unitsSold = Math.floor(Math.random() * 2000) + 100; // 100-2100
    const totalSales = pricePerUnit * unitsSold;
    const operatingProfit = totalSales * (Math.random() * 0.6 + 0.2); // 20%-80% margin
    const operatingMargin = Math.round((operatingProfit / totalSales) * 100);
    
    data.push({
      id: id++,
      retailer,
      retailerId: (1185730 + Math.floor(Math.random() * 1000)).toString(),
      invoiceDate,
      region,
      state,
      city,
      product,
      pricePerUnit,
      unitsSold,
      totalSales,
      operatingProfit,
      operatingMargin
    });
  }
  
  return data;
};

const completeData = generateCompleteData();

export default function AnalysisPage({ params }: { params: { projectId: string } }) {
  const [data] = useState(completeData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAutoReportModal, setShowAutoReportModal] = useState(true);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [chartTypes, setChartTypes] = useState<{ [key: string]: string }>({
    'region-sales': 'bar',
    'distribution': 'bar',
    'sales-method': 'horizontal-bar',
    'region-units': 'horizontal-bar',
    'product-sales': 'line',
    'invoice-date': 'radar',
    'sankey': 'sankey',
    'distribution-table': 'table'
  });

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

  const handleAutoReportYes = () => {
    setShowAutoReportModal(false);
    setShowSuggestionsModal(true);
    
    // Simular progresso
    setTimeout(() => {
      setShowSuggestionsModal(false);
    }, 3000);
  };



  const handleViewAnalysis = (analysisId: string) => {
    setActiveAnalysis(analysisId);
    setShowAnalysisView(true);
  };

  const handleBackToData = () => {
    setShowAnalysisView(false);
    setActiveAnalysis(null);
  };

  const handleChartTypeChange = (chartId: string, newType: string) => {
    console.log('Mudando tipo de gráfico:', chartId, 'para:', newType);
    setChartTypes(prev => ({
      ...prev,
      [chartId]: newType
    }));
  };

  // Função para baixar relatório Excel
  const handleDownloadExcel = async () => {
    try {
      console.log('📊 Iniciando download do relatório Excel...');
      
      // Obter token de autenticação
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Erro: Token de autenticação não encontrado');
        return;
      }

      // Fazer requisição para o backend
      const response = await fetch(`http://localhost:8000/analytics/export-excel/${params.projectId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      // Obter o blob do arquivo
      const blob = await response.blob();
      
      // Criar URL para download
      const url = window.URL.createObjectURL(blob);
      
      // Criar link de download
      const link = document.createElement('a');
      link.href = url;
      
      // Obter nome do arquivo do header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'analise_units_sold.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      
      // Simular clique para iniciar download
      document.body.appendChild(link);
      link.click();
      
      // Limpar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Download do relatório Excel concluído!');
      
    } catch (error) {
      console.error('❌ Erro ao baixar relatório Excel:', error);
      alert('Erro ao baixar relatório Excel. Verifique o console para mais detalhes.');
    }
  };

  // Funções para gerar dados de análise
  const generateUnitsSoldAnalysis = () => {
    const retailerData = data.reduce((acc, item) => {
      if (!acc[item.retailer]) {
        acc[item.retailer] = 0;
      }
      acc[item.retailer] += item.unitsSold;
      return acc;
    }, {} as Record<string, number>);

    const topRetailers = Object.entries(retailerData)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    return {
      title: "Análise de Unidades Vendidas",
      description: "Top 10 varejistas por volume de vendas",
      chartData: topRetailers.map(([retailer, units]) => ({
        name: retailer,
        value: units,
        percentage: ((units / Object.values(retailerData).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
      })),
      totalUnits: Object.values(retailerData).reduce((a, b) => a + b, 0),
      averageUnits: Math.round(Object.values(retailerData).reduce((a, b) => a + b, 0) / Object.keys(retailerData).length)
    };
  };

  const generateRetailerIDAnalysis = () => {
    const regionData = data.reduce((acc, item) => {
      if (!acc[item.region]) {
        acc[item.region] = { units: 0, sales: 0, retailers: new Set() };
      }
      acc[item.region].units += item.unitsSold;
      acc[item.region].sales += item.totalSales;
      acc[item.region].retailers.add(item.retailer);
      return acc;
    }, {} as Record<string, { units: number; sales: number; retailers: Set<string> }>);

    return {
      title: "Análise por Região",
      description: "Performance por região geográfica",
      chartData: Object.entries(regionData).map(([region, data]) => ({
        name: region,
        units: data.units,
        sales: data.sales,
        retailers: data.retailers.size
      })),
      totalRegions: Object.keys(regionData).length,
      totalRetailers: new Set(data.map(item => item.retailer)).size
    };
  };

  const generateOperatingMarginAnalysis = () => {
    const marginData = data.reduce((acc, item) => {
      const marginRange = Math.floor(item.operatingMargin / 10) * 10;
      const key = `${marginRange}-${marginRange + 9}%`;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key]++;
      return acc;
    }, {} as Record<string, number>);

    return {
      title: "Análise de Margem Operacional",
      description: "Distribuição das margens operacionais",
      chartData: Object.entries(marginData).map(([range, count]) => ({
        name: range,
        value: count,
        percentage: ((count / data.length) * 100).toFixed(1)
      })),
      averageMargin: (data.reduce((sum, item) => sum + item.operatingMargin, 0) / data.length).toFixed(1),
      maxMargin: Math.max(...data.map(item => item.operatingMargin)),
      minMargin: Math.min(...data.map(item => item.operatingMargin))
    };
  };

  const generateOperatingProfitAnalysis = () => {
    const profitData = data.reduce((acc, item) => {
      if (!acc[item.retailer]) {
        acc[item.retailer] = 0;
      }
      acc[item.retailer] += item.operatingProfit;
      return acc;
    }, {} as Record<string, number>);

    const topProfitable = Object.entries(profitData)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8);

    return {
      title: "Análise de Lucro Operacional",
      description: "Top 8 varejistas por lucro operacional",
      chartData: topProfitable.map(([retailer, profit]) => ({
        name: retailer,
        value: profit,
        formatted: formatCurrency(profit)
      })),
      totalProfit: Object.values(profitData).reduce((a, b) => a + b, 0),
      averageProfit: Object.values(profitData).reduce((a, b) => a + b, 0) / Object.keys(profitData).length
    };
  };

  const generateComparisonAnalysis = () => {
    const comparisonData = data.reduce((acc, item) => {
      if (!acc[item.retailer]) {
        acc[item.retailer] = { units: 0, profit: 0 };
      }
      acc[item.retailer].units += item.unitsSold;
      acc[item.retailer].profit += item.operatingProfit;
      return acc;
    }, {} as Record<string, { units: number; profit: number }>);

    const topComparisons = Object.entries(comparisonData)
      .sort(([,a], [,b]) => b.profit - a.profit)
      .slice(0, 6);

    return {
      title: "Comparação: Unidades vs Lucro",
      description: "Relação entre volume de vendas e lucratividade",
      chartData: topComparisons.map(([retailer, data]) => ({
        name: retailer,
        units: data.units,
        profit: data.profit,
        efficiency: (data.profit / data.units).toFixed(2)
      })),
      correlation: "Positiva",
      insight: "Varejistas com maior volume tendem a ter maior lucro"
    };
  };

  // Dados para gráficos interativos
  const unitsSoldChartData = [
    { name: 'Jan 2020', units: 25000, online: 12000, instore: 8000, outlet: 5000 },
    { name: 'Feb 2020', units: 30000, online: 15000, instore: 10000, outlet: 5000 },
    { name: 'Mar 2020', units: 35000, online: 18000, instore: 12000, outlet: 5000 },
    { name: 'Apr 2020', units: 40000, online: 22000, instore: 13000, outlet: 5000 },
    { name: 'May 2020', units: 45000, online: 25000, instore: 14000, outlet: 6000 },
    { name: 'Jun 2020', units: 50000, online: 28000, instore: 15000, outlet: 7000 },
    { name: 'Jul 2020', units: 55000, online: 30000, instore: 18000, outlet: 7000 },
    { name: 'Aug 2020', units: 60000, online: 32000, instore: 20000, outlet: 8000 },
    { name: 'Sep 2020', units: 65000, online: 35000, instore: 22000, outlet: 8000 },
    { name: 'Oct 2020', units: 70000, online: 38000, instore: 24000, outlet: 8000 },
    { name: 'Nov 2020', units: 75000, online: 40000, instore: 26000, outlet: 9000 },
    { name: 'Dec 2020', units: 80000, online: 42000, instore: 28000, outlet: 10000 },
    { name: 'Jan 2021', units: 140000, online: 75000, instore: 45000, outlet: 20000 },
    { name: 'Feb 2021', units: 150000, online: 80000, instore: 50000, outlet: 20000 },
    { name: 'Mar 2021', units: 160000, online: 85000, instore: 55000, outlet: 20000 },
    { name: 'Apr 2021', units: 170000, online: 90000, instore: 60000, outlet: 20000 },
    { name: 'May 2021', units: 180000, online: 95000, instore: 65000, outlet: 20000 },
    { name: 'Jun 2021', units: 190000, online: 100000, instore: 70000, outlet: 20000 },
    { name: 'Jul 2021', units: 200000, online: 105000, instore: 75000, outlet: 20000 },
    { name: 'Aug 2021', units: 210000, online: 110000, instore: 80000, outlet: 20000 },
    { name: 'Sep 2021', units: 220000, online: 115000, instore: 85000, outlet: 20000 },
    { name: 'Oct 2021', units: 230000, online: 120000, instore: 90000, outlet: 20000 },
    { name: 'Nov 2021', units: 149000, online: 78000, instore: 52000, outlet: 19000 },
    { name: 'Dec 2021', units: 171000, online: 89000, instore: 58000, outlet: 24000 }
  ];

  const regionSalesMethodData = [
    { region: 'Midwest', instore: 150000, online: 180000, outlet: 80000 },
    { region: 'Northeast', instore: 200000, online: 100000, outlet: 180000 },
    { region: 'South', instore: 5000, online: 200000, outlet: 250000 },
    { region: 'Southeast', instore: 120000, online: 200000, outlet: 50000 },
    { region: 'West', instore: 190000, online: 220000, outlet: 250000 }
  ];

  const productRegionData = [
    { product: "Men's Apparel", midwest: 20.2, northeast: 19.8, south: 17.7, southeast: 14.8, west: 27.5 },
    { product: "Men's Athletic", midwest: 18.7, northeast: 20.7, south: 19.3, southeast: 19.8, west: 29.3 },
    { product: "Men's Streetwear", midwest: 18.5, northeast: 22.6, south: 18.0, southeast: 15.5, west: 25.4 },
    { product: "Women's Apparel", midwest: 20.8, northeast: 20.5, south: 18.5, southeast: 13.3, west: 26.9 },
    { product: "Women's Athletic", midwest: 18.7, northeast: 17.4, south: 19.4, southeast: 15.0, west: 29.5 },
    { product: "Women's Streetwear", midwest: 18.9, northeast: 21.0, south: 17.1, southeast: 14.0, west: 29.0 }
  ];

  const productBubbleData = [
    { name: "Men's Apparel", units: 300000, size: 30 },
    { name: "Men's Athletic", units: 450000, size: 45 },
    { name: "Men's Streetwear", units: 580000, size: 58 },
    { name: "Women's Apparel", units: 450000, size: 45 },
    { name: "Women's Athletic", units: 320000, size: 32 },
    { name: "Women's Streetwear", units: 380000, size: 38 }
  ];

  const topRetailersData = [
    { name: 'West Gear', units: 550000 },
    { name: 'Foot Locker', units: 450000 },
    { name: 'Sports Direct', units: 350000 },
    { name: 'Kohl\'s', units: 250000 },
    { name: 'Walmart', units: 200000 }
  ];

  const movingAverageData = [
    { month: 'Jan 2020', average: 75000 },
    { month: 'Feb 2020', average: 78000 },
    { month: 'Mar 2020', average: 82000 },
    { month: 'Apr 2020', average: 85000 },
    { month: 'May 2020', average: 88000 },
    { month: 'Jun 2020', average: 92000 },
    { month: 'Jul 2020', average: 95000 },
    { month: 'Aug 2020', average: 98000 },
    { month: 'Sep 2020', average: 102000 },
    { month: 'Oct 2020', average: 105000 },
    { month: 'Nov 2020', average: 108000 },
    { month: 'Dec 2020', average: 110000 },
    { month: 'Jan 2021', average: 125000 },
    { month: 'Feb 2021', average: 130000 },
    { month: 'Mar 2021', average: 135000 },
    { month: 'Apr 2021', average: 140000 },
    { month: 'May 2021', average: 145000 },
    { month: 'Jun 2021', average: 150000 },
    { month: 'Jul 2021', average: 155000 },
    { month: 'Aug 2021', average: 160000 },
    { month: 'Sep 2021', average: 165000 },
    { month: 'Oct 2021', average: 170000 },
    { month: 'Nov 2021', average: 160000 },
    { month: 'Dec 2021', average: 165000 }
  ];

  const regionTimeData = [
    { month: 'Jan 2020', midwest: 20000, northeast: 25000, south: 30000, southeast: 22000, west: 28000 },
    { month: 'Feb 2020', midwest: 22000, northeast: 28000, south: 35000, southeast: 24000, west: 32000 },
    { month: 'Mar 2020', midwest: 25000, northeast: 32000, south: 40000, southeast: 27000, west: 38000 },
    { month: 'Apr 2020', midwest: 28000, northeast: 35000, south: 45000, southeast: 30000, west: 42000 },
    { month: 'May 2020', midwest: 30000, northeast: 38000, south: 50000, southeast: 32000, west: 45000 },
    { month: 'Jun 2020', midwest: 32000, northeast: 40000, south: 55000, southeast: 35000, west: 48000 },
    { month: 'Jul 2020', midwest: 35000, northeast: 42000, south: 60000, southeast: 38000, west: 52000 },
    { month: 'Aug 2020', midwest: 38000, northeast: 45000, south: 65000, southeast: 40000, west: 55000 },
    { month: 'Sep 2020', midwest: 40000, northeast: 48000, south: 70000, southeast: 42000, west: 58000 },
    { month: 'Oct 2020', midwest: 42000, northeast: 50000, south: 75000, southeast: 45000, west: 62000 },
    { month: 'Nov 2020', midwest: 45000, northeast: 52000, south: 80000, southeast: 48000, west: 65000 },
    { month: 'Dec 2020', midwest: 48000, northeast: 55000, south: 85000, southeast: 50000, west: 68000 },
    { month: 'Jan 2021', midwest: 60000, northeast: 70000, south: 90000, southeast: 65000, west: 80000 },
    { month: 'Feb 2021', midwest: 65000, northeast: 75000, south: 95000, southeast: 70000, west: 85000 },
    { month: 'Mar 2021', midwest: 70000, northeast: 80000, south: 100000, southeast: 75000, west: 90000 },
    { month: 'Apr 2021', midwest: 75000, northeast: 85000, south: 105000, southeast: 80000, west: 95000 },
    { month: 'May 2021', midwest: 80000, northeast: 90000, south: 110000, southeast: 85000, west: 100000 },
    { month: 'Jun 2021', midwest: 85000, northeast: 95000, south: 115000, southeast: 90000, west: 105000 },
    { month: 'Jul 2021', midwest: 90000, northeast: 100000, south: 120000, southeast: 95000, west: 110000 },
    { month: 'Aug 2021', midwest: 95000, northeast: 105000, south: 125000, southeast: 100000, west: 115000 },
    { month: 'Sep 2021', midwest: 100000, northeast: 110000, south: 130000, southeast: 105000, west: 120000 },
    { month: 'Oct 2021', midwest: 105000, northeast: 115000, south: 135000, southeast: 110000, west: 125000 },
    { month: 'Nov 2021', midwest: 95000, northeast: 105000, south: 120000, southeast: 100000, west: 110000 },
    { month: 'Dec 2021', midwest: 100000, northeast: 110000, south: 125000, southeast: 105000, west: 115000 }
  ];

  const sankeyData = [
    { from: 'In-store', to: 'Amazon', value: 150000 },
    { from: 'In-store', to: 'Foot Locker', value: 120000 },
    { from: 'In-store', to: 'Kohl\'s', value: 140000 },
    { from: 'In-store', to: 'Sports Direct', value: 100000 },
    { from: 'In-store', to: 'Walmart', value: 80000 },
    { from: 'In-store', to: 'West Gear', value: 150000 },
    { from: 'Online', to: 'Amazon', value: 200000 },
    { from: 'Online', to: 'Foot Locker', value: 100000 },
    { from: 'Online', to: 'Kohl\'s', value: 120000 },
    { from: 'Online', to: 'Sports Direct', value: 180000 },
    { from: 'Online', to: 'Walmart', value: 120000 },
    { from: 'Online', to: 'West Gear', value: 100000 },
    { from: 'Outlet', to: 'Amazon', value: 180000 },
    { from: 'Outlet', to: 'Foot Locker', value: 170000 },
    { from: 'Outlet', to: 'Kohl\'s', value: 250000 },
    { from: 'Outlet', to: 'Sports Direct', value: 190000 },
    { from: 'Outlet', to: 'Walmart', value: 180000 },
    { from: 'Outlet', to: 'West Gear', value: 270000 }
  ];

  // Dados para gráfico de previsão semanal
  const weeklyForecastData = [
    { week: 'W01 2020', units: 12000, forecast: null },
    { week: 'W05 2020', units: 15000, forecast: null },
    { week: 'W10 2020', units: 18000, forecast: null },
    { week: 'W15 2020', units: 22000, forecast: null },
    { week: 'W20 2020', units: 32000, forecast: null },
    { week: 'W25 2020', units: 28000, forecast: null },
    { week: 'W30 2020', units: 25000, forecast: null },
    { week: 'W35 2020', units: 20000, forecast: null },
    { week: 'W40 2020', units: 15000, forecast: null },
    { week: 'W45 2020', units: 10000, forecast: null },
    { week: 'W50 2020', units: 8000, forecast: null },
    { week: 'W01 2021', units: 55000, forecast: null },
    { week: 'W05 2021', units: 52000, forecast: null },
    { week: 'W10 2021', units: 48000, forecast: null },
    { week: 'W15 2021', units: 52000, forecast: null },
    { week: 'W20 2021', units: 58000, forecast: null },
    { week: 'W25 2021', units: 54000, forecast: null },
    { week: 'W30 2021', units: 56000, forecast: null },
    { week: 'W35 2021', units: 52000, forecast: null },
    { week: 'W38 2021', units: 62000, forecast: null },
    { week: 'W42 2021', units: 58000, forecast: null },
    { week: 'W45 2021', units: 54000, forecast: null },
    { week: 'W48 2021', units: 50000, forecast: 48000 },
    { week: 'W50 2021', units: null, forecast: 45000 },
    { week: 'W52 2021', units: null, forecast: 42000 },
    { week: 'W01 2022', units: null, forecast: 46000 }
  ];

  // Dados para tendência trimestral
  const quarterlyTrendData = [
    { quarter: 'Q1 2020', units: 130000, trend: 120000 },
    { quarter: 'Q2 2020', units: 110000, trend: 140000 },
    { quarter: 'Q3 2020', units: 95000, trend: 160000 },
    { quarter: 'Q4 2020', units: 85000, trend: 180000 },
    { quarter: 'Q1 2021', units: 280000, trend: 200000 },
    { quarter: 'Q2 2021', units: 320000, trend: 220000 },
    { quarter: 'Q3 2021', units: 520000, trend: 240000 },
    { quarter: 'Q4 2021', units: 470000, trend: 260000 }
  ];

  // Dados para tabela de distribuição
  const distributionTableData = [
    { month: 'Jan 2020', region: 'Northeast', instore: 0.3, online: 0.2, outlet: 0.8, total: 1.3 },
    { month: 'Jan 2020', region: 'West', instore: 0.0, online: 0.1, outlet: 0.5, total: 0.6 },
    { month: 'Feb 2020', region: 'Northeast', instore: 0.0, online: 0.1, outlet: 0.5, total: 0.6 },
    { month: 'Feb 2020', region: 'West', instore: 0.4, online: 0.2, outlet: 0.4, total: 0.9 },
    { month: 'Mar 2020', region: 'Northeast', instore: 0.0, online: 0.2, outlet: 0.9, total: 1.1 },
    { month: 'Mar 2020', region: 'West', instore: 0.5, online: 0.1, outlet: 0.1, total: 0.8 },
    { month: 'Apr 2020', region: 'Northeast', instore: 0.0, online: 0.2, outlet: 0.7, total: 0.9 },
    { month: 'Apr 2020', region: 'Southeast', instore: 0.5, online: 0.1, outlet: 0.0, total: 0.6 },
    { month: 'Apr 2020', region: 'West', instore: 0.6, online: 0.2, outlet: 0.0, total: 0.7 },
    { month: 'May 2020', region: 'Northeast', instore: 0.0, online: 0.1, outlet: 0.4, total: 0.5 },
    { month: 'May 2020', region: 'Southeast', instore: 0.2, online: 0.1, outlet: 0.0, total: 0.3 }
  ];



  return (
    <div className="min-h-screen bg-white flex">
      {/* Main Content - Left Side */}
      <div className="flex-1">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">Sem título-1</h1>
              <div className="flex items-center gap-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M3,7 12,13 21,7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                Projeto de edição
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                Compartilhar
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Importar dados
              </button>
              <button 
                onClick={handleDownloadExcel}
                className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar Excel
              </button>
              <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center">
                Filtro
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <DataQualityBadge 
                issueCount={80} 
                issueType="Erros Identificados"
                onDismiss={() => console.log('Badge de qualidade removido')}
              />
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
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retailer</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retailer ID</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Date</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price per Unit</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operating Profi</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Operating Marg</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.slice(0, 18).map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{row.id}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">T</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{row.retailer}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">#</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{row.retailerId}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{row.invoiceDate}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">T</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{row.region}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">T</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{row.state}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">T</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{row.city}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">T</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{row.product}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{formatCurrency(row.pricePerUnit)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500">#</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{formatNumber(row.unitsSold)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{formatCurrency(row.totalSales)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{formatCurrency(row.operatingProfit)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{row.operatingMargin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Here is your Smart Chat (Ctrl+Space)</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <span className="text-sm text-gray-600">Linhas: {data.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Right Side */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Sugestões</h2>
          </div>
          <p className="text-sm text-gray-600">
            Os painéis/relatórios gerados automaticamente estão listados abaixo. Você pode visualizá-los e escolhê-los ou personalizá-los com base em suas necessidades.
          </p>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Painéis</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm">
              Personalizar colunas usadas
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Card 1 */}
            <div 
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 relative"
              onClick={() => handleViewAnalysis('units-sold')}
            >
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Units Sold Análise</h4>
              <p className="text-sm text-gray-600 mb-3">Análise completa em...</p>
              <div className="w-full h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <div className="text-xs text-gray-500">Preview do gráfico</div>
              </div>
              <p className="text-sm text-blue-600">Clique para visualizar</p>
            </div>

            {/* Card 2 */}
            <div 
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 relative"
              onClick={() => handleViewAnalysis('retailer-id')}
            >
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Retailer ID Análise</h4>
              <p className="text-sm text-gray-600 mb-3">Análise completa em...</p>
              <div className="w-full h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <div className="text-xs text-gray-500">Preview do gráfico</div>
              </div>
              <p className="text-sm text-blue-600">Clique para visualizar</p>
            </div>

            {/* Card 3 */}
            <div 
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 relative"
              onClick={() => handleViewAnalysis('operating-margin')}
            >
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Operating Margin A...</h4>
              <p className="text-sm text-gray-600 mb-3">Análise completa em...</p>
              <div className="w-full h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <div className="text-xs text-gray-500">Preview do gráfico</div>
              </div>
              <p className="text-sm text-blue-600">Clique para visualizar</p>
            </div>

            {/* Card 4 */}
            <div 
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 relative"
              onClick={() => handleViewAnalysis('operating-profit')}
            >
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Operating Profit An...</h4>
              <p className="text-sm text-gray-600 mb-3">Análise completa em...</p>
              <div className="w-full h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <div className="text-xs text-gray-500">Preview do gráfico</div>
              </div>
              <p className="text-sm text-blue-600">Clique para visualizar</p>
            </div>

            {/* Card 5 */}
            <div 
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 relative"
              onClick={() => handleViewAnalysis('comparison')}
            >
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Units Sold x Operati...</h4>
              <p className="text-sm text-gray-600 mb-3">Comparação entre U...</p>
              <div className="w-full h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <div className="text-xs text-gray-500">Preview do gráfico</div>
              </div>
              <p className="text-sm text-blue-600">Clique para visualizar</p>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Salvar Painel
            </button>
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

      {/* Analysis View Overlay */}
      {showAnalysisView && activeAnalysis && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          {/* Analysis Header */}
          <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToData}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {activeAnalysis === 'units-sold' && generateUnitsSoldAnalysis().title}
                    {activeAnalysis === 'retailer-id' && generateRetailerIDAnalysis().title}
                    {activeAnalysis === 'operating-margin' && generateOperatingMarginAnalysis().title}
                    {activeAnalysis === 'operating-profit' && generateOperatingProfitAnalysis().title}
                    {activeAnalysis === 'comparison' && generateComparisonAnalysis().title}
                  </h1>
                  <p className="text-gray-600">
                    {activeAnalysis === 'units-sold' && generateUnitsSoldAnalysis().description}
                    {activeAnalysis === 'retailer-id' && generateRetailerIDAnalysis().description}
                    {activeAnalysis === 'operating-margin' && generateOperatingMarginAnalysis().description}
                    {activeAnalysis === 'operating-profit' && generateOperatingProfitAnalysis().description}
                    {activeAnalysis === 'comparison' && generateComparisonAnalysis().description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Exportar
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Compartilhar
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Content */}
          <div className="p-6">
            {activeAnalysis === 'units-sold' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Painel do Units Sold Análise</h2>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* KPIs - Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Total de Units Sold no Dec 2021 */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-green-600">Total de Units Sold no Dec 2021</h3>
                        <p className="text-2xl font-bold text-green-900">171K</p>
                        <p className="text-xs text-green-600">Nov 2021: 149K</p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* % da diferença do mês anterior */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-blue-600">% da diferença do mês anterior</h3>
                        <p className="text-2xl font-bold text-blue-900">14.7%</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Region com máx Units Sold */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-red-600">Region com máx Units Sold(West)</h3>
                        <p className="text-2xl font-bold text-red-900">687K</p>
                        <p className="text-xs text-red-600">Region por média Units Sold: 495.77K</p>
                      </div>
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Sales Method com máx Units Sold */}
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-orange-600">Sales Method com máx Units Sold(Online)</h3>
                        <p className="text-2xl font-bold text-orange-900">939K</p>
                        <p className="text-xs text-orange-600">Sales Method por média Units Sold: 826.29K</p>
                      </div>
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts - Middle Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Region referente a Units Sold por Sales Method */}
                  <ChartCard 
                    title="Region referente a Units Sold por Sales Method"
                    currentChartType={chartTypes['region-sales']}
                    onChartTypeChange={(newType) => handleChartTypeChange('region-sales', newType)}
                  >
                    <ChartComponent
                      type={chartTypes['region-sales'] as ChartType}
                      data={{
                        bars: [
                          { label: 'Midwest', value: 340000, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                          { label: 'Northeast', value: 430000, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
                          { label: 'South', value: 445000, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
                        ]
                      }}
                      options={{
                        title: 'Region referente a Units Sold por Sales Method',
                        showGrid: true,
                        showLegend: true,
                        colors: ['#667eea', '#f093fb', '#4facfe']
                      }}
                      height={300}
                      onChartClick={(data) => console.log('Clicou:', data)}
                    />
                  </ChartCard>

                  {/* Distribuição de Units Sold em intervalos diferentes */}
                  <ChartCard 
                    title="Distribuição de Units Sold em intervalos diferentes"
                    currentChartType={chartTypes['distribution']}
                    onChartTypeChange={(newType) => handleChartTypeChange('distribution', newType)}
                  >
                    <ChartComponent
                      type={chartTypes['distribution'] as ChartType}
                      data={{
                        bins: [
                          { label: '0-300', frequency: 6000, color: '#FF6B6B' },
                          { label: '300-600', frequency: 2000, color: '#4ECDC4' },
                          { label: '600-900', frequency: 1000, color: '#45B7D1' },
                          { label: '900-1.2K', frequency: 500, color: '#96CEB4' },
                          { label: '1.2K-1.5K', frequency: 200, color: '#FFEAA7' }
                        ]
                      }}
                      options={{
                        title: 'Distribuição de Units Sold em intervalos diferentes',
                        showGrid: true,
                        showLegend: true,
                        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
                      }}
                      height={300}
                      onChartClick={(data) => console.log('Clicou:', data)}
                    />
                  </ChartCard>
                </div>

                {/* Charts - Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sales Method-referente Units Sold */}
                  <ChartCard 
                    title="Sales Method-referente Units Sold"
                    currentChartType={chartTypes['sales-method']}
                    onChartTypeChange={(newType) => handleChartTypeChange('sales-method', newType)}
                  >
                    <ChartComponent
                      type={chartTypes['sales-method'] as ChartType}
                      data={{
                        bars: [
                          { label: 'In-store', value: 680000, color: '#FF6B6B' },
                          { label: 'Online', value: 850000, color: '#4ECDC4' },
                          { label: 'Outlet', value: 800000, color: '#45B7D1' }
                        ]
                      }}
                      options={{
                        title: 'Sales Method-referente Units Sold',
                        showGrid: true,
                        showLegend: true,
                        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1']
                      }}
                      height={300}
                      onChartClick={(data) => console.log('Clicou:', data)}
                    />
                  </ChartCard>

                  {/* Region-referente Units Sold */}
                  <ChartCard 
                    title="Region-referente Units Sold"
                    currentChartType={chartTypes['region-units']}
                    onChartTypeChange={(newType) => handleChartTypeChange('region-units', newType)}
                  >
                    <ChartComponent
                      type={chartTypes['region-units'] as ChartType}
                      data={{
                        bars: [
                          { label: 'Midwest', value: 380000, color: '#667eea' },
                          { label: 'Northeast', value: 500000, color: '#f093fb' },
                          { label: 'South Region', value: 500000, color: '#4facfe' },
                          { label: 'Southeast', value: 400000, color: '#43e97b' },
                          { label: 'West', value: 650000, color: '#fa709a' }
                        ]
                      }}
                      options={{
                        title: 'Region-referente Units Sold',
                        showGrid: true,
                        showLegend: true,
                        colors: ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a']
                      }}
                      height={300}
                      onChartClick={(data) => console.log('Clicou:', data)}
                    />
                  </ChartCard>
                </div>

                {/* Advanced Charts Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">Análises Avançadas</h3>
                  
                  {/* Row 1 - 2 Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Region referente a Units Sold por Sales Method */}
                    <ChartCard 
                      title="Region referente a Units Sold por Sales Method"
                      currentChartType={chartTypes['region-sales']}
                      onChartTypeChange={(newType) => handleChartTypeChange('region-sales', newType)}
                    >
                      <ChartComponent
                        type={chartTypes['region-sales'] as ChartType}
                        data={{
                          bars: [
                            { label: 'Midwest', value: 340000, color: '#667eea' },
                            { label: 'Northeast', value: 430000, color: '#f093fb' },
                            { label: 'South', value: 445000, color: '#4facfe' }
                          ]
                        }}
                        options={{
                          title: 'Region referente a Units Sold por Sales Method',
                          showGrid: true,
                          showLegend: true,
                          colors: ['#667eea', '#f093fb', '#4facfe']
                        }}
                        height={300}
                        onChartClick={(data) => console.log('Clicou:', data)}
                      />
                    </ChartCard>

                    {/* Razão de Product-referente Units Sold por Region */}
                    <ChartCard 
                      title="Razão de Product-referente Units Sold por Region"
                      currentChartType={chartTypes['product-region']}
                      onChartTypeChange={(newType) => handleChartTypeChange('product-region', newType)}
                    >
                      <ChartComponent
                        type={chartTypes['product-region'] as ChartType}
                        data={{
                          bars: [
                            { label: 'Men\'s Street Footwear', value: 250000, color: '#FF6B6B' },
                            { label: 'Women\'s Athletic Footwear', value: 300000, color: '#4ECDC4' },
                            { label: 'Men\'s Apparel', value: 200000, color: '#45B7D1' }
                          ]
                        }}
                        options={{
                          title: 'Razão de Product-referente Units Sold por Region',
                          showGrid: true,
                          showLegend: true,
                          colors: ['#FF6B6B', '#4ECDC4', '#45B7D1']
                        }}
                        height={300}
                        onChartClick={(data) => console.log('Clicou:', data)}
                      />
                    </ChartCard>
                  </div>

                  {/* Row 2 - 2 Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Distribuição de Vendas por Categoria - Gráfico de Pizza */}
                    <ChartCard 
                      title="Distribuição de Vendas por Categoria"
                      currentChartType={chartTypes['product-sales']}
                      onChartTypeChange={(newType) => handleChartTypeChange('product-sales', newType)}
                    >
                      <ChartComponent
                        type={chartTypes['product-sales'] as ChartType}
                        data={{
                          slices: [
                            { label: 'Men\'s Apparel', value: 250000 },
                            { label: 'Women\'s Athletic', value: 300000 },
                            { label: 'Men\'s Streetwear', value: 200000 },
                            { label: 'Women\'s Apparel', value: 180000 },
                            { label: 'Accessories', value: 120000 }
                          ]
                        }}
                        options={{
                          title: 'Distribuição de Vendas por Categoria',
                          showGrid: false,
                          showLegend: true,
                          colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
                        }}
                        height={300}
                        onChartClick={(data) => console.log('Clicou:', data)}
                      />
                    </ChartCard>

                    {/* Gráfico Universal - Teste de Conversão Automática */}
                    <ChartCard 
                      title="Gráfico Universal (Teste de Conversão)"
                      currentChartType={chartTypes['universal']}
                      onChartTypeChange={(newType) => handleChartTypeChange('universal', newType)}
                    >
                      <ChartComponent
                        type={chartTypes['universal'] as ChartType}
                        data={{
                          bars: [
                            { label: 'Q1', value: 95000 },
                            { label: 'Q2', value: 105000 },
                            { label: 'Q3', value: 98000 },
                            { label: 'Q4', value: 110000 }
                          ]
                        }}
                        options={{
                          title: 'Dados Universais - Funciona com qualquer tipo!',
                          showGrid: true,
                          showLegend: true,
                          colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
                        }}
                        height={300}
                        onChartClick={(data) => console.log('Clicou:', data)}
                      />
                    </ChartCard>
                  </div>

                  {/* Row 3 - 2 Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Média móvel de Units Sold sobre Meses */}
                    <ChartCard 
                      title="Média móvel de Units Sold sobre Meses"
                      currentChartType={chartTypes['moving-average']}
                      onChartTypeChange={(newType) => handleChartTypeChange('moving-average', newType)}
                    >
                      <ChartComponent
                        type={chartTypes['moving-average'] as ChartType}
                        data={{
                          points: [
                            { x: 1, y: 95000 },
                            { x: 2, y: 100000 },
                            { x: 3, y: 99000 },
                            { x: 4, y: 104000 },
                            { x: 5, y: 103000 },
                            { x: 6, y: 105000 }
                          ]
                        }}
                        options={{
                          title: 'Média móvel de Units Sold sobre Meses',
                          showGrid: true,
                          showLegend: true
                        }}
                        height={300}
                        onChartClick={(data) => console.log('Clicou:', data)}
                      />
                    </ChartCard>

                    {/* Units Sold Através de Meses por Region */}
                    <ChartCard 
                      title="Units Sold Através de Meses por Region"
                      currentChartType={chartTypes['region-time']}
                      onChartTypeChange={(newType) => handleChartTypeChange('region-time', newType)}
                    >
                      <ChartComponent
                        type={chartTypes['region-time'] as ChartType}
                        data={{
                          points: [
                            { x: 1, y: 85000 },
                            { x: 2, y: 95000 },
                            { x: 3, y: 90000 },
                            { x: 4, y: 100000 },
                            { x: 5, y: 98000 },
                            { x: 6, y: 105000 }
                          ]
                        }}
                        options={{
                          title: 'Units Sold Através de Meses por Region',
                          showGrid: true,
                          showLegend: true
                        }}
                        height={300}
                        onChartClick={(data) => console.log('Clicou:', data)}
                      />
                    </ChartCard>
                  </div>

                  {/* Row 4 - 2 Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Units Sold entre Semanas com previsão */}
                    <ChartCard 
                      title="Units Sold entre Semanas com previsão"
                      currentChartType={chartTypes['forecast']}
                      onChartTypeChange={(newType) => handleChartTypeChange('forecast', newType)}
                    >
                      <ChartComponent
                        type={chartTypes['forecast'] as ChartType}
                        data={{
                          points: weeklyForecastData.map((item, index) => ({
                            x: index,
                            y: item.units
                          }))
                        }}
                        options={{
                          title: 'Units Sold entre Semanas com previsão',
                          showGrid: true,
                          showLegend: true,
                          colors: ['#4ECDC4']
                        }}
                        height={300}
                        onChartClick={(data) => console.log('Clicou:', data)}
                      />
                    </ChartCard>

                    {/* Units Sold Trend */}
                    <ChartCard 
                      title="Units Sold Trend"
                      currentChartType={chartTypes['trend']}
                      onChartTypeChange={(newType) => handleChartTypeChange('trend', newType)}
                    >
                      <ChartComponent
                        type={chartTypes['trend'] as ChartType}
                        data={{
                          points: quarterlyTrendData.map((item, index) => ({
                            x: index,
                            y: item.units
                          }))
                        }}
                        options={{
                          title: 'Units Sold Trend',
                          showGrid: true,
                          showLegend: true,
                          colors: ['#4ECDC4']
                        }}
                        height={300}
                        onChartClick={(data) => console.log('Clicou:', data)}
                      />
                    </ChartCard>
                  </div>

                  {/* Row 5 - 2 Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product referente a Units Sold por Sales Method */}
                    <ChartCard 
                      title="Product referente a Units Sold por Sales Method"
                      currentChartType={chartTypes['product-sales']}
                      onChartTypeChange={(newType) => handleChartTypeChange('product-sales', newType)}
                    >
                      <ChartComponent
                        type={chartTypes['product-sales'] as ChartType}
                        data={{
                          bars: [
                            { label: "Men's Apparel", value: 300000 },
                            { label: "Men's Athletic", value: 450000 },
                            { label: "Men's Streetwear", value: 580000 },
                            { label: "Women's Apparel", value: 310500 },
                            { label: "Women's Athletic", value: 320000 },
                            { label: "Women's Streetwear", value: 380000 }
                          ]
                        }}
                        options={{
                          title: 'Product referente a Units Sold por Sales Method',
                          showGrid: true,
                          showLegend: true,
                          colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#667eea']
                        }}
                        height={300}
                        onChartClick={(data) => console.log('Clicou:', data)}
                      />
                    </ChartCard>

                    {/* Units Sold Através de Meses por Sales Method */}
                    <ChartCard 
                      title="Units Sold Através de Meses por Sales Method"
                      currentChartType={chartTypes['units-time']}
                      onChartTypeChange={(newType) => handleChartTypeChange('units-time', newType)}
                    >
                      <ChartComponent
                        type={chartTypes['units-time'] as ChartType}
                        data={{
                          points: unitsSoldChartData.map((item, index) => ({
                            x: index,
                            y: item.instore + item.online + item.outlet
                          }))
                        }}
                        options={{
                          title: 'Units Sold Através de Meses por Sales Method',
                          showGrid: true,
                          showLegend: true,
                          colors: ['#4ECDC4']
                        }}
                        height={300}
                        onChartClick={(data) => console.log('Clicou:', data)}
                      />
                    </ChartCard>
                  </div>

                  {/* Row 6 - 2 Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top 5 Retailer por Units Sold */}
                    <ChartCard 
                      title="Top 5 Retailer por Units Sold"
                      currentChartType={chartTypes['top-retailers']}
                      onChartTypeChange={(newType) => handleChartTypeChange('top-retailers', newType)}
                    >
                      <ChartComponent
                        type={chartTypes['top-retailers'] as ChartType}
                        data={{
                          bars: [
                            { label: 'Walmart', value: 450000 },
                            { label: 'Kohl\'s', value: 380000 },
                            { label: 'Sports Direct', value: 320000 },
                            { label: 'Foot Locker', value: 280000 },
                            { label: 'West Gear', value: 250000 }
                          ]
                        }}
                        options={{
                          title: 'Top 5 Retailer por Units Sold',
                          showGrid: true,
                          showLegend: true,
                          colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
                        }}
                        height={300}
                        onChartClick={(data) => console.log('Clicou:', data)}
                      />
                    </ChartCard>

                    {/* Invoice Date referente a Units Sold por Sales Method */}
                    <ChartCard 
                      title="Invoice Date referente a Units Sold por Sales Method"
                      currentChartType={chartTypes['invoice-date']}
                      onChartTypeChange={(newType) => handleChartTypeChange('invoice-date', newType)}
                    >
                      <ChartComponent
                        type={chartTypes['invoice-date'] as ChartType}
                        data={{
                          points: [
                            { x: 0, y: 25000 },
                            { x: 1, y: 40000 },
                            { x: 2, y: 55000 },
                            { x: 3, y: 70000 },
                            { x: 4, y: 140000 },
                            { x: 5, y: 170000 },
                            { x: 6, y: 200000 },
                            { x: 7, y: 230000 }
                          ]
                        }}
                        options={{
                          title: 'Invoice Date referente a Units Sold por Sales Method',
                          showGrid: true,
                          showLegend: true,
                          colors: ['#4ECDC4']
                        }}
                        height={300}
                        onChartClick={(data) => console.log('Clicou:', data)}
                      />
                    </ChartCard>
                  </div>

                  {/* Full Width Charts */}
                  <div className="space-y-6">
                    {/* Contribuição do Retailer e Sales Method para o Units Sold */}
                    <ChartCard
                      title="Contribuição do Retailer e Sales Method para o Units Sold"
                      currentChartType={chartTypes['sankey']}
                      onChartTypeChange={(newType) => handleChartTypeChange('sankey', newType)}
                    >
                      <div className="h-[500px] w-full flex items-center justify-center">
                        <SankeyChart data={sankeyData} />
                      </div>
                    </ChartCard>

                    {/* Distribuição de Units Sold entre Meses e Region por Sales Method */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Units Sold entre Meses e Region por Sales Method</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-4 py-2 text-left">Month&Year de Invoice</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Region</th>
                              <th className="border border-gray-300 px-4 py-2 text-center">In-store</th>
                              <th className="border border-gray-300 px-4 py-2 text-center">Online</th>
                              <th className="border border-gray-300 px-4 py-2 text-center">Outlet</th>
                              <th className="border border-gray-300 px-4 py-2 text-center">Total Units Sold</th>
                            </tr>
                          </thead>
                          <tbody>
                            {distributionTableData.map((row, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-gray-300 px-4 py-2 font-medium">{row.month}</td>
                                <td className="border border-gray-300 px-4 py-2">{row.region}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center text-red-600">{row.instore}%</td>
                                <td className="border border-gray-300 px-4 py-2 text-center text-red-600">{row.online}%</td>
                                <td className="border border-gray-300 px-4 py-2 text-center text-red-600">{row.outlet}%</td>
                                <td className="border border-gray-300 px-4 py-2 text-center font-bold">{row.total}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-center">
                  <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    Fechar
                  </button>
                </div>
              </div>
            )}

            {activeAnalysis === 'retailer-id' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600">Total de Regiões</h3>
                    <p className="text-2xl font-bold text-blue-900">{generateRetailerIDAnalysis().totalRegions}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600">Total de Varejistas</h3>
                    <p className="text-2xl font-bold text-green-900">{generateRetailerIDAnalysis().totalRetailers}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-600">Região Mais Ativa</h3>
                    <p className="text-2xl font-bold text-purple-900">{generateRetailerIDAnalysis().chartData[0]?.name}</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Região</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generateRetailerIDAnalysis().chartData.map((item) => (
                      <div key={item.name} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">{item.name}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Unidades Vendidas:</span>
                            <span className="font-medium">{formatNumber(item.units)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Vendas Totais:</span>
                            <span className="font-medium">{formatCurrency(item.sales)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Varejistas:</span>
                            <span className="font-medium">{item.retailers}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeAnalysis === 'operating-margin' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600">Margem Média</h3>
                    <p className="text-2xl font-bold text-blue-900">{generateOperatingMarginAnalysis().averageMargin}%</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600">Margem Máxima</h3>
                    <p className="text-2xl font-bold text-green-900">{generateOperatingMarginAnalysis().maxMargin}%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-600">Margem Mínima</h3>
                    <p className="text-2xl font-bold text-purple-900">{generateOperatingMarginAnalysis().minMargin}%</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição das Margens Operacionais</h3>
                  <div className="space-y-3">
                    {generateOperatingMarginAnalysis().chartData.map((item) => (
                      <div key={item.name} className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">{item.value} registros</span>
                            <span className="text-sm text-gray-600">{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-green-600 h-3 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeAnalysis === 'operating-profit' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600">Lucro Total</h3>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(generateOperatingProfitAnalysis().totalProfit)}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600">Lucro Médio</h3>
                    <p className="text-2xl font-bold text-green-900">{formatCurrency(generateOperatingProfitAnalysis().averageProfit)}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-600">Top Lucrativo</h3>
                    <p className="text-2xl font-bold text-purple-900">{generateOperatingProfitAnalysis().chartData[0]?.name}</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 8 Varejistas por Lucro Operacional</h3>
                  <div className="space-y-3">
                    {generateOperatingProfitAnalysis().chartData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-sm text-gray-600">{item.formatted}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(item.value / generateOperatingProfitAnalysis().chartData[0].value) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeAnalysis === 'comparison' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600">Correlação</h3>
                    <p className="text-2xl font-bold text-blue-900">{generateComparisonAnalysis().correlation}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600">Insight</h3>
                    <p className="text-sm font-bold text-green-900">{generateComparisonAnalysis().insight}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-600">Mais Eficiente</h3>
                    <p className="text-2xl font-bold text-purple-900">{generateComparisonAnalysis().chartData[0]?.name}</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparação: Volume vs Lucratividade</h3>
                  <div className="space-y-4">
                    {generateComparisonAnalysis().chartData.map((item, index) => (
                      <div key={item.name} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Unidades</p>
                            <p className="font-semibold text-gray-900">{formatNumber(item.units)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Lucro</p>
                            <p className="font-semibold text-gray-900">{formatCurrency(item.profit)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Eficiência</p>
                            <p className="font-semibold text-gray-900">${item.efficiency}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 1: Gerar relatórios automaticamente */}
      {showAutoReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Gerar relatórios automaticamente</h2>
              <button onClick={() => setShowAutoReportModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 mb-4">
                  O Zoho Analytics pode analisar seus dados, gerar relatórios instantaneamente e fornecer sugestões para painéis. Além disso, você tem a opção de criar seu próprio painel preferido.
                </p>
                <p className="font-medium text-gray-900 mb-4">Gostaria de prosseguir?</p>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Não mostrar este diálogo novamente</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowAutoReportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-blue-600 rounded-lg hover:bg-gray-50"
              >
                Não
              </button>
              <button
                onClick={handleAutoReportYes}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Sugestões com progresso */}
      {showSuggestionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">Sugestões</h2>
              </div>
              <button onClick={() => setShowSuggestionsModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Os painéis/relatórios gerados automaticamente estão listados abaixo. Você pode visualizá-los e escolhê-los ou personalizá-los com base em suas necessidades.
            </p>
            
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-4">Geração automática de painéis</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-900">6 métricas e 7 dimensões identificadas!</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Selecionando automaticamente algumas colunas...</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  <span className="text-sm text-gray-400">Criando seus relatórios...</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  <span className="text-sm text-gray-400">Criando seus painéis...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 