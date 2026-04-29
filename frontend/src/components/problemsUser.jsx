import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProblemCard from "./problemCard";
import Search from "./searchBar";
import "./problemsUser.css";
import { useSelector } from "react-redux";

const Problems = () => {
  const [problemsArray, setProblemsArray] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state)=>state.auth.user);
  console.log("in users problems",user);

  useEffect(() => {
    const getProblems = async () => {
      const problemsUrl = "http://localhost:3000/problem";
      const res = await axios.get(problemsUrl, { withCredentials: true });
      setProblemsArray(res.data);
    };
    getProblems();
  }, []);

  const moveToProblem = (id) => {
    navigate(`/runCode/${id}`);
  };

  return (
    <div className="problems-page">
      <div className="problems-header">
        <div className="problems-header-glow" />

      { !user && <div className="problems-nav">
    <button className="problems-login-btn" onClick={() => navigate('/login')}>
      Login
    </button>
  </div> }

        <h1 className="problems-title">
          <span className="problems-title-prefix">{"<"}</span>
          Problem Set
          <span className="problems-title-suffix">{"/>"}</span>
        </h1>
        <p className="problems-subtitle">Pick a challenge. Prove your logic.</p>
      </div>

      <div className="problems-search-wrapper">
        <Search problems={problemsArray} moveToProblem={moveToProblem} />
      </div>

      <div className="problems-count-bar">
        <span className="problems-count-label">
          <span className="problems-count-dot" />
          {problemsArray.length} problems loaded
        </span>
      </div>

      <div className="problems-grid">
        {problemsArray.map((problem, idx) => (
          <div
            className="problems-card-wrapper"
            style={{ animationDelay: `${idx * 60}ms` }}
            key={problem._id}
          >
            <ProblemCard
              problem={problem}
              onClick={() => moveToProblem(problem._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Problems;
