import React, { useState } from 'react';
import { Select, Filter, SampleV2 } from './Query';
import { allColumns, allOperators, categoryColumns } from './Constants';

interface SampleProps {
  onSubmit: (sample: SampleV2) => void;
}

export const SampleFormV2: React.FC<SampleProps> = ({ onSubmit }) => {
  const [newSelect, setNewSelect] = useState<Select>(new Select("", "", ""));
  const [newWhere, setNewWhere] = useState<Filter>({ col: "", predicate: "" });
  const [newLimit, setNewLimit] = useState<number>(0);

  const [selects, setSelects] = useState<Array<Select>>([]);
  const [wheres, setWheres] = useState<Array<Filter>>([]);
  const [limit, setLimit] = useState<number>(10);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleConfirmSelect = () => {
    setSelects((prevSelects) => [...prevSelects, newSelect]);
    setNewSelect(new Select("", "", "")); // Reset input fields
  };

  const handleConfirmWhere = () => {
    setWheres((prevWheres) => [...prevWheres, newWhere]);
    setNewWhere({ col: "", predicate: "" }); // Reset input fields
  };

  const handleConfirmLimit = () => {
    setLimit(newLimit)
  }

  const handleRemoveSelect = (index: number) => {
    const updatedSelects = [...selects];
    updatedSelects.splice(index, 1);
    setSelects(updatedSelects);
  };

  const handleRemoveWhere = (index: number) => {
    const updatedWheres = [...wheres];
    updatedWheres.splice(index, 1);
    setWheres(updatedWheres);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (limit == 0 || limit > 10000) {
      setErrorMessage(`Limit cannot exceed 10000`)
      return;
    }

    setErrorMessage(null)

    const sample: SampleV2 = {select: selects, where: wheres, limit: limit}

    onSubmit(sample)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Build Query</h3>
      <div className="form-container">
      <div>
        <label>
          <h4>Select</h4>
          <div className="form-group">
          Column Name:
          <select
            value={newSelect.col}
            onChange={(e) => setNewSelect(new Select(e.target.value, newSelect.operator, newSelect.alias))}
          >
            <option value="">Select Column</option>
            {allColumns.map((field, index) =>
              <option key={index} value={field}>
                {field}
              </option>
            )}
          </select>
          </div>
          <div className="form-group">
          Operator:
          <select
            value={newSelect.operator}
            onChange={(e) => setNewSelect(new Select(newSelect.col, e.target.value, newSelect.alias))}
          >
            <option value="">Select Operator</option>
            {allOperators.map((field, index) =>
              <option key={index} value={field}>
                {field}
              </option>
            )}
          </select>
          </div>
          <div className="form-group">
          Alias:
          <input
            type="text"
            value={newSelect.alias}
            onChange={(e) => setNewSelect(new Select(newSelect.col, newSelect.operator, e.target.value))}
            placeholder="alias"
          />
          </div>
          <button type="button" onClick={handleConfirmSelect}>
            Add Select
          </button>
        </label>
      </div>
      <div>
        <label>
        <div className="form-group">
          <h4>Filter</h4>
          Column Name:
          <select
            value={newWhere.col}
            onChange={(e) => setNewWhere({ ...newWhere, col: e.target.value })}
          >
            <option value="">Select Column</option>
            {allColumns.map((field, index) =>
              <option key={index} value={field}>
                {field}
              </option>
            )}
          </select>
          </div>
          <div className="form-group">
          Predicate:
          <input
            type="text"
            value={newWhere.predicate}
            onChange={(e) => setNewWhere({ ...newWhere, predicate: e.target.value })}
            placeholder="predicate"
          />
          </div>
        </label>
        <button type="button" onClick={handleConfirmWhere}>
          Add Filter
        </button>
      </div>

      <div>
        <label>
          <h4>Max entries</h4>
          Entries count:
          <input
            type = "number"
            value={newLimit}
            onChange={(e) => setNewLimit(+e.target.value)}
            placeholder='0'
          />
          <button type="button" onClick={handleConfirmLimit}>Set entries count</button>
        </label>
      </div>

      <div>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      </div>

      <div>
      <div className="clauses-section">
        <h3>Clauses:</h3>
        <ul>
          {selects.map((select, index) => (
            <li key={index}>
              {`SELECT ${select.toQuery()}`}
              <button type="button" onClick={() => handleRemoveSelect(index)}>
                Remove
              </button>
            </li>
          ))}
          {wheres.map((where, index) => (
            <li key={index}>
              {`WHERE ${where.col} ${where.predicate}`}
              <button type="button" onClick={() => handleRemoveWhere(index)}>
                Remove
              </button>
            </li>
          ))}
          <li>Entries to retrive: {limit}</li>
        </ul>
      </div>
      </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  );

}
