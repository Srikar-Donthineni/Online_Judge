import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./CodeExecute.css";
import { useSelector } from "react-redux";

const CodeExecute = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [language, setLanguage] = useState("python");
  const [problem,setproblem] = useState(null);
  const [isloading,setisloading] = useState(true);
  const [Code,setCode] = useState({
    python: `print("Hello World!")`,
    java: `class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
    javascript: `console.log("Hello, World!");`,
  });
  const user = useSelector((state)=>state.auth.user);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(()=>{
    const getProblem = async ()=>{
    const getUrl = `http://localhost:3000/problem/${id}`
    try{
      const res = await axios.get(getUrl);
      setproblem(res.data);
    }
    catch(error){
      setproblem(null);
      console.log("problem not found");
    }
    finally{
      setisloading(false);
    }
    }
  getProblem();
  },[])


  const [Input, setInput] = useState(problem?.sampleInput || "");
  const [Output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const runCode = async () => {
    const runCodeUrl = "http://localhost:3000/code/runcode";
    setIsRunning(true);
    setStatus(null);
    try {
      const res = await axios.post(
        runCodeUrl,
        { language, code: Code[language], sampleInput: Input },
        { withCredentials: true }
      );
      setOutput(res.data.output);
      setStatus("success"); 
    } catch (error) {
      setOutput(error.response.data.error);
      setStatus("error");
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    if(user){
    const id = problem?._id;
    const submitUrl = "http://localhost:3000/code/submitcode";
    setIsSubmitting(true);
    setStatus(null);
    try {
      const res = await axios.post(
        submitUrl,
        { code: Code[language], language, id },
        { withCredentials: true }
      );
      setStatus(res.data.result === "accepted" ? "accepted" : "wrong");
    } catch (error) {
      console.log("Error in submitting code ")
      console.log(error.message);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }}
    else
    {
      setShowLoginPopup(true);
    }
  };

  const handleLanguageChange = (e) => {
    const selected = e.target.value;
    setLanguage(selected);
  };

  if(isloading) {
  return <div className="ce-not-found">Loading...</div>;
}

if (!problem) {
  return (
    <div className="ce-not-found">
      <h2>Problem Not Found</h2>
      <button className="ce-btn run" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

  return ( 
    <div className="ce-page">

      {/* ── Left Panel: Problem ── */}
      <aside className="ce-problem-panel">
        <div className="ce-problem-inner">

          {/* Title */}
          <div className="ce-problem-title-row">
            <span className="ce-problem-number">#01</span>
            <h1 className="ce-problem-title">{problem?.title || "Problem Title"}</h1>
          </div>

          <div className="ce-divider" />

          {/* Problem Statement */}
          <div className="ce-section">
            <span className="ce-section-label">Problem Statement</span>
            <p className="ce-problem-statement">
              {problem?.problemStatement || "No problem statement provided."}
            </p>
          </div>

          <div className="ce-divider" />

          {/* Sample Input */}
          <div className="ce-section">
            <span className="ce-section-label">
              <span className="ce-label-dot input-dot" /> Sample Input
            </span>
            <textarea
              className="ce-sample-box"
              value={problem?.sampleInput || ""}
              readOnly
              rows={4}
            />
          </div>

          {/* Sample Output */}
          <div className="ce-section">
            <span className="ce-section-label">
              <span className="ce-label-dot output-dot" /> Sample Output
            </span>
            <textarea
              className="ce-sample-box"
              value={problem?.sampleOutput || ""}
              readOnly
              rows={4}
            />
          </div>

        </div>
      </aside>

      {/* ── Right Panel: Editor ── */}
      <main className="ce-editor-panel">

        {/* Editor Header */}
        <div className="ce-editor-header">
          <div className="ce-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <span className="ce-editor-label">editor</span>
          </div>
          <select className="ce-lang-select" value={language} onChange={handleLanguageChange}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* Monaco */}
        <div className="ce-monaco-wrap">
          <Editor
            height="100%"
            language={language}
            value={Code[language]}
            onChange={(val) => {
              setCode({
                ...Code,
                [language]:val
              })
            }}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              renderLineHighlight: "line",
              padding: { top: 16, bottom: 16 },
              scrollbar: {
                vertical: "auto",
                horizontal: "auto",
                alwaysConsumeMouseWheel: false,
              },
            }}
          />
        </div>

        {/* IO Row */}
        <div className="ce-io-row">
          <div className="ce-io-box">
            <label className="ce-io-label">
              <span className="ce-io-arrow">▶</span> stdin
            </label>
            <textarea
              className="ce-io-textarea"
              placeholder="Enter input..."
              value={Input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
            />
          </div>
          <div className="ce-io-box">
            <label className="ce-io-label">
              <span className="ce-io-arrow">◀</span> stdout
              {status === "success" && <span className="ce-badge success">✓ OK</span>}
              {status === "error" && <span className="ce-badge error">✗ Error</span>}
            </label>
            <textarea
              className={`ce-io-textarea ce-output ${status === "error" ? "ce-output-error" : ""}`}
              placeholder="Output appears here..."
              value={Output}
              readOnly
              rows={4}
            />
          </div>
        </div>

        {/* Action Row */}
        <div className="ce-action-row">
          <div className="ce-verdict-area">
            {status === "accepted" && <span className="ce-verdict accepted">🎉 Accepted</span>}
            {status === "wrong" && <span className="ce-verdict wrong">✗ Wrong Answer</span>}
          </div>
          <div className="ce-btn-group">
            <button className="ce-btn run" onClick={runCode} disabled={isRunning}>
              {isRunning ? <span className="ce-spinner" /> : "▶ Run"}
            </button>
            <button className="ce-btn submit" onClick={submitCode} disabled={isSubmitting}>
              {isSubmitting ? <span className="ce-spinner" /> : "⬆ Submit"}
            </button>
          </div>
        </div>

      </main>
      {showLoginPopup && (
  <div className="ce-popup-overlay" onClick={() => setShowLoginPopup(false)}>
    <div className="ce-popup" onClick={(e) => e.stopPropagation()}>
      <h2 className="ce-popup-title">Login Required</h2>
      <p className="ce-popup-message">You need to be logged in to submit your solution.</p>
      <div className="ce-popup-actions">
        <button className="ce-btn run" onClick={() => setShowLoginPopup(false)}>Cancel</button>
        <button className="ce-btn submit" onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default CodeExecute;