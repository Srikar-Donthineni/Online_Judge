import { useState } from "react";
import "./ProblemCard.css";

const ProblemCard = ({ problem, onClick }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="pcard-item" onClick={() => onClick(problem)}>

      {/* Left: Title */}
      <div className="pcard-left">
        <span className="pcard-tag">Problem</span>
        <h2 className="pcard-title">{problem.title}</h2>
      </div>

      <div className="pcard-divider" />

      {/* Right: Statement + Footer */}
      <div className="pcard-right">
        <p className={`pcard-statement ${expanded ? "pcard-expanded" : ""}`}>
          {problem.problemStatement}
        </p>
        <div className="pcard-footer">
          <button
            className="pcard-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
          >
            {expanded ? "Show less ↑" : "Show more ↓"}
          </button>
          <span className="pcard-solve">Solve →</span>
        </div>
      </div>

    </div>
  );
};

export default ProblemCard;