import React, { useState } from 'react';
import { Agg, Sample } from './Query';
import axios from "axios";


interface AggProps {
  onSubmit: (agg: Agg) => void;
}

export const AggForm: React.FC<AggProps> = ({ onSubmit }) => {
  const [select, setSelect] = useState("");
  const [where, setWhere] = useState("");
  const [groupby, setGroupby] = useState("");


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const agg: Agg = { select, where, groupby }

    onSubmit(agg);
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

export const submitAgg = async (agg: Agg) => {
  try {
    const response = await axios.post("http://localhost:8080/run-query", JSON.stringify(agg), {
      headers: {
        "Content-Type": "text/plain",
      },
    });
    console.log("got data");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const fmtData = (data: any, x: string, y: string) => {
  const fmtted = data.map ( (dataPoint: any) => ({
    x: dataPoint[x],
    y: dataPoint[y]
  })
  )
  return fmtted;
}

interface SampleProps {
  onSubmit: (sample: Sample) => void;
}

export const SampleForm: React.FC<SampleProps> = ({ onSubmit }) => {
  const [select, setSelect] = useState("");
  const [where, setWhere] = useState("");
  const [limit, setLimit] = useState("20")


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const sample: Sample = { select, where, limit}

    onSubmit(sample);
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
        limit:
        <input type="text" value={limit} onChange={(e) => setLimit(e.target.value)} />
      </label>
      <br />
        <button type="submit">Submit</button>
    </form>
  );
};





