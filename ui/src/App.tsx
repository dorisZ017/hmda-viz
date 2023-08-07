import React, { useState } from 'react';
import logo from './logo.svg';
import axios from "axios";
import './App.css';
import { Agg, Sample, VizProps } from './Query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart } from "recharts";
import { BarChartProps, MyBarChart } from './BarChart';
import { AggForm, SampleForm } from './InputForms';


enum InputFormType {
  BarChart = "bar_chart",
  SampleData = "sample_data",
}

const App: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<InputFormType>();
  const [respAgg, setRespAgg] = useState<any[]>();
  const [xKey, setXkey] = useState<string>("");
  const [yKey, setYkey] = useState<string>();
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
          </select>
        </label>
      </div>

      {/* Conditional rendering based on the selectedForm */}
      {selectedForm === InputFormType.BarChart && <AggForm onSubmit={submitAgg} />}
      {selectedForm === InputFormType.SampleData && <SampleForm onSubmit={submitSample} />}

      {/* Render different results based on the selectedForm */}
      {selectedForm === InputFormType.BarChart && respAgg && <MyBarChart data={respAgg} xKey={xKey} />}
      {selectedForm === InputFormType.SampleData && respSample && <div>
          <h2>Response Data:</h2>
          <pre>{JSON.stringify(respSample, null, 2)}</pre>
        </div>}
    </div>
  );
};


export default App;
