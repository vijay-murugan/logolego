import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./view.css";

function View() {
  const [tweet, setTweet] = React.useState("");
  const [imgId, setImgId] = React.useState("");
  var b = sessionStorage.getItem("value");

  const [data, setData] = useState([]);
  

  

  const display = () => {
    axios
      .get("https://logolego.bookmane.in/api/images/" + b)
      // (`https://logolego.bookmane.in/api/images/${id}`)
      .then((response) => {
        console.log(response);
        setImgId(b);
        setData(response);
      });
  };
  useEffect(() => {
    display();
  }, []);

  var resetValue = "";
  localStorage.setItem("myValue", resetValue);
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />

      <div></div>
      <div id = "contents">
        <center>
          <img id="view_img" src={data.data} />
          <div>
           
          </div>
        </center>
      </div>
    </div>
  );
}

export default View;
