'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface SankeyData {
  from: string;
  to: string;
  value: number;
}

interface SankeyChartProps {
  data: SankeyData[];
  width?: number;
  height?: number;
}

export default function SankeyChart({ data, width = 1600, height = 500 }: SankeyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 1600, height: 500 });

  // Atualizar dimensões quando o container mudar
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        setChartDimensions({
          width: containerWidth,
          height: containerHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const { width: chartWidth, height: chartHeight } = chartDimensions;

    // Limpar SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    // Configurar cores exatas da imagem de referência (mais suaves)
    const colorMap: { [key: string]: string } = {
      'In-store': '#87CEEB',      // Azul claro (como na imagem)
      'Online': '#98FB98',        // Verde claro
      'Outlet': '#FFB6C1',        // Rosa claro
      'Amazon': '#FF6B6B',        // Vermelho
      'Foot Locker': '#DDA0DD',   // Roxo claro
      'Kohl\'s': '#87CEEB',       // Azul claro
      'Sports Direct': '#98FB98', // Verde claro
      'Walmart': '#FFB6C1',       // Rosa claro
      'West Gear': '#DDA0DD'      // Roxo claro
    };

    // Criar SVG responsivo
    const svg = d3.select(svgRef.current)
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
      .style('max-width', '100%')
      .style('height', 'auto');

    // Separar nós por tipo
    const salesMethods = ['In-store', 'Online', 'Outlet'];
    const retailers = ['Amazon', 'Foot Locker', 'Kohl\'s', 'Sports Direct', 'Walmart', 'West Gear'];

    // Calcular totais para cada nó
    const nodeTotals: { [key: string]: number } = {};
    data.forEach(d => {
      nodeTotals[d.from] = (nodeTotals[d.from] || 0) + d.value;
      nodeTotals[d.to] = (nodeTotals[d.to] || 0) + d.value;
    });

    // Configurar posições com margens adequadas para gráfico totalmente largo
    const margin = { top: 150, right: 100, bottom: 80, left: 100 };
    const chartAreaWidth = chartWidth - margin.left - margin.right;
    const chartAreaHeight = chartHeight - margin.top - margin.bottom;

    const leftColumnX = margin.left;
    const rightColumnX = chartWidth - margin.right - 120;
    const nodeHeight = 25;
    const nodeSpacing = 15;

    // Posicionar sales methods (coluna esquerda) - totalmente largos
    const salesMethodPositions = salesMethods.map((method, index) => ({
      name: method,
      x: leftColumnX,
      y: margin.top + index * (nodeHeight + nodeSpacing),
      width: 110,
      height: nodeHeight,
      total: nodeTotals[method] || 0
    }));

    // Posicionar retailers (coluna direita) - totalmente largos
    const retailerPositions = retailers.map((retailer, index) => ({
      name: retailer,
      x: rightColumnX,
      y: margin.top + index * (nodeHeight + nodeSpacing),
      width: 120,
      height: nodeHeight,
      total: nodeTotals[retailer] || 0
    }));

    const allNodes = [...salesMethodPositions, ...retailerPositions];

    // Criar links
    const links = data.map(d => {
      const source = allNodes.find(n => n.name === d.from);
      const target = allNodes.find(n => n.name === d.to);
      return { source, target, value: d.value };
    }).filter(link => link.source && link.target);

    // Adicionar links com curvas mais suaves e organizadas
    svg.append('g')
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', (d: any) => {
        const sourceX = d.source.x + d.source.width;
        const sourceY = d.source.y + d.source.height / 2;
        const targetX = d.target.x;
        const targetY = d.target.y + d.target.height / 2;
        
        const controlPoint1X = sourceX + (targetX - sourceX) * 0.3;
        const controlPoint2X = sourceX + (targetX - sourceX) * 0.7;
        
        return `M ${sourceX} ${sourceY} 
                C ${controlPoint1X} ${sourceY} 
                  ${controlPoint2X} ${targetY} 
                  ${targetX} ${targetY}`;
      })
      .attr('stroke', (d: any) => {
        const sourceColor = colorMap[d.source.name];
        return sourceColor + '80'; // 50% opacidade para melhor visualização
      })
      .attr('stroke-width', (d: any) => Math.max(2, (d.value / 100000) * 15))
      .attr('fill', 'none')
      .attr('opacity', 0.7)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d: any) {
        d3.select(this)
          .attr('opacity', 1)
          .attr('stroke-width', Math.max(3, (d.value / 100000) * 20));
        
        // Tooltip profissional
        const tooltip = d3.select('body').append('div')
          .attr('class', 'sankey-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.9)')
          .style('color', 'white')
          .style('padding', '12px 16px')
          .style('border-radius', '8px')
          .style('font-size', '14px')
          .style('font-family', 'Inter, system-ui, sans-serif')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
          .style('border', '1px solid rgba(255,255,255,0.1)');

        tooltip.html(`
          <div style="font-weight: 600; margin-bottom: 4px;">
            ${d.source.name} → ${d.target.name}
          </div>
          <div style="color: #ccc; font-size: 12px;">
            Units Sold: ${d.value.toLocaleString()}
          </div>
        `)
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 15) + 'px');
      })
      .on('mouseout', function(d: any) {
        d3.select(this)
          .attr('opacity', 0.7)
          .attr('stroke-width', Math.max(2, (d.value / 100000) * 15));
        
        d3.selectAll('.sankey-tooltip').remove();
      });

    // Adicionar nós
    const node = svg.append('g')
      .selectAll('g')
      .data(allNodes)
      .enter()
      .append('g')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer');

    // Retângulos dos nós com design mais profissional
    node.append('rect')
      .attr('width', (d: any) => d.width)
      .attr('height', (d: any) => d.height)
      .attr('fill', (d: any) => colorMap[d.name] || '#ccc')
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
      .attr('rx', 4)
      .attr('ry', 4)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))')
      .on('mouseover', function(event, d: any) {
        d3.select(this)
          .attr('stroke-width', 2)
          .attr('stroke', '#000')
          .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))');
        
        // Destacar links relacionados
        svg.selectAll('path')
          .attr('opacity', (link: any) => 
            link.source.name === d.name || link.target.name === d.name ? 1 : 0.1
          );
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke-width', 1)
          .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))');
        
        // Restaurar opacidade dos links
        svg.selectAll('path')
          .attr('opacity', 0.7);
      });

    // Labels dos nós com melhor tipografia - maiores para nós totalmente largos
    node.append('text')
      .attr('x', (d: any) => d.width / 2)
      .attr('y', (d: any) => d.height / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('fill', 'white')
      .style('text-shadow', '0 1px 2px rgba(0,0,0,0.7)')
      .text((d: any) => d.name);

    // Valores dos nós com melhor formatação - maiores para nós totalmente largos
    node.append('text')
      .attr('x', (d: any) => d.width / 2)
      .attr('y', (d: any) => d.height + 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('fill', '#374151')
      .text((d: any) => d.total.toLocaleString());

    // Título do gráfico mais proeminente - mais abaixado
    svg.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '700')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('fill', '#1F2937')
      .text('Contribuição do Retailer e Sales Method para o Units Sold');

    // Legendas das colunas mais organizadas - posicionadas nas pontas extremas e mais abaixadas
    svg.append('text')
      .attr('x', leftColumnX + 55)
      .attr('y', margin.top + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('fill', '#6B7280')
      .text('Sales Method');

    svg.append('text')
      .attr('x', rightColumnX + 60)
      .attr('y', margin.top + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('fill', '#6B7280')
      .text('Retailer');

  }, [data, chartDimensions]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <div style={{ width: chartDimensions.width, height: chartDimensions.height }}>
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
      </div>
    </div>
  );
}
