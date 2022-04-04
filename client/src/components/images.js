import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "reactstrap";
import "./images.css";

const Images = () => {
  let { id } = useParams();
  const [comments, setComments] = React.useState([]);

  const [data, setData] = useState([]);
  const display = () => {
    // axios.get(`https://logolego.bookmane.in/api/images/${id}`).then((response)=> {
    axios.get(`http://localhost:5000/api/images/${id}`).then((response) => {
      // console.log(response.data);
      setData(response.data);
      setComments((comm) => [...response.data.comments]);
      // console.log("comments",response.data.comments);
      console.log(response.data.comments);
    });
  };

  const commentDisplay = () => {
    // fetch(`http://localhost:5000/api/images/${id}`, {
      fetch(`https://logolego.bookmane.in/api/images/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(function (res) {
      console.log("asfd", res.json());
      return res.json();
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    var nm = document.getElementById("name").value;
    var body = document.getElementById("body").value;
    const payload = {
      comment: {
        name: nm,
        body: body,
      },
    };
    // console.log(payload);
    // fetch(`http://localhost:5000/api/update/${id}`, {
      fetch(`https://logolego.bookmane.in/api/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(function (res) {
      return res.json();
    });
    window.location.reload();
    // document.getElementById("name").value = "";
    // document.getElementById("body").value = "";
  };

  useEffect(() => {
    // commentDisplay();
    display();
  }, []);
  const items = comments.map((items) => (
    <p>
      {" "}
      <label for="name">
        <span>Name:{items.name} </span>
      
      <label for="body">
        Comment: {items.body}
      </label>
      </label>
    </p>
  ));
  return (
    <div>
      <div></div>
      <div id="content">
        <center>
          <img id="view_img" src={data.img} />
        </center>
      </div>
      {items}
      <div id="comments">
        <form>
          <input
            type="text"
            class="question"
            id="name"
            required
            autocomplete="off"
          />
          <label for="name">
            <span>What's your name?</span>
          </label>
          <input
            type="text"
            name="message"
            rows="2"
            class="question"
            id="body"
            required
            autocomplete="off"
          ></input>
          <label for="body">
            <span>What's your comment?</span>
          </label>
          {/* <input type="text" id="name" placeholder="Type your name here"/>
        <textarea id="body"  placeholder="Type your comment here"/> */}
          <div>
            <p></p>
          </div>
          <Button color="primary" onClick={handleSubmit}>
            Comment
          </Button>
        </form>
      </div>
    </div>
  );
};
export default Images;
