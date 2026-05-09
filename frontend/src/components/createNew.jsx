import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState , useRef} from "react";
import "./createNew.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateNew = () => {
  const user = useSelector((state)=>state.auth.user)
  const navigate = useNavigate();
  const location = useLocation();
  const editMode = location.state ? true:false;
  const problem = location.state ? location.state.problem : {
      title: "",
      problemStatement: "",
      sampleInput: "",
      sampleOutput: "",
      inputFileName:"",
      outputFileName:""
    };
  const [creationCheck, setCreationCheck] = useState(false);

  const [formData, setFormData] = useState(problem);
  const [inputFile, setInputFile] = useState(null);
  const [outputFile, setOutputFile] = useState(null);

  const inputFileRef = useRef(null);
  const outputFileRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      problemStatement: "",
      sampleInput: "",
      sampleOutput: "",
      inputFileName:"",
      outputFileName:""
    });
    setInputFile(null);
    setOutputFile(null);
    inputFileRef.current.value = "";
    outputFileRef.current.value = "";
  };

  const createProblem = async (e) => {
    e.preventDefault();

    const url = editMode ? `http://localhost:3000/problem/${problem.slug}`:"http://localhost:3000/problem"

    const data = new FormData();
    data.append("title", formData.title);
    data.append("problemStatement", formData.problemStatement);
    data.append("sampleInput", formData.sampleInput);
    data.append("sampleOutput", formData.sampleOutput);
    data.append("inputFile", inputFile);
    data.append("outputFile", outputFile);

    const res = editMode ? (await axios.put(url, data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    })) : (await axios.post(url,data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" }}))

    if (res.status === 200) {
      if(!editMode)
      resetForm();
      setCreationCheck(true);
    }
  };
  if (!user) {
  return (
    <div className="admin-locked-page">
      <div className="admin-locked-glow" />
      <div className="admin-locked-box">
        <span className="admin-locked-icon">⚿</span>
        <h2 className="admin-locked-title">Access Restricted</h2>
        <p className="admin-locked-message">You need to be logged in to access the Admin Panel.</p>
        <div className="admin-locked-actions">
          <button className="admin-locked-btn primary" onClick={() => navigate('/login')}>Go to Login</button>
          <button className="admin-locked-btn secondary" onClick={() => navigate('/')}>Go Back</button>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="cn-page">
      <button className="cn-back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="cn-card">
        <h2 className="cn-heading">{ editMode ? "Edit the problem" : "Create new problem"}</h2>

        {creationCheck && (
          <div className="cn-success-banner">
            <span>{editMode ? "Problem edited successfully" : "Problem created successfully"}</span>
            <button
              className="cn-success-close"
              onClick={() => setCreationCheck(false)}
            >
              ✕
            </button>
          </div>
        )}

        <form className="cn-form" onSubmit={createProblem}>
          <div className="cn-field">
            <label className="cn-label" htmlFor="title">Problem title</label>
            <input
              className="cn-input"
              id="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Two Sum"
            />
          </div>

          <div className="cn-field">
            <label className="cn-label" htmlFor="problemStatement">Problem statement</label>
            <textarea
              className="cn-input cn-textarea"
              id="problemStatement"
              value={formData.problemStatement}
              onChange={handleChange}
              placeholder="Describe the problem..."
              rows={4}
            />
          </div>

          <div className="cn-row">
            <div className="cn-field">
              <label className="cn-label" htmlFor="sampleInput">Sample input</label>
              <input
                className="cn-input"
                id="sampleInput"
                type="text"
                value={formData.sampleInput}
                onChange={handleChange}
                placeholder="e.g. 1 2"
              />
            </div>

            <div className="cn-field">
              <label className="cn-label" htmlFor="sampleOutput">Sample output</label>
              <input
                className="cn-input"
                id="sampleOutput"
                type="text"
                value={formData.sampleOutput}
                onChange={handleChange}
                placeholder="e.g. 3"
              />
            </div>
          </div>

          <div className="cn-row">
            <div className="cn-field">
              <label className="cn-label" htmlFor="fileinput">Input file</label>
              <input
                className="cn-file"
                id="fileinput"
                type="file"
                ref={inputFileRef}
                onChange={(e) => setInputFile(e.target.files[0])}
              />
            </div>

            <div className="cn-field">
              <label className="cn-label" htmlFor="fileoutput">Output file</label>
              <input
                className="cn-file"
                id="fileoutput"
                type="file"
                ref={outputFileRef}
                onChange={(e) => setOutputFile(e.target.files[0])}
              />
            </div>
          </div>

          <button className="cn-submit-btn" type="submit">{editMode ? "Edit problem" : "Create problem"}</button>
        </form>
      </div>
    </div>
  );
};

export default CreateNew;