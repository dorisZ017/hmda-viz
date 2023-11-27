import React from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export interface ScatterPlotProps {
  data: any[],
  xKey: string,
  yKey: string,
}

export const MyScatterChart: React.FC<ScatterPlotProps> = ({ data, xKey, yKey }) => {
  const name = xKey + "-" + yKey
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <CartesianGrid />
        <XAxis dataKey={xKey} type="number" name={xKey} />
        <YAxis dataKey={yKey} type="number" name={yKey} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name={name} data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};