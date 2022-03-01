import React, { useEffect, useState } from "react";
import axios from "axios";

async function getBase64(file) {
  let result_base64 = await new Promise((resolve) => {
    let reader = new FileReader();
    reader.onload = (e) => resolve(reader.result);
    reader.readAsDataURL(file);
  });
  // console.log(result_base64);
  return result_base64;
}

function Test() {
  useEffect(() => {
    fetchItems();
  }, []);

  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const { data } = await axios.get("http://localhost:5000/");
    setItems(data);
  };

  return (
    <section>
      {items.map((item) => (
        <div>
           <img src={item.img}></img>
        </div>
      ))}
    </section>
  );
}

export default Test;
