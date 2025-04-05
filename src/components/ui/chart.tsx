import React from 'react';
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Line,
  Pie,
  Cell,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showAnimation?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
}

export const BarChart = ({ 
  data, 
  index, 
  categories, 
  colors = ["#3b82f6"], 
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40,
  showAnimation = false,
  showLegend = false,
  showGrid = true
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} />
        <Tooltip formatter={valueFormatter} />
        {showLegend && <Legend />}
        {categories.map((category, idx) => (
          <Bar 
            key={category}
            dataKey={category} 
            fill={colors[idx % colors.length]}
            animationDuration={showAnimation ? 1500 : 0}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export interface LineChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showAnimation?: boolean;
  showLegend?: boolean;
  curveType?: 'linear' | 'monotone' | 'natural';
}

export const LineChart = ({
  data,
  index,
  categories,
  colors = ["#3b82f6"],
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40,
  showAnimation = false,
  showLegend = false,
  curveType = 'linear'
}: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} />
        <Tooltip formatter={valueFormatter} />
        {showLegend && <Legend />}
        {categories.map((category, idx) => (
          <Line
            key={category}
            type={curveType}
            dataKey={category}
            stroke={colors[idx % colors.length]}
            activeDot={{ r: 8 }}
            strokeWidth={2}
            animationDuration={showAnimation ? 1500 : 0}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export interface DonutChartProps {
  data: any[];
  category: string;
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showAnimation?: boolean;
  showLabel?: boolean;
  showTooltip?: boolean;
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
}

export const DonutChart = ({
  data,
  category,
  index,
  colors = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#6366f1"],
  valueFormatter = (value) => `${value}`,
  showAnimation = false,
  showLabel = false,
  showTooltip = true,
  className = "",
  innerRadius = 60,
  outerRadius = 80
}: DonutChartProps) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          {showTooltip && <Tooltip formatter={valueFormatter} />}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showLabel ? renderCustomizedLabel : undefined}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={category}
            nameKey={index}
            animationDuration={showAnimation ? 1000 : 0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
