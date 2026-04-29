import { useEffect, useState } from "react";
import ProblemCard from "./problemAdminCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Search from "./searchBar";
import "./problemsAdmin.css";

const ProblemAdmin = () => {
  const [allProblems, setallProblems] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (problem) => {
    navigate("/createNew", { state: { problem: problem } });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const deleteUrl = `http://localhost:3000/problem/${id}`;
      const res = await axios.delete(deleteUrl, { withCredentials: true });
      if (res.status === 200) {
        setallProblems((prev) => prev.filter((item) => item._id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const moveToProblem = (id) => {
    navigate(`/runCode/${id}`);
  };

  const createNew = () => {
    navigate("/createNew");
  };

  useEffect(() => {
    const getProblems = async () => {
      const problemsUrl = "http://localhost:3000/problem";
      const res = await axios.get(problemsUrl, { withCredentials: true });
      console.log(res.data);
      setallProblems(res.data);
    };
    getProblems();
  }, []);

  return (
    <div className="admin-page">
      {/* Top bar */}
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <span className="admin-badge">ADMIN</span>
          <h1 className="admin-title">Problem Manager</h1>
        </div>
        <button className="admin-create-btn" onClick={createNew}>
          <span className="admin-create-btn-icon">+</span>
          Create New
        </button>
      </div>

      {/* Stats strip */}
      <div className="admin-stats-strip">
        <div className="admin-stat">
          <span className="admin-stat-value">{allProblems.length}</span>
          <span className="admin-stat-label">Total Problems</span>
        </div>
        <div className="admin-stat-divider" />
        <div className="admin-stat">
          <span className="admin-stat-value admin-stat-value--green">
            {allProblems.filter((p) => p.difficulty === "easy").length}
          </span>
          <span className="admin-stat-label">Easy</span>
        </div>
        <div className="admin-stat-divider" />
        <div className="admin-stat">
          <span className="admin-stat-value admin-stat-value--yellow">
            {allProblems.filter((p) => p.difficulty === "medium").length}
          </span>
          <span className="admin-stat-label">Medium</span>
        </div>
        <div className="admin-stat-divider" />
        <div className="admin-stat">
          <span className="admin-stat-value admin-stat-value--red">
            {allProblems.filter((p) => p.difficulty === "hard").length}
          </span>
          <span className="admin-stat-label">Hard</span>
        </div>
      </div>

      {/* Search */}
      <div className="admin-search-wrapper">
        <Search problems={allProblems} moveToProblem={moveToProblem} />
      </div>

      {/* Grid */}
      <div className="admin-grid">
        {allProblems.map((problem, idx) => (
          <div
            key={problem._id}
            className={`admin-card-wrapper ${deletingId === problem._id ? "admin-card-wrapper--deleting" : ""}`}
            style={{ animationDelay: `${idx * 55}ms` }}
          >
            <ProblemCard
              problem={problem}
              onClick={() => moveToProblem(problem._id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemAdmin;
