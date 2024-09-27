
import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"


function App() {
  const [users, setusers] = useState([]);
  const [filteredsearch, setfilteredsearch] = useState([]);
  const [ismodelopen,setismodelopen]=useState(false);
  const [userdata,setuserdata]=useState({name:"",age:"",city:""})
  const getusers = async () => {
    await axios.get("http://localhost:8000/users").then
      ((res) => {
        console.log(res.data);
        setfilteredsearch(res.data);
        setusers(res.data);
      });

  };

  useEffect(() => {
    getusers();

  }, []);

  const handledelete = async (id) => {

    let isconfirmed = window.confirm(`Are you sure you want to delete this record ?`);
    {
      isconfirmed &&
        await axios.delete(`http://localhost:8000/users/${id}`).then
          ((res) => {
            setusers(res.data);
            setfilteredsearch(res.data);
          })
    }
  }
  const showaddrecord=()=>{
    setuserdata({name:"",age:"",city:""})
    setismodelopen(true);

  }

  const handledata=(e)=>{
   
    setuserdata({...userdata,[e.target.name]:e.target.value})
}
const handleclose=()=>{
  setismodelopen(false);
  getusers();

}

const handlesubmit=async(e)=>{
  e.preventDefault();

  if(userdata.id){
    await axios.patch(`http://localhost:8000/users/${userdata.id}`,userdata).then
    ((res)=>{
      setusers(res.data);
      setfilteredsearch(res.data);
     
    })

  }
  else{
    await axios.post("http://localhost:8000/users",userdata).then
    ((res)=>{
      setusers(res.data);
      setfilteredsearch(res.data);
      
    })
    alert("Data Added Successfully");

  }
 /*  handleclose(); */
 


}


const handleedit=async(user)=>{
  setuserdata(user);
  setismodelopen(true);

}

const handlesearch=(e)=>{
      let searchtext=e.target.value;
      let filtered=users.filter((user) => (user.name.toLowerCase()).includes(searchtext.toLowerCase())
      || (user.city.toLowerCase()).includes(searchtext.toLowerCase()))
    setfilteredsearch(filtered);
    

}





  return (
    <>
      <div className="container">
        <h1>CRUD list</h1>
        <div className="inputdiv">
          <input type="search" placeholder="Search text here"  onChange={handlesearch}></input>
          <button onClick={showaddrecord}>Add</button>
        </div>

        <table className="tablediv">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>

            </tr>
          </thead>
          <tbody>
            {filteredsearch
              .map((user,index) => {
                return (


                  <tr>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.city}</td>
                    <td><button className="btn green" onClick={()=>handleedit(user)}>Edit</button></td>
                    <td><button className="btn red" onClick={() => handledelete(user.id)}>Delete</button></td>


                  </tr>

                );
              })}
                {ismodelopen && 

<div className='model'>
  <div className='modelcontent'>
    {userdata.id ? <h2>Update Record</h2> : <h2>Add Record</h2>}
    <span className='close' onClick={handleclose}>X</span>
    <div className='inputgroup'>
      <label>Enter name</label>
      <input  type="text"value={userdata.name} name="name"onChange={handledata}></input>
    </div>
    <div className='inputgroup'>
      <label>Enter Age</label>
      <input  type="number"value={userdata.age} name="age"onChange={handledata}></input>
    </div>
    <div className='inputgroup'>
      <label>Enter City</label>
      <input  type="text"value={userdata.city}name="city"onChange={handledata}></input>
    </div>

    {userdata.id ?  <button onClick={handlesubmit}>Update</button>: <button onClick={handlesubmit}>Add</button>}
 
  </div>
</div>

}


          </tbody>

        </table>
      </div>
    </>
  )
}

export default App
