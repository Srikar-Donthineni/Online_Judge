import { useState } from "react";
import "./searchBar.css";

const Search = ({ problems, moveToProblem }) => {
  const [category, setcategory] = useState("title");
  const [input, setinput] = useState("");
  const [matchedproblems, setmatchedproblems] = useState([]);
  const [focused, setFocused] = useState(false);

  const searchtheproblems = (e) => {
    setinput(e.target.value);
    const temp = [];
    for (let i = 0; i < problems.length; i++) {
      if (
        problems[i][category]
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      ) {
        temp.push(problems[i]);
      }
    }
    setmatchedproblems(temp);
  };

  const showDropdown = focused && input.length > 0 && matchedproblems.length > 0;

  return (
    <div className="search-root">
      {/* Filter pill */}
      <div className="search-filter-row">
        <span className="search-filter-label">Search by</span>
        <div className="search-select-wrapper">
          <select
            className="search-select"
            value={category}
            onChange={(e) => setcategory(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="problemStatement">Problem Statement</option>
          </select>
          <span className="search-select-arrow">▾</span>
        </div>
      </div>

      {/* Input */}
      <div className={`search-input-wrapper ${focused ? "search-input-wrapper--focused" : ""}`}>
        <span className="search-icon">⌕</span>
        <textarea
          className="search-textarea"
          value={input}
          onChange={searchtheproblems}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={`Search by ${category === "title" ? "problem title..." : "problem statement..."}`}
          rows={1}
        />
        {input && (
          <button
            className="search-clear-btn"
            onClick={() => { setinput(""); setmatchedproblems([]); }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div className="search-dropdown">
          <p className="search-dropdown-heading">
            {matchedproblems.length} result{matchedproblems.length !== 1 ? "s" : ""}
          </p>
          {matchedproblems.slice(0, 3).map((problem) => (
            <div
              key={problem.slug}
              className="search-result-item"
              onMouseDown={() => moveToProblem(problem.slug)}
            >
              <span className="search-result-arrow">→</span>
              <span className="search-result-title">{problem.title}</span>
            </div>
          ))}
          {matchedproblems.length > 3 && (
            <p className="search-result-more">
              +{matchedproblems.length - 3} more
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
