import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProblemCard from "./problemCard";
import Search from "./searchBar";
import "./problemsUser.css";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "./authSlice";

const Problems = () => {
  const [problemsArray, setProblemsArray] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ Fix 1: was missing
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const getProblems = async () => {
      const problemsUrl = "https://backend.srikarweb.com/problem";
      const res = await axios.get(problemsUrl, { withCredentials: true });
      setProblemsArray(res.data);
    };
    getProblems();
  }, []);

  const moveToProblem = (slug) => {
    navigate(`/runCode/${slug}`);
  };

const logout = async () => {
    try {
      const logoutUrl = "https://backend.srikarweb.com/auth/logout"; // ✅ Fix 2: defined logoutUrl
      await axios.post(logoutUrl, {}, { withCredentials: true }); // ✅ Fix 3: was using problemsUrl
      dispatch(clearUser()); // ✅ Fix 4: was dispatchEvent(clearUser())
      navigate("/login");
    } catch (error) {
      console.log("Error while logging out", error);
    }
  };

  return (
    <div className="problems-page">
      <div className="problems-header">
        <div className="problems-header-glow" />

        {/* ✅ Show Login if not logged in, Logout if logged in */}
        <div className="problems-nav">
          {user ? (
              <button className="problems-logout-btn" onClick={logout}>
                <span className="problems-logout-icon">⏻</span>
                Logout
              </button>
          ) : (
            <button
              className="problems-login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>

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
            key={problem.slug}
          >
            <ProblemCard
              problem={problem}
              onClick={() => moveToProblem(problem.slug)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Problems;
