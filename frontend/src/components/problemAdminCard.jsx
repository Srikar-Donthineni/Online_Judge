import { useState } from "react";
import "./problemAdminCard.css";
import ConfirmModal from "./ConfirmModal";
import "./ConfirmModal.css";

const ProblemCard = ({ problem, onClick, onDelete, onEdit }) => {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <ConfirmModal
          onConfirm={() => {
            onDelete(problem.slug);
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}

      <div className="acard-item" onClick={() => onClick(problem.slug)}>
        {/* Top accent bar */}
        <div className="acard-accent-bar" />

        <div className="acard-header">
          <div className="acard-header-left">
            <span className="acard-index-dot" />
            <p className="acard-title">{problem.title}</p>
          </div>
          <div className="acard-actions">
            <button
              className="acard-btn acard-btn-edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(problem);
              }}
              title="Edit"
            >
              <span className="acard-btn-icon">✎</span>
            </button>
            <button
              className="acard-btn acard-btn-delete"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              title="Delete"
            >
              <span className="acard-btn-icon">✕</span>
            </button>
          </div>
        </div>

        <div className="acard-divider" />

        <p className={`acard-statement ${expanded ? "acard-statement--expanded" : ""}`}>
          {problem.problemStatement}
        </p>

        <button
          className="acard-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
        >
          {expanded ? "Show less ↑" : "Show more ↓"}
        </button>
      </div>
    </>
  );
};

export default ProblemCard;
