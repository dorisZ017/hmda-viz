import React, { Component, PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface BarChartProps {
  data: any[],
  xKey: string,
}

export const MyBarChart: React.FC<BarChartProps> = ({data, xKey}) => {
  const dataKeys = Object.keys(data[0]).filter((key) => key !== xKey);
  return (
    <BarChart width={1200} height={400} data={data}>
      <XAxis dataKey={xKey} />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      {
        dataKeys.map((dataKey, index) => (
          <Bar key={index} dataKey={dataKey} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
        ))
      }
    </BarChart>
  );
};