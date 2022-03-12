import React , {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios"

const Images = () => {
  let {id} = useParams();
 
  const [data,setData]=useState([]);
  const display = () => {

  axios.get(`http://localhost:5000/api/images/${id}`).then((response)=> {         
    console.log(response)
  setData(response)
});
  }
  useEffect(()=>{
    display()
  },[])
  return (
    <div>
    <img src = {data.data}/>
    </div>
  )
}
export default Images;
