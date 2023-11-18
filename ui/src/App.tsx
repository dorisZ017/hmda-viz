import React, { useState } from 'react';
import logo from './logo.svg';
import axios from "axios";
import './App.css';
import { Agg, AggV2, Sample, VizProps } from './Query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart } from "recharts";
import { BarChartProps, MyBarChart } from './BarChart';
import { AggForm, SampleForm, submitAgg } from './InputForms';
import { AggFormV2 } from './AggForm';
import { MyPieChart } from './PieChart';
import { StateMap } from './MapChart'


enum InputFormType {
  BarChart = "bar_chart",
  PieChart = "pie_chart",
  SampleData = "sample_data",
  MapChart = "map_chart",
}

const App: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<InputFormType>();
  const [respAgg, setRespAgg] = useState<any[]>();
  const [xKey, setXkey] = useState<string>("");
  const [yKey, setYkey] = useState<string>("");
  const [respSample, setRespSample] = useState<any[]>();

  const handleFormSelection = (formType: InputFormType) => {
    setSelectedForm(formType);
  };

  const submitAgg = async (agg: Agg) => {
    try {
      const response = await axios.post("http://localhost:8082/run-query", JSON.stringify(agg), {
        headers: {
          "Content-Type": "text/plain",
        },
      });
      console.log("got data");
      const keys = Object.keys(response.data[0]);
      setXkey(keys[0]);
      setRespAgg(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  const submitSample = async (sample: Sample) => {
    try {
      const response = await axios.post("http://localhost:8082/run-sample", JSON.stringify(sample), {
        headers: {
          "Content-Type": "text/plain",
        },
      });
      console.log("got data");
      setRespSample(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  const submitAggV2 = async (agg: AggV2) => {
    console.log(JSON.stringify(agg));
    try {
      const response = await axios.post("http://localhost:8082/run-query-v2", JSON.stringify(agg), {
        headers: {
          "Content-Type": "text/plain",
        },
      });
      console.log("got data");
      const keys = Object.keys(response.data[0]);
      setXkey(keys[0]);
      setYkey(keys[1]);
      setRespAgg(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Welcome to Housing Data Explorer</h1>
      {/* Form for selecting the input type */}
      <div>
        <label>
          Choose an option:
          <select value={selectedForm} onChange={(e) => handleFormSelection(e.target.value as InputFormType)}>
            <option value="">Select an option</option>
            <option value={InputFormType.SampleData}>Sample Data</option>
            <option value={InputFormType.BarChart}>Plot Bar Chart</option>
            <option value={InputFormType.PieChart}>Plot Pie Chart</option>
            <option value={InputFormType.MapChart}>Plot Map Chart</option>
          </select>
        </label>
      </div>

      {/* Conditional rendering based on the selectedForm */}
      {selectedForm === InputFormType.BarChart && <AggFormV2 onSubmit={submitAggV2} />}
      {selectedForm === InputFormType.PieChart && <AggFormV2 onSubmit={submitAggV2} />}
      {selectedForm === InputFormType.MapChart && <AggFormV2 onSubmit={submitAggV2} />}
      {selectedForm === InputFormType.SampleData && <SampleForm onSubmit={submitSample} />}

      {/* Render different results based on the selectedForm */}
      {selectedForm === InputFormType.BarChart && respAgg && <MyBarChart data={respAgg} xKey={xKey} />}
      {selectedForm === InputFormType.PieChart && respAgg && <MyPieChart data={respAgg} dataKey={yKey} nameKey={xKey} />}
      {selectedForm === InputFormType.MapChart && respAgg && <StateMap data={respAgg} yKey={yKey} />}
      {selectedForm === InputFormType.SampleData && respSample && <div>
          <h2>Response Data:</h2>
          <pre>{JSON.stringify(respSample, null, 2)}</pre>
        </div>}
    </div>
  );
};


export default App;
