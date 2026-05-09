import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CodeExecute.css";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "./authSlice";

/* ── left panel horizontal drag ── */
function useHorizontalDrag(pageRef, leftPx, setLeftPx) {
  return useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = leftPx ?? (pageRef.current?.offsetWidth * 0.38 ?? 440);
    const onMove = (ev) => {
      const total = pageRef.current?.offsetWidth ?? window.innerWidth;
      setLeftPx(Math.min(total * 0.65, Math.max(total * 0.15, startW + ev.clientX - startX)));
    };
    const onUp = () => window.removeEventListener("mousemove", onMove);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp, { once: true });
  }, [leftPx]);
}

const TABS = [
  { key: "io",     label: "▶ Input / Output" },
  { key: "tests",  label: "⬆ Test Cases"      },
  { key: "ai",     label: "✦ AI Review"        },
];

const CodeExecute = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { slug }     = useParams();

  const [language,       setLanguage]       = useState("python");
  const [problem,        setproblem]        = useState(null);
  const [isloading,      setisloading]      = useState(true);
  const [aiReview,       setAiReview]       = useState("");
  const [isReviewing,    setIsReviewing]    = useState(false);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [submitResult,   setSubmitResult]   = useState(null);
  const [Code, setCode] = useState({
    python:     `print("Hello World!")`,
    java:       `class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    cpp:        `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
    javascript: `console.log("Hello, World!");`,
  });

  const user = useSelector((state) => state.auth.user);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggingOut,   setIsLoggingOut]   = useState(false);
  const [Input,          setInput]          = useState("");
  const [Output,         setOutput]         = useState("");
  const [isRunning,      setIsRunning]      = useState(false);
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [status,         setStatus]         = useState(null);

  /* active tab */
  const [activeTab, setActiveTab] = useState("io");

  /* left panel drag */
  const pageRef  = useRef(null);
  const [leftPx, setLeftPx] = useState(null);
  const onLeftDividerDown = useHorizontalDrag(pageRef, leftPx, setLeftPx);

  useEffect(() => {
    const getProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/problem/${slug}`);
        setproblem(res.data);
        setInput(res.data?.sampleInput || "");
      } catch { setproblem(null); }
      finally  { setisloading(false); }
    };
    getProblem();
  }, []);

  const runCode = async () => {
    setIsRunning(true);
    setStatus(null);
    setActiveTab("io");           // switch to I/O tab
    try {
      const res = await axios.post(
        "http://localhost:3000/code/runcode",
        { language, code: Code[language], sampleInput: Input },
        { withCredentials: true }
      );
      if (res.data.output?.timedout === true) {
  setOutput("Time Limit Exceeded");
  setStatus("tle"); // new status
} else {
  console.log(res)
  setOutput(res.data.output.stdout);
  setStatus("success");
}
    } catch (err) {
      setOutput(err.response.data.error);
      setStatus("error");
    } finally { setIsRunning(false); }
  };

  const submitCode = async () => {
    if (!user) { setShowLoginPopup(true); return; }
    const slug = problem?.slug;
    setIsSubmitting(true);
    setStatus(null);
    setSubmitResult(null);
    setActiveTab("tests");        // switch to Test Cases tab
    try {
      const res = await axios.post(
        "http://localhost:3000/code/submitcode",
        { code: Code[language], language, slug, problemStatement: problem.problemStatement },
        { withCredentials: true }
      );
      const { success, fail, timedout, total } = res.data;
setSubmitResult({ success, fail, timedout, total });
setStatus(fail.length === 0 && timedout.length === 0 ? "accepted" : "wrong");
    } catch (err) {
      console.log(err.message);
      setStatus("error");
    } finally { setIsSubmitting(false); }
  };

  const codeReview = async () => {
    if (!user) { setShowLoginPopup(true); return; }
    setIsReviewing(true);
    setAiReview("");
    setActiveTab("ai");           // switch to AI Review tab
    try {
      const res = await axios.post(
        "http://localhost:3000/ai/codeReview",
        { language, code: Code[language], problemStatement: problem.problemStatement },
        { withCredentials: true }
      );
      setAiReview(res.data.review);
    } catch (err) {
      if (err.response?.status === 429) setShowLimitPopup(true);
      else setAiReview("Failed to get review. Please try again.");
    } finally { setIsReviewing(false); }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
      dispatch(clearUser());
      navigate("/login");
    } catch (err) { console.log("Error while logging out", err); }
    finally { setIsLoggingOut(false); }
  };

  if (isloading) return <div className="ce-not-found">Loading...</div>;
  if (!problem)  return (
    <div className="ce-not-found">
      <h2>Problem Not Found</h2>
      <button className="ce-btn run" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  return (
    <div className="ce-root">

      {/* ── Navbar ── */}
      <nav className="ce-navbar">
        <div className="ce-navbar-brand">
          <span className="ce-navbar-logo">⌥</span>
          <span className="ce-navbar-name">CodeJudge</span>
        </div>
        <div className="ce-navbar-right">
          {user ? (
            <button className="ce-nav-btn ce-nav-btn--logout" onClick={logout} disabled={isLoggingOut}>
              {isLoggingOut
                ? <span className="ce-spinner ce-spinner--dark" />
                : <><span className="ce-nav-btn-icon">⎋</span>Logout</>}
            </button>
          ) : (
            <button className="ce-nav-btn ce-nav-btn--login" onClick={() => navigate('/login')}>
              <span className="ce-nav-btn-icon">→</span>Login
            </button>
          )}
        </div>
      </nav>

      {/* ── Main Layout ── */}
      <div className="ce-page" ref={pageRef}>

        {/* ── Left Panel ── */}
        <aside
          className="ce-problem-panel"
          style={leftPx ? { width: leftPx, minWidth: leftPx, maxWidth: leftPx } : {}}
        >
          <div className="ce-problem-inner">
            <div className="ce-problem-title-row">
              <span className="ce-problem-number">#01</span>
              <h1 className="ce-problem-title">{problem?.title || "Problem Title"}</h1>
            </div>
            <div className="ce-divider" />
            <div className="ce-section">
              <span className="ce-section-label">Problem Statement</span>
              <p className="ce-problem-statement">
                {problem?.problemStatement || "No problem statement provided."}
              </p>
            </div>
            <div className="ce-divider" />
            <div className="ce-section">
              <span className="ce-section-label">
                <span className="ce-label-dot input-dot" /> Sample Input
              </span>
              <textarea className="ce-sample-box" value={problem?.sampleInput || ""} readOnly rows={4} />
            </div>
            <div className="ce-section">
              <span className="ce-section-label">
                <span className="ce-label-dot output-dot" /> Sample Output
              </span>
              <textarea className="ce-sample-box" value={problem?.sampleOutput || ""} readOnly rows={4} />
            </div>
          </div>
        </aside>

        {/* ── Vertical Divider (draggable) ── */}
        <div className="ce-divider-v" onMouseDown={onLeftDividerDown} title="Drag to resize" />

        {/* ── Right Panel ── */}
        <main className="ce-editor-panel">

          {/* Editor Header */}
          <div className="ce-editor-header">
            <div className="ce-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="ce-editor-label">editor</span>
            </div>
            <select className="ce-lang-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
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
              onChange={(val) => setCode({ ...Code, [language]: val })}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "line",
                padding: { top: 16, bottom: 16 },
                scrollbar: { vertical: "auto", horizontal: "auto", alwaysConsumeMouseWheel: false },
              }}
            />
          </div>

          {/* ── Bottom Tabbed Panel ── */}
          <div className="ce-bottom-panel">

            {/* Tab Bar */}
            <div className="ce-tab-bar">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`ce-tab-btn ${activeTab === t.key ? "active" : ""} tab-${t.key}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                  {/* badges */}
                  {t.key === "tests" && isSubmitting && (
                    <span className="ce-tab-spinner"><span className="ce-spinner ce-spinner--tab" /></span>
                  )}
                  {t.key === "tests" && submitResult && !isSubmitting && (
                    <span className={`ce-tab-badge ${submitResult.fail.length === 0 ? "badge-pass" : "badge-fail"}`}>
                      {submitResult.success.length}/{submitResult.total}
                    </span>
                  )}
                  {t.key === "ai" && isReviewing && (
                    <span className="ce-tab-spinner"><span className="ce-spinner ce-spinner--ai" /></span>
                  )}
                  {t.key === "io" && status === "success" && <span className="ce-tab-badge badge-pass">OK</span>}
                  {t.key === "io" && status === "error"   && <span className="ce-tab-badge badge-fail">ERR</span>}
                  {t.key === "io" && status === "tle" && <span className="ce-tab-badge badge-tle">TLE</span>}
                </button>
              ))}

              {/* verdict lives in tab bar right side */}
              <div className="ce-tab-verdict">
                {status === "accepted" && <span className="ce-verdict accepted">🎉 Accepted</span>}
                {status === "wrong"    && <span className="ce-verdict wrong">✗ Wrong Answer</span>}
              </div>
            </div>

            {/* Tab Content */}
            <div className="ce-tab-content">

              {/* I/O */}
              {activeTab === "io" && (
                <div className="ce-io-row">
                  <div className="ce-io-box">
                    <label className="ce-io-label"><span className="ce-io-arrow">▶</span> stdin</label>
                    <textarea
                      className="ce-io-textarea"
                      placeholder="Enter input..."
                      value={Input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>
                  <div className="ce-io-box">
                    <label className="ce-io-label">
                      <span className="ce-io-arrow">◀</span> stdout
                    </label>
                    <textarea
                      className={`ce-io-textarea ce-output ${
  status === "error" ? "ce-output-error" : 
  status === "tle"   ? "ce-output-tle"   : ""
}`}
                      placeholder="Output appears here..."
                      value={Output}
                      readOnly
                    />
                  </div>
                </div>
              )}

              {/* Test Cases */}
              {activeTab === "tests" && (
                <div className="ce-tab-pane">
                  {isSubmitting ? (
                    <div className="ce-pane-placeholder">
                      <span className="ce-spinner ce-spinner--ai" />
                      <span>Running test cases…</span>
                    </div>
                  ) : submitResult ? (
                    <>
                      <div className="ce-submit-summary">
  <span className="ce-submit-stat passed">✓ {submitResult.success.length} passed</span>
  <span className="ce-submit-stat failed">✗ {submitResult.fail.length} failed</span>
  {submitResult.timedout?.length > 0 && (
    <span className="ce-submit-stat timedout">⏱ {submitResult.timedout.length} TLE</span>
  )}
  <span className="ce-submit-stat total">{submitResult.total} total</span>
</div>
                      <div className="ce-testcase-grid">
                        {Array.from({ length: submitResult.total }, (_, i) => {
  const passed = submitResult.success.includes(i);
  const timedout = submitResult.timedout?.includes(i);
  return (
    <div
      key={i}
      className={`ce-testcase-badge ${passed ? "tc-pass" : timedout ? "tc-tle" : "tc-fail"}`}
      title={`Test case ${i + 1}: ${passed ? "Passed" : timedout ? "TLE" : "Failed"}`}
    >
      <span className="tc-icon">{passed ? "✓" : timedout ? "⏱" : "✗"}</span>
      <span className="tc-num">{i + 1}</span>
    </div>
  );
})}
                      </div>
                    </>
                  ) : (
                    <div className="ce-pane-placeholder">
                      Submit your code to see test case results.
                    </div>
                  )}
                </div>
              )}

              {/* AI Review */}
              {activeTab === "ai" && (
                <div className="ce-tab-pane">
                  {isReviewing ? (
                    <div className="ce-pane-placeholder">
                      <span className="ce-spinner ce-spinner--ai" />
                      <span>Reviewing your code…</span>
                    </div>
                  ) : aiReview ? (
                    <textarea className="ce-io-textarea ce-ai-review" value={aiReview} readOnly />
                  ) : (
                    <div className="ce-pane-placeholder">
                      Click <strong>✦ AI Review</strong> to get feedback on your code.
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* ── Action Row ── */}
          <div className="ce-action-row">
            <div className="ce-btn-group">
              <button className="ce-btn run" onClick={runCode} disabled={isRunning}>
                {isRunning ? <span className="ce-spinner" /> : "▶ Run"}
              </button>
              <button className="ce-btn submit" onClick={submitCode} disabled={isSubmitting}>
                {isSubmitting ? <span className="ce-spinner" /> : "⬆ Submit"}
              </button>
              <button
                className={`ce-btn ai ${!user ? "ce-btn-disabled" : ""}`}
                onClick={codeReview}
                disabled={isReviewing || !user}
                title={!user ? "Login to use AI Review" : ""}
              >
                {isReviewing ? <span className="ce-spinner" /> : "✦ AI Review"}
              </button>
            </div>
          </div>

        </main>
      </div>

      {/* ── Popups ── */}
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

      {showLimitPopup && (
        <div className="ce-popup-overlay" onClick={() => setShowLimitPopup(false)}>
          <div className="ce-popup ce-limit-popup" onClick={(e) => e.stopPropagation()}>
            <div className="ce-limit-icon">⚠️</div>
            <h2 className="ce-popup-title">Usage Limit Reached</h2>
            <p className="ce-popup-message">
              You have used all <strong>5 AI reviews</strong> available to you.
            </p>
            <div className="ce-popup-actions">
              <button className="ce-btn submit" onClick={() => setShowLimitPopup(false)}>Got it</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CodeExecute;
