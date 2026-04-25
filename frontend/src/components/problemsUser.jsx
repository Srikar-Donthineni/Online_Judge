import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProblemCard from "./problemCard";

const Problems = ()=>{
    const [problemsArray,setProblemsArray] = useState([]);
    const navigate = useNavigate();
    
    useEffect(()=>{
        const getProblems = async ()=>{
        const problemsUrl = "http://localhost:3000/problem"
        const res = await axios.get(problemsUrl,{ withCredentials: true });
        console.log(res.data);
        setProblemsArray(res.data);}
        getProblems();
    },[])
    const moveToProblem = (problem)=>{
        navigate("/runCode",{
          state:{problem:problem,"role":"user"}
        });
    }
    return (
  <div className="pcard-grid">
    {problemsArray.map((problem) => (
      <ProblemCard
        key={problem._id}
        problem={problem}
        onClick={()=>{moveToProblem(problem)}}
      />
    ))}
  </div>
);
}

export default Problems;