import React, { useState } from 'react';
import logo from './logo.svg';
import axios from "axios";
import './App.css';
import { Query } from './Query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart } from "recharts";
import { BarChartProps, MyBarChart } from './BarChart';


interface InputFormProps {
  onSubmit: (query: Query) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [select, setSelect] = useState("");
  const [where, setWhere] = useState("");
  const [groupby, setGroupby] = useState("");


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const query: Query = { select, where, groupby }

    onSubmit(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        select:
        <input type="text" value={select} onChange={(e) => setSelect(e.target.value)} />
      </label>
      <br />
      <label>
        where:
        <input type="text" value={where} onChange={(e) => setWhere(e.target.value)} />
      </label>
      <br />
      <label>
        groupby:
        <input type="text" value={groupby} onChange={(e) => setGroupby(e.target.value)} />
      </label>
      <br />
        <button type="submit">Submit</button>
    </form>
  );
};

const App: React.FC = () => {
  const [raw, setRaw] = useState<any>(null);
  const [fmtted, setfmtted] = useState<any>(null);
  const submitQuery = async (query: Query) => {
    console.log(query)
    try {
      const response = await axios.post("http://localhost:8080/run-query", JSON.stringify(query), {
        headers: {
          "Content-Type": "text/plain",
        },
      });
      console.log("got data")
      setRaw(response.data)
      const keys = Object.keys(response.data[0]);
      const fmtted = response.data.map ( (dataPoint: any) => ({
        x: dataPoint[keys[0]],
        y: dataPoint[keys[1]]
      })
      )
      setfmtted(fmtted)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Query</h1>
      <InputForm onSubmit={submitQuery} />
      {raw && (
        <div>
          <h2>Response Data:</h2>
          <pre>{JSON.stringify(raw, null, 2)}</pre>
        </div>
      )}
      {raw &&(
      <div>
        <h2>Bar Chart</h2>
        <MyBarChart data={raw} xKey="loan_purpose" />
      </div>)}

      <div>
          <h2>Line Chart:</h2>
          <LineChart width={600} height={300} data={fmtted}>
            <XAxis dataKey="x" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="y" stroke="#8884d8" />
          </LineChart>
        </div>
    </div>
  );
};

export default App;
