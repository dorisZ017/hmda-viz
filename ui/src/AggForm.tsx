import React, { useState } from 'react';
import { AggV2, Sample, Select, Filter } from './Query';
import { allColumns, allOperators, categoryColumns } from './Constants';

interface AggProps {
  onSubmit: (agg: AggV2) => void;
}

export const AggFormV2: React.FC<AggProps> = ({ onSubmit }) => {
  const [newSelect, setNewSelect] = useState<Select>(new Select("", "", ""));
  const [newWhere, setNewWhere] = useState<Filter>({ col: "", predicate: "" });
  const [newGroupBy, setNewGroupBy] = useState<string>("");

  const [selects, setSelects] = useState<Array<Select>>([]);
  const [wheres, setWheres] = useState<Array<Filter>>([]);
  const [groupBys, setGroupBys] = useState<Array<string>>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirmSelect = () => {
    setSelects((prevSelects) => [...prevSelects, newSelect]);
    setNewSelect(new Select("", "", "")); // Reset input fields
  };

  const handleConfirmWhere = () => {
    setWheres((prevWheres) => [...prevWheres, newWhere]);
    setNewWhere({ col: "", predicate: "" }); // Reset input fields
  };

  const handleConfirmGroupBy = () => {
    setGroupBys((prevGroupBys) => [...prevGroupBys, newGroupBy]);
    setNewGroupBy(""); // Reset input field
  };

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

  const handleRemoveGroupBy = (index: number) => {
    const updatedGroupBys = [...groupBys];
    updatedGroupBys.splice(index, 1);
    setGroupBys(updatedGroupBys);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const selectFields = selects.filter((select) => select.operator == "").map((select) => select.col);
    const missingFields = selectFields.filter((field) => !groupBys.includes(field));
    if (missingFields.length > 0 && groupBys.length > 0) {
      setErrorMessage(`All column names in SELECT list must appear in GROUP BY clause unless name is used only in an aggregate function.`);
      return; // Prevent form submission
    }

    setErrorMessage(null);


    const agg: AggV2 = { select: selects, where: wheres, groupBy: groupBys };

    onSubmit(agg);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Build Query</h3>
      <div className="form-container">
      <div>
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
      </div>
      <div>
        <label>
          <h4>Filter</h4>
          <div className="form-group">
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
          <h4>Group By</h4>
          <div className="form-group">
          Column Name:
          <select
            value={newGroupBy}
            onChange={(e) => setNewGroupBy(e.target.value)}
          >
            <option value="">Select Column</option>
            {categoryColumns.map((field, index) =>
              <option key={index} value={field}>
                {field}
              </option>
            )}
          </select>
          </div>
        </label>
        <button type="button" onClick={handleConfirmGroupBy}>
          Add Group By
        </button>
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
          {groupBys.map((groupBy, index) => (
            <li key={index}>
              {`GROUP BY: ${groupBy}`}
              <button type="button" onClick={() => handleRemoveGroupBy(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        /</div>
      </div>
</div>
      <button type="submit">Submit</button>
      
    </form>
  );
};

