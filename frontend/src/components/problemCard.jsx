import { useState } from "react";
import "./problemCard.css";

const ProblemCard = ({ problem, onClick }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="ucard-item" onClick={() => onClick(problem)}>

      {/* Left: Title */}
      <div className="ucard-left">
        <span className="ucard-tag">Problem</span>
        <h2 className="ucard-title">{problem.title}</h2>
      </div>

      <div className="ucard-divider" />

      {/* Right: Statement + Footer */}
      <div className="ucard-right">
        <p className={`ucard-statement ${expanded ? "ucard-statement--expanded" : ""}`}>
          {problem.problemStatement}
        </p>
        <div className="ucard-footer">
          <button
            className="ucard-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
          >
            {expanded ? "Show less ↑" : "Show more ↓"}
          </button>
          <span className="ucard-solve">Solve →</span>
        </div>
      </div>

    </div>
  );
};

export default ProblemCard;
