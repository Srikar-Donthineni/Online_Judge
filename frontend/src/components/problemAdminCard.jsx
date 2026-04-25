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
            onDelete(problem._id);
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}

      <div className="pcard-item" onClick={() => onClick(problem._id)}>
        <div className="pcard-header">
          <p className="pcard-title">{problem.title}</p>
          <div className="pcard-actions">
            <button
              className="pcard-btn pcard-btn-edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(problem);
              }}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="pcard-btn pcard-btn-delete"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true); // show modal instead of calling onDelete directly
              }}
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>

        <hr className="pcard-divider" />

        <p className={`pcard-statement ${expanded ? "pcard-expanded" : ""}`}>
          {problem.problemStatement}
        </p>

        <button
          className="pcard-toggle"
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