import { useEffect,useState } from "react";
import ProblemCard from "./problemAdminCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProblemAdmin = ()=>{
    const [allProblems,setallProblems] = useState([]);
    const navigate = useNavigate();
const handleEdit = (problem) => {
  navigate("/createNew",{
    state : {problem:problem}
  })
};

const handleDelete = async (id) => {

  const deleteUrl = `http://localhost:3000/problem/${id}`;
  const res = await axios.delete(deleteUrl, { withCredentials: true });
  if(res.status==200){
    const newArr = allProblems.filter(item => item._id !== id);
    setallProblems(newArr);
  }
};

const moveToProblem = (problem)=>{
        navigate("/runCode",{
          state:{problem:problem,"role":"admin"}
        });
    }

const createNew = ()=>{
    navigate("/createNew");
}

useEffect(()=>{
        const getProblems = async ()=>{
        const problemsUrl = "http://localhost:3000/problem"
        const res = await axios.get(problemsUrl,{ withCredentials: true });
        console.log(res.data);
        setallProblems(res.data);}
        getProblems();
    },[])

return (
    <>
    <button className="cn-create-btn" onClick={createNew}>+ Create new</button>
<div className="pcard-grid">
  {allProblems.map((problem) => (
    <ProblemCard
      key={problem._id}
      problem={problem}
      onClick={()=>{moveToProblem(problem)}}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ))}
</div>
</>
)
}

export default ProblemAdmin;