import React from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

export interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
}

export const MyPieChart: React.FC<PieChartProps> = ({ data, dataKey, nameKey }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF55AA']; // Add more colors if needed

  return (
    <PieChart width={600} height={600}>
      <Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        outerRadius={150}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};