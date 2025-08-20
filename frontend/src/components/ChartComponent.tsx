"use client";

import React, { useEffect, useRef, useState } from 'react';

// Tipos de gráficos mais utilizados para análises
type ChartType = 
  | 'bar'           // Gráfico de barras - comparação entre categorias
  | 'line'          // Gráfico de linha - tendências temporais
  | 'pie'           // Gráfico de pizza - proporções
  | 'scatter'       // Gráfico de dispersão - correlações
  | 'histogram'     // Histograma - distribuição de dados
  | 'area'          // Gráfico de área - volume ao longo do tempo
  | 'column'        // Gráfico de colunas - dados categóricos
  | 'heatmap';      // Mapa de calor - correlações múltiplas

interface ChartComponentProps {
  type: ChartType;
  data: any;
  options?: {
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
    responsive?: boolean;
  };
  height?: number;
  width?: number | string;
  onChartClick?: (data: any) => void;
}

export default function ChartComponent({ 
  type, 
  data, 
  options = {}, 
  height = 400, 
  width = 800,
  onChartClick
}: ChartComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<any>(null);

  // Paleta de cores moderna e sofisticada
  const defaultColors = [
    '#667eea', // Azul moderno
    '#f093fb', // Rosa vibrante
    '#4facfe', // Azul claro
    '#43e97b', // Verde esmeralda
    '#fa709a', // Rosa coral
    '#ffecd2', // Dourado suave
    '#fcb69f', // Laranja coral
    '#a8edea', // Turquesa
    '#fed6e3', // Rosa claro
    '#ffecd2'  // Bege dourado
  ];

  const config = {
    backgroundColor: '#ffffff',
    textColor: '#374151',
    gridColor: '#E5E7EB',
    colors: options.colors || defaultColors,
    showLegend: options.showLegend !== false,
    showGrid: options.showGrid !== false,
    responsive: options.responsive !== false,
    ...options
  };

  // Função para converter dados para qualquer formato
  const convertDataForChartType = (originalData: any, targetType: string) => {
    console.log('convertDataForChartType chamado:', { originalData, targetType });
    const convertedData = { ...originalData };
    
    switch (targetType) {
      case 'bar':
      case 'column':
        if (!convertedData.bars) {
          if (convertedData.points) {
            // Converter pontos para barras
            convertedData.bars = convertedData.points.map((point: any, index: number) => ({
              label: `Item ${index + 1}`,
              value: point.y || 0
            }));
          } else if (convertedData.slices) {
            // Converter fatias para barras
            convertedData.bars = convertedData.slices.map((slice: any) => ({
              label: slice.label || 'Slice',
              value: slice.value || 0
            }));
          } else if (convertedData.bins) {
            // Converter bins para barras
            convertedData.bars = convertedData.bins.map((bin: any) => ({
              label: bin.label || 'Bin',
              value: bin.frequency || 0
            }));
          } else if (convertedData.matrix) {
            // Converter matriz para barras (soma das linhas)
            convertedData.bars = convertedData.matrix.map((row: any, index: number) => ({
              label: `Row ${index + 1}`,
              value: row.reduce((sum: number, val: number) => sum + (val || 0), 0)
            }));
          }
        }
        break;
        
      case 'line':
      case 'area':
        if (!convertedData.points) {
          if (convertedData.bars) {
            // Converter barras para pontos
            convertedData.points = convertedData.bars.map((bar: any, index: number) => ({
              x: index,
              y: bar.value || 0
            }));
          } else if (convertedData.slices) {
            // Converter fatias para pontos
            convertedData.points = convertedData.slices.map((slice: any, index: number) => ({
              x: index,
              y: slice.value || 0
            }));
          } else if (convertedData.bins) {
            // Converter bins para pontos
            convertedData.points = convertedData.bins.map((bin: any, index: number) => ({
              x: index,
              y: bin.frequency || 0
            }));
          } else if (convertedData.matrix) {
            // Converter matriz para pontos (média das linhas)
            convertedData.points = convertedData.matrix.map((row: any, index: number) => ({
              x: index,
              y: row.reduce((sum: number, val: number) => sum + (val || 0), 0) / row.length
            }));
          }
        }
        break;
        
      case 'pie':
        if (!convertedData.slices) {
          if (convertedData.bars) {
            // Converter barras para fatias
            convertedData.slices = convertedData.bars.map((bar: any) => ({
              label: bar.label || 'Bar',
              value: bar.value || 0
            }));
          } else if (convertedData.points) {
            // Converter pontos para fatias
            convertedData.slices = convertedData.points.map((point: any, index: number) => ({
              label: `Point ${index + 1}`,
              value: point.y || 0
            }));
          } else if (convertedData.bins) {
            // Converter bins para fatias
            convertedData.slices = convertedData.bins.map((bin: any) => ({
              label: bin.label || 'Bin',
              value: bin.frequency || 0
            }));
          } else if (convertedData.matrix) {
            // Converter matriz para fatias (soma total)
            const total = convertedData.matrix.reduce((sum: number, row: any) => 
              sum + row.reduce((rowSum: number, val: number) => rowSum + (val || 0), 0), 0
            );
            convertedData.slices = convertedData.matrix.map((row: any, index: number) => ({
              label: `Row ${index + 1}`,
              value: row.reduce((sum: number, val: number) => sum + (val || 0), 0)
            }));
          }
        }
        break;
        
      case 'scatter':
        if (!convertedData.points) {
          if (convertedData.bars) {
            // Converter barras para pontos de dispersão
            convertedData.points = convertedData.bars.map((bar: any, index: number) => ({
              x: index,
              y: bar.value || 0
            }));
          } else if (convertedData.slices) {
            // Converter fatias para pontos de dispersão
            convertedData.points = convertedData.slices.map((slice: any, index: number) => ({
              x: index,
              y: slice.value || 0
            }));
          } else if (convertedData.bins) {
            // Converter bins para pontos de dispersão
            convertedData.points = convertedData.bins.map((bin: any, index: number) => ({
              x: index,
              y: bin.frequency || 0
            }));
          } else if (convertedData.matrix) {
            // Converter matriz para pontos de dispersão
            convertedData.points = convertedData.matrix.flatMap((row: any, rowIndex: number) =>
              row.map((val: number, colIndex: number) => ({
                x: colIndex,
                y: val || 0
              }))
            );
          }
        }
        break;
        
      case 'histogram':
        if (!convertedData.bins) {
          if (convertedData.bars) {
            // Converter barras para bins
            convertedData.bins = convertedData.bars.map((bar: any) => ({
              label: bar.label || 'Bin',
              frequency: bar.value || 0
            }));
          } else if (convertedData.points) {
            // Converter pontos para bins (agrupar por faixas)
            const values = convertedData.points.map((p: any) => p.y || 0);
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = max - min;
            const binCount = Math.min(10, values.length);
            const binSize = range / binCount;
            
            const bins = Array(binCount).fill(0).map((_, i) => ({
              label: `${(min + i * binSize).toFixed(0)}-${(min + (i + 1) * binSize).toFixed(0)}`,
              frequency: 0
            }));
            
            values.forEach((value: number) => {
              const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
              bins[binIndex].frequency++;
            });
            
            convertedData.bins = bins;
          } else if (convertedData.slices) {
            // Converter fatias para bins
            convertedData.bins = convertedData.slices.map((slice: any) => ({
              label: slice.label || 'Bin',
              frequency: slice.value || 0
            }));
          } else if (convertedData.matrix) {
            // Converter matriz para bins (valores únicos)
            const values = convertedData.matrix.flat();
            const uniqueValues = [...new Set(values)];
            convertedData.bins = uniqueValues.map((value: any) => ({
              label: value.toString(),
              frequency: values.filter((v: any) => v === value).length
            }));
          }
        }
        break;
        
      case 'heatmap':
        if (!convertedData.matrix) {
          if (convertedData.bars) {
            // Converter barras para matriz 1D
            convertedData.matrix = [convertedData.bars.map((bar: any) => bar.value || 0)];
          } else if (convertedData.points) {
            // Converter pontos para matriz 1D
            convertedData.matrix = [convertedData.points.map((point: any) => point.y || 0)];
          } else if (convertedData.slices) {
            // Converter fatias para matriz 1D
            convertedData.matrix = [convertedData.slices.map((slice: any) => slice.value || 0)];
          } else if (convertedData.bins) {
            // Converter bins para matriz 1D
            convertedData.matrix = [convertedData.bins.map((bin: any) => bin.frequency || 0)];
          }
        }
        break;
    }
    
    console.log('Dados convertidos:', convertedData);
    return convertedData;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas para alta resolução
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Converter dados para o tipo de gráfico solicitado
    const convertedData = convertDataForChartType(data, type);

    // Desenhar gráfico baseado no tipo
    switch (type) {
      case 'bar':
        drawBarChart(ctx, convertedData, config);
        break;
      case 'line':
        drawLineChart(ctx, convertedData, config);
        break;
      case 'pie':
        drawPieChart(ctx, convertedData, config);
        break;
      case 'scatter':
        drawScatterPlot(ctx, convertedData, config);
        break;
      case 'histogram':
        drawHistogram(ctx, convertedData, config);
        break;
      case 'area':
        drawAreaChart(ctx, convertedData, config);
        break;
      case 'column':
        drawColumnChart(ctx, convertedData, config);
        break;
      case 'heatmap':
        drawHeatmap(ctx, convertedData, config);
        break;
      default:
        drawPlaceholder(ctx, config);
    }
  }, [type, data, options, height, width]);

  const drawBarChart = (ctx: CanvasRenderingContext2D, data: any, config: any) => {
    console.log('drawBarChart chamado com dados:', data);
    const { width, height } = ctx.canvas;
    const padding = 80;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Desenhar grade
    if (config.showGrid) {
      drawGrid(ctx, width, height, padding, config.gridColor);
    }

    // Desenhar eixos
    drawAxes(ctx, width, height, padding, config.textColor);

    // Desenhar título
    if (config.title) {
      drawTitle(ctx, config.title, width, padding, config.textColor);
    }

    // Desenhar barras
    if (data.bars && data.bars.length > 0) {
      console.log('Dados de barras encontrados:', data.bars);
      // Validar e limpar dados
      const validBars = data.bars.filter((bar: any) => 
        bar && typeof bar.value === 'number' && !isNaN(bar.value)
      );
      
      console.log('Barras válidas:', validBars);
      
      if (validBars.length === 0) {
        console.log('Nenhuma barra válida encontrada');
        // Desenhar mensagem de erro se não houver dados válidos
        ctx.fillStyle = config.textColor;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Nenhum dado válido encontrado', width / 2, height / 2);
        return;
      }
              const barWidth = chartWidth / validBars.length * 0.8;
        const maxValue = Math.max(...validBars.map((bar: any) => bar.value));

        validBars.forEach((bar: any, index: number) => {
        const x = padding + (index * chartWidth / validBars.length) + (chartWidth / validBars.length * 0.1);
        const barValue = bar.value || 0;
        const barHeight = (barValue / maxValue) * chartHeight;
        const y = height - padding - barHeight;

        // Criar gradiente sofisticado para a barra
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        const baseColor = config.colors[index % config.colors.length];
        
        // Converter cor hex para RGB para criar gradiente
        const hex = baseColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Gradiente mais sofisticado com múltiplas paradas
        gradient.addColorStop(0, `rgba(${r + 20}, ${g + 20}, ${b + 20}, 0.95)`);
        gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.9)`);
        gradient.addColorStop(0.7, `rgba(${r - 10}, ${g - 10}, ${b - 10}, 0.8)`);
        gradient.addColorStop(1, `rgba(${r - 20}, ${g - 20}, ${b - 20}, 0.7)`);

        // Adicionar sombra sofisticada
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 4;

        // Desenhar barra com gradiente
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Resetar sombra
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Adicionar borda com gradiente
        const borderGradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        borderGradient.addColorStop(0, `rgba(${r + 20}, ${g + 20}, ${b + 20}, 0.8)`);
        borderGradient.addColorStop(1, `rgba(${r - 20}, ${g - 20}, ${b - 20}, 0.6)`);
        
        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);

        // Adicionar valor no topo com design moderno
        const valueText = bar.value !== null && bar.value !== undefined ? bar.value.toLocaleString() : '0';
        const textWidth = ctx.measureText(valueText).width;
        
        // Fundo arredondado para o valor
        const bgWidth = textWidth + 16;
        const bgHeight = 24;
        const bgX = x + barWidth / 2 - bgWidth / 2;
        const bgY = y - 30;
        
        // Sombra do fundo
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        
        // Fundo com gradiente
        const valueBgGradient = ctx.createLinearGradient(bgX, bgY, bgX, bgY + bgHeight);
        valueBgGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        valueBgGradient.addColorStop(1, 'rgba(248, 250, 252, 0.95)');
        
        ctx.fillStyle = valueBgGradient;
        ctx.beginPath();
        ctx.roundRect(bgX, bgY, bgWidth, bgHeight, 6);
        ctx.fill();
        
        // Borda sutil
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Texto do valor
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(valueText, x + barWidth / 2, y - 15);

        // Adicionar label moderno
        if (bar.label) {
          ctx.fillStyle = '#475569';
          ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(bar.label, x + barWidth / 2, height - padding + 25);
        }
      });
    }
  };

  const drawLineChart = (ctx: CanvasRenderingContext2D, data: any, config: any) => {
    const { width, height } = ctx.canvas;
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Desenhar grade
    if (config.showGrid) {
      drawGrid(ctx, width, height, padding, config.gridColor);
    }

    // Desenhar eixos
    drawAxes(ctx, width, height, padding, config.textColor);

    // Desenhar título
    if (config.title) {
      drawTitle(ctx, config.title, width, padding, config.textColor);
    }

    // Desenhar linha de dados
    if (data.points && data.points.length > 0) {
      // Validar e limpar dados
      const validPoints = data.points.filter((point: any) => 
        point && typeof point.y === 'number' && !isNaN(point.y)
      );
      
      if (validPoints.length === 0) {
        // Desenhar mensagem de erro se não houver dados válidos
        ctx.fillStyle = config.textColor;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Nenhum dado válido encontrado', width / 2, height / 2);
        return;
      }
      
      const maxY = Math.max(...validPoints.map((p: any) => p.y));
      const minY = Math.min(...validPoints.map((p: any) => p.y));
      const rangeY = maxY - minY || 1;

      // Gradiente para a linha
      const lineGradient = ctx.createLinearGradient(padding, height - padding, width - padding, padding);
      lineGradient.addColorStop(0, config.colors[0]);
      lineGradient.addColorStop(1, config.colors[1] || config.colors[0]);
      
      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      
      validPoints.forEach((point: any, index: number) => {
        const x = padding + (index / (validPoints.length - 1)) * chartWidth;
        const y = height - padding - ((point.y - minY) / rangeY) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();

      // Desenhar pontos
      validPoints.forEach((point: any, index: number) => {
        const x = padding + (index / (validPoints.length - 1)) * chartWidth;
        const y = height - padding - ((point.y - minY) / rangeY) * chartHeight;

        // Gradiente para os pontos
        const pointGradient = ctx.createRadialGradient(x, y, 0, x, y, 6);
        pointGradient.addColorStop(0, config.colors[0]);
        pointGradient.addColorStop(1, config.colors[1] || config.colors[0]);
        
        ctx.fillStyle = pointGradient;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Borda dos pontos
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Adicionar valor
        ctx.fillStyle = config.textColor;
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        const value = point.y !== null && point.y !== undefined ? point.y.toString() : '0';
        ctx.fillText(value, x, y - 10);
      });
    }
  };

  const drawModernGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, padding: number) => {
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    
    // Linhas horizontais
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Linhas verticais
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i * (width - 2 * padding)) / 5;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }
  };

  const drawModernAxes = (ctx: CanvasRenderingContext2D, width: number, height: number, padding: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    // Eixo Y com gradiente
    const yAxisGradient = ctx.createLinearGradient(padding, padding, padding, height - padding);
    yAxisGradient.addColorStop(0, 'rgba(148, 163, 184, 0.8)');
    yAxisGradient.addColorStop(1, 'rgba(148, 163, 184, 0.4)');
    ctx.strokeStyle = yAxisGradient;
    
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Eixo X com gradiente
    const xAxisGradient = ctx.createLinearGradient(padding, height - padding, width - padding, height - padding);
    xAxisGradient.addColorStop(0, 'rgba(148, 163, 184, 0.4)');
    xAxisGradient.addColorStop(1, 'rgba(148, 163, 184, 0.8)');
    ctx.strokeStyle = xAxisGradient;
    
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
  };

  const drawModernTitle = (ctx: CanvasRenderingContext2D, title: string, width: number, padding: number, color: string) => {
    // Fundo do título
    const titleGradient = ctx.createLinearGradient(0, 0, width, 0);
    titleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    titleGradient.addColorStop(1, 'rgba(248, 250, 252, 0.9)');
    
    ctx.fillStyle = titleGradient;
    ctx.fillRect(0, 0, width, padding);
    
    // Título com gradiente
    const textGradient = ctx.createLinearGradient(0, 0, width, 0);
    textGradient.addColorStop(0, '#1e293b');
    textGradient.addColorStop(1, '#475569');
    
    ctx.fillStyle = textGradient;
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, padding - 15);
  };

  const drawPlaceholder = (ctx: CanvasRenderingContext2D, config: any) => {
    const { width, height } = ctx.canvas;
    
    // Desenhar fundo gradiente
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Desenhar ícone
    ctx.fillStyle = '#94a3b8';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📊', width / 2, height / 2 - 30);
    
    // Desenhar mensagem
    ctx.fillStyle = config.textColor;
    ctx.font = '16px Arial';
    ctx.fillText('Nenhum dado disponível', width / 2, height / 2 + 10);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Selecione dados válidos para visualizar o gráfico', width / 2, height / 2 + 30);
  };

  const drawPieChart = (ctx: CanvasRenderingContext2D, data: any, config: any) => {
    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    // Desenhar título
    if (config.title) {
      drawTitle(ctx, config.title, width, 30, config.textColor);
    }

    if (data.slices && data.slices.length > 0) {
      // Validar e limpar dados
      const validSlices = data.slices.filter((slice: any) => 
        slice && typeof slice.value === 'number' && !isNaN(slice.value) && slice.value > 0
      );
      
      if (validSlices.length === 0) {
        // Desenhar mensagem de erro se não houver dados válidos
        ctx.fillStyle = config.textColor;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Nenhum dado válido encontrado', width / 2, height / 2);
        return;
      }
      
      const total = validSlices.reduce((sum: number, slice: any) => sum + slice.value, 0);
      let currentAngle = 0;

      // Adicionar sombra para o gráfico inteiro
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      data.slices.forEach((slice: any, index: number) => {
        const sliceAngle = (slice.value / total) * 2 * Math.PI;
        
        // Criar gradiente sofisticado para cada fatia
        const gradient = ctx.createRadialGradient(
          centerX + Math.cos(currentAngle + sliceAngle / 2) * radius * 0.2,
          centerY + Math.sin(currentAngle + sliceAngle / 2) * radius * 0.2,
          0,
          centerX,
          centerY,
          radius
        );
        
        const baseColor = config.colors[index % config.colors.length];
        const hex = baseColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        gradient.addColorStop(0, `rgba(${r + 40}, ${g + 40}, ${b + 40}, 0.95)`);
        gradient.addColorStop(0.4, `rgba(${r + 20}, ${g + 20}, ${b + 20}, 0.9)`);
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.85)`);
        gradient.addColorStop(1, `rgba(${r - 30}, ${g - 30}, ${b - 30}, 0.7)`);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Adicionar borda com gradiente
        const borderGradient = ctx.createLinearGradient(
          centerX + Math.cos(currentAngle) * radius,
          centerY + Math.sin(currentAngle) * radius,
          centerX + Math.cos(currentAngle + sliceAngle) * radius,
          centerY + Math.sin(currentAngle + sliceAngle) * radius
        );
        borderGradient.addColorStop(0, `rgba(${r + 40}, ${g + 40}, ${b + 40}, 0.8)`);
        borderGradient.addColorStop(1, `rgba(${r - 40}, ${g - 40}, ${b - 40}, 0.6)`);
        
        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        currentAngle += sliceAngle;
      });

      // Resetar sombra
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Adicionar labels e valores
      currentAngle = 0;
      data.slices.forEach((slice: any, index: number) => {
        const sliceAngle = (slice.value / total) * 2 * Math.PI;
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = radius + 30;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
        
        // Fundo moderno para o label
        const labelText = slice.label || `Slice ${index + 1}`;
        const percentage = ((slice.value / total) * 100).toFixed(1);
        const valueText = slice.value.toLocaleString();
        
        ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        const labelWidth = ctx.measureText(labelText).width;
        const valueWidth = ctx.measureText(valueText).width;
        const percentageWidth = ctx.measureText(`${percentage}%`).width;
        const maxWidth = Math.max(labelWidth, valueWidth, percentageWidth);
        
        // Desenhar fundo moderno do label
        const bgWidth = maxWidth + 20;
        const bgHeight = 60;
        const bgX = labelX - bgWidth / 2;
        const bgY = labelY - 30;
        
        // Sombra do fundo
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        
        // Fundo com gradiente
        const labelBgGradient = ctx.createLinearGradient(bgX, bgY, bgX, bgY + bgHeight);
        labelBgGradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        labelBgGradient.addColorStop(1, 'rgba(248, 250, 252, 0.98)');
        
        ctx.fillStyle = labelBgGradient;
        ctx.beginPath();
        ctx.roundRect(bgX, bgY, bgWidth, bgHeight, 8);
        ctx.fill();
        
        // Borda sutil
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Desenhar texto moderno
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(labelText, labelX, labelY - 10);
        
        ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(valueText, labelX, labelY + 8);
        
        ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = config.colors[index % config.colors.length];
        ctx.fillText(`${percentage}%`, labelX, labelY + 25);
        
        currentAngle += sliceAngle;
      });
    }
  };

  const drawScatterPlot = (ctx: CanvasRenderingContext2D, data: any, config: any) => {
    const { width, height } = ctx.canvas;
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Desenhar grade
    if (config.showGrid) {
      drawGrid(ctx, width, height, padding, config.gridColor);
    }

    // Desenhar eixos
    drawAxes(ctx, width, height, padding, config.textColor);

    // Desenhar título
    if (config.title) {
      drawTitle(ctx, config.title, width, padding, config.textColor);
    }

    // Desenhar pontos
    if (data.points && data.points.length > 0) {
      const maxX = Math.max(...data.points.map((point: any) => point.x));
      const maxY = Math.max(...data.points.map((point: any) => point.y));
      const minX = Math.min(...data.points.map((point: any) => point.x));
      const minY = Math.min(...data.points.map((point: any) => point.y));
      const rangeX = maxX - minX || 1;
      const rangeY = maxY - minY || 1;

      data.points.forEach((point: any, index: number) => {
        const x = padding + ((point.x - minX) / rangeX) * chartWidth;
        const y = height - padding - ((point.y - minY) / rangeY) * chartHeight;

        ctx.fillStyle = config.colors[index % config.colors.length];
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Adicionar borda
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }
  };

  const drawHistogram = (ctx: CanvasRenderingContext2D, data: any, config: any) => {
    const { width, height } = ctx.canvas;
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Desenhar grade
    if (config.showGrid) {
      drawGrid(ctx, width, height, padding, config.gridColor);
    }

    // Desenhar eixos
    drawAxes(ctx, width, height, padding, config.textColor);

    // Desenhar título
    if (config.title) {
      drawTitle(ctx, config.title, width, padding, config.textColor);
    }

    // Desenhar histograma
    if (data.bins && data.bins.length > 0) {
      const binWidth = chartWidth / data.bins.length;
      const maxFrequency = Math.max(...data.bins.map((bin: any) => bin.frequency));

      data.bins.forEach((bin: any, index: number) => {
        const x = padding + index * binWidth;
        const barHeight = (bin.frequency / maxFrequency) * chartHeight;
        const y = height - padding - barHeight;

        ctx.fillStyle = config.colors[0];
        ctx.fillRect(x, y, binWidth * 0.9, barHeight);

        // Adicionar borda
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, binWidth * 0.9, barHeight);

        // Adicionar label
        if (bin.label) {
          ctx.fillStyle = config.textColor;
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(bin.label, x + binWidth / 2, height - padding + 15);
        }
      });
    }
  };

  const drawAreaChart = (ctx: CanvasRenderingContext2D, data: any, config: any) => {
    const { width, height } = ctx.canvas;
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Desenhar grade
    if (config.showGrid) {
      drawGrid(ctx, width, height, padding, config.gridColor);
    }

    // Desenhar eixos
    drawAxes(ctx, width, height, padding, config.textColor);

    // Desenhar título
    if (config.title) {
      drawTitle(ctx, config.title, width, padding, config.textColor);
    }

    // Desenhar área
    if (data.points && data.points.length > 0) {
      const maxY = Math.max(...data.points.map((p: any) => p.y));
      const minY = Math.min(...data.points.map((p: any) => p.y));
      const rangeY = maxY - minY || 1;

      // Criar gradiente
      const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
      gradient.addColorStop(0, config.colors[0] + '80'); // 50% opacity
      gradient.addColorStop(1, config.colors[0] + '20'); // 10% opacity

      ctx.fillStyle = gradient;
      ctx.beginPath();
      
      // Desenhar área
      data.points.forEach((point: any, index: number) => {
        const x = padding + (index / (data.points.length - 1)) * chartWidth;
        const y = height - padding - ((point.y - minY) / rangeY) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      // Completar o caminho para formar área
      ctx.lineTo(padding + chartWidth, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();
      ctx.fill();

      // Desenhar linha
      ctx.strokeStyle = config.colors[0];
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      data.points.forEach((point: any, index: number) => {
        const x = padding + (index / (data.points.length - 1)) * chartWidth;
        const y = height - padding - ((point.y - minY) / rangeY) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    }
  };

  const drawColumnChart = (ctx: CanvasRenderingContext2D, data: any, config: any) => {
    // Similar ao bar chart, mas com orientação vertical
    drawBarChart(ctx, data, config);
  };

  const drawHeatmap = (ctx: CanvasRenderingContext2D, data: any, config: any) => {
    const { width, height } = ctx.canvas;
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Desenhar título
    if (config.title) {
      drawTitle(ctx, config.title, width, padding, config.textColor);
    }

    if (data.matrix && data.matrix.length > 0) {
      const rows = data.matrix.length;
      const cols = data.matrix[0].length;
      const cellWidth = chartWidth / cols;
      const cellHeight = chartHeight / rows;

      const maxValue = Math.max(...data.matrix.flat());
      const minValue = Math.min(...data.matrix.flat());

      data.matrix.forEach((row: number[], rowIndex: number) => {
        row.forEach((value: number, colIndex: number) => {
          const x = padding + colIndex * cellWidth;
          const y = padding + rowIndex * cellHeight;
          
          // Calcular cor baseada no valor
          const normalizedValue = (value - minValue) / (maxValue - minValue);
          const intensity = Math.floor(normalizedValue * 255);
          const color = `rgb(${intensity}, ${100 + intensity}, ${255 - intensity})`;
          
          ctx.fillStyle = color;
          ctx.fillRect(x, y, cellWidth, cellHeight);

          // Adicionar borda
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellWidth, cellHeight);

          // Adicionar valor
          ctx.fillStyle = normalizedValue > 0.5 ? '#ffffff' : '#000000';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(value.toFixed(2), x + cellWidth / 2, y + cellHeight / 2 + 3);
        });
      });
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, padding: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    
    // Linhas horizontais
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Linhas verticais
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i * (width - 2 * padding)) / 5;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }
  };

  const drawAxes = (ctx: CanvasRenderingContext2D, width: number, height: number, padding: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    // Eixo Y
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Eixo X
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
  };

  const drawTitle = (ctx: CanvasRenderingContext2D, title: string, width: number, padding: number, color: string) => {
    ctx.fillStyle = color;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, padding - 10);
  };



  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onChartClick) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Aqui você pode implementar lógica para detectar cliques em elementos específicos
    onChartClick({ x, y, type, data });
  };

  return (
    <div className="chart-container relative">
      <canvas
        ref={canvasRef}
        width={typeof width === 'number' ? width : 800}
        height={height}
        style={{
          width: typeof width === 'string' ? width : `${width}px`,
          height: `${height}px`,
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          cursor: onChartClick ? 'pointer' : 'default'
        }}
        onClick={handleCanvasClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredElement(null);
        }}
      />
      
      {/* Tooltip */}
      {isHovered && hoveredElement && (
        <div 
          className="absolute bg-gray-900 text-white px-2 py-1 rounded text-sm pointer-events-none z-10"
          style={{
            left: hoveredElement.x + 10,
            top: hoveredElement.y - 30
          }}
        >
          {hoveredElement.label}
        </div>
      )}
    </div>
  );
} 