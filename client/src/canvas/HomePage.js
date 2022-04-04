import React, { useState, useEffect } from "react";
//import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Button } from "reactstrap";
import { useParams } from "react-router-dom";
import Dropzone from "react-dropzone";
//import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";
import {
  Image as KonvaImage,
  Stage,
  Layer,
  Image,
  Rect,
  Transformer,
} from "react-konva";
import Rectangle from "./Rectangle";
import Circle from "./Circle";
import { addLine } from "./line";
import { addTextNode } from "./textNode";
import useImage from "use-image";
import { v1 as uuidv1 } from "uuid";
import html2canvas from "html2canvas";

import axios from "axios";
const imageToBase64 = require("image-to-base64");

uuidv1();

const URLImage = ({
  image,
  shapeProps,
  unSelectShape,
  isSelected,
  onSelect,
  onChange,
  stageScale,
  onDelete,
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  const deleteButton = React.useRef();
  const [img] = useImage(image.src);

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const onMouseEnter = (event) => {
    if (isSelected) {
      event.target.getStage().container().style.cursor = "move";
    }
    if (!isSelected) {
      event.target.getStage().container().style.cursor = "pointer";
    }
  };

  const onMouseLeave = (event) => {
    event.target.getStage().container().style.cursor = "default";
  };

  const handleDelete = () => {
    unSelectShape(null);
    onDelete(shapeRef.current);
  };

  return (
    <React.Fragment>
      <Image
        image={img}
        x={image.x}
        y={image.y}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        // I will use offset to set origin to the center of the image
        offsetX={img ? img.width / 2 : 0}
        offsetY={img ? img.height / 2 : 0}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        >
          <Circle
            radius={8}
            fill="red"
            ref={deleteButton}
            onClick={handleDelete}
            x={shapeRef.current.width() * stageScale}
          ></Circle>
        </Transformer>
      )}
    </React.Fragment>
  );
};

function HomePage() {
  const [rectangles, setRectangles] = useState([]);
  const [text, setText] = useState([]);
  const [circles, setCircles] = useState([]);
  const [image, setImage] = useState([]);
  const [selectedId, selectShape] = useState(null);
  const [shapes, setShapes] = React.useState([]);
  const [, updateState] = React.useState();
  const stageEl = React.createRef();
  const layerEl = React.createRef();
  const [name, setName] = React.useState("");
  const [name2, setName2] = React.useState("");
  const dragUrl = React.useRef();
  const [images, setImages] = React.useState([]);

  const [imageList, setImageList] = React.useState([]);
  const [dispImg, setDispImg] = React.useState([]);
  const [tweet, setTweet] = React.useState("");
  const [prevLink, setPrevLink] = React.useState("");
  const [tweetLink, setTweetLink] = React.useState("");

  const [isToggled, setIsToggled] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [canvasShow, setCanvasShow] = React.useState(false);
  const [btnShow, setBtnShow] = React.useState(true);
  const [btnHide, setBtnHide] = React.useState(false);
  const [prevHide, setPrevHide] = React.useState(false);

  const [editShow, setEditShow] = React.useState(false);
  const [check, setCheck] = React.useState(false);
  const [val, setVal] = React.useState([""]);
  const [val2, setVal2] = React.useState([""]);
  const [draw, setDraw] = useState(true);
  // const [notfound, setNotfound] = useState("  ")
  const [tmp, setTmp] = useState("");
  const [tmp2, setTmp2] = useState("");
  const [stageSpec, setStageSpec] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  const handleRemove = (index) => {
    const newList = images.filter((item) => item.index !== index);

    setImages(newList);
  };

  // const checkDeselect = (e) => {
  //   // deselect when clicked on empty area
  //   const clickedOnEmpty = e.target === e.target.getStage();
  //   if (clickedOnEmpty) {
  //     selectShape(null);
  //   }
  // };

  const unSelectShape = (prop) => {
    selectShape(prop);
  };

  const onDeleteImage = (node) => {
    const newImages = [...images];
    newImages.splice(node.index, 1);
    setImages(newImages);
  };

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  function editfn() {
    setShow(false);
    setPrevHide(true);
    setEditShow(false);
  }
  const getBase64Image2 = (url) => {
    const varimg2 = document.createElement("img"); //new Image();
    varimg2.setAttribute("crossOrigin", "anonymous");
    varimg2.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = varimg2.width;
      canvas.height = varimg2.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(varimg2, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      // console.log("dataurl = ",dataURL)
      setVal2(dataURL);
    };
    varimg2.src = url;
    // console.log("conso",val)
    return val2;
  }; //hello
  const getBase64Image = (url) => {
    const varimg = document.createElement("img"); //new Image();
    varimg.setAttribute("crossOrigin", "anonymous");
    varimg.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = varimg.width;
      canvas.height = varimg.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(varimg, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      // console.log("dataurl = ",dataURL)
      setVal(dataURL);
    };
    varimg.src = url;

    return val;
  };

  function refreshPage() {
    window.location.reload(false);
  }

  function hideImage() {
    var img = document.getElementById("logo");
    img.style.visibility = "hidden";
  }
  function showImage() {
    var img = document.getElementById("logo");
    img.style.visibility = "visible";
  }
  async function getBase64(file) {
    let result_base64 = await new Promise((resolve) => {
      let reader = new FileReader();
      reader.onload = (e) => resolve(reader.result);

      reader.readAsDataURL(file);
    });

    return result_base64;
  }
  //for saving as a screenshot
  const takeshot = async () => {
    let div = await document.getElementById("canvass");
    html2canvas(div, {
      allowTaint: true,
      foreignObjectRendering: true,
      useCORS: true,
    }).then(function (canvas) {
      document.getElementById("output").appendChild(canvas);
    });
  };

  function gotFile(file) {
    Dropzone.style("display", "none");

    if (file.type === "image") {
      var image = new Image();

      image.onload = function () {
        document.body.appendChild(this);
      };

      image.src = file.data;
    }
  }

  const conveImg = (dataURL) => {
    const payload = {
      img: dataURL,
    };
    fetch("https://logolego.bookmane.in/api/tmp", {
      // fetch("http://localhost:5000/api/tmp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json();
      })
      .then((res) => {
        if (res.key == "Not Found") {
          setTmp(null);
        } else if (res.key === "Search") {
          setTmp(null);
        } else {
          setTmp(res.key);
        }
      });
  };

  const conveImgURL = (dataURL) => {
    const payload = {
      img: dataURL,
    };
    // fetch("http://localhost:5000/api/tmp/url", {
    fetch("https://logolego.bookmane.in/api/tmp/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json();
      })
      .then((res) => {
        if (res.key == "Not Found") {
          setTmp2(null);
        } else if (res.key === "Search") {
          setTmp2(null);
        } else {
          setTmp2(res.key);
        }
      });
  };

  function setImageVisible(id, visible) {
    var img = document.getElementById(id);
    img.style.visibility = visible ? "visible" : "hidden";
  }

  const handleChange = (value) => {
    if (value != null) {
      conveImg(value);
      conveImgURL(value);
    }
    showImage();
  };

  const divRef = React.useRef();

  const display = () => {
    // const dataURL = stageEl ? stageEl.current.getStage().toDataURL() : null;

    // const payload = {
    //   img: dataURL,
    // };
    // // console.log(JSON.stringify(payload))

    // //data.append("json", JSON.stringify(payload))
    // // fetch("http://localhost:5000/api/tmp/save", {
    // fetch("https://logolego.bookmane.in/api/save", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(payload),
    // })
    //   .then(function (res) {
    //     return res.json();
    //   })
    //   .then((res) => {
    //     setPrevLink(res);

    //     sessionStorage.setItem("value", res);

    //     window.location = ('http://localhost:3000/view')
    //   });
    sessionStorage.setItem("value", tweetLink);
    // window.open('http://localhost:3000/view', "_blank")
    window.open(`https://logolego.bookmane.in/images/${tweetLink}`, "_blank");
    // window.open("https://logolego.bookmane.in/view", "_blank");
    // window.open(`http://localhost:3000/images/${tweetLink}`, "_blank")

    // window.location = ('http://localhost:3000/view')
  };
  var x = 1;
  const erase = () => {
    setDispImg(null);
    setShow(false);
    setCanvasShow(true);
    setPrevHide(true);
    setBtnHide(true);
  };

  const showCanvas = () => {
    setCanvasShow(true);
    setBtnHide(true);
    setBtnShow(false);
    setPrevHide(true);

    setCheck(true);
  };

  const hideCanvas = () => {
    setCanvasShow(false);
    setBtnHide(false);
    setBtnShow(true);
    setPrevHide(false);
  };

  const preview = () => {
    const dataURL = stageEl ? stageEl.current.getStage().toDataURL() : null;

    // var link = document.createElement("a");
    // link.href = dataURL;

    display(); // saves to db

    // setDispImg(link.href);
    // // setImageVisible("img3",false);
    // setShow(true);
    // setCanvasShow(false);
    // setPrevHide(false);
    // setBtnHide(false);
    // clearFields();
  };

  function clearFields() {
    document.getElementById("myInput").value = " ";
    // document.getElementById("myInput").value = "";
    // document.getElementById("").value = "";
  }

  const download = () => {
    //get stage dataUrl
    const dataURL = stageEl ? stageEl.current.getStage().toDataURL() : null;
    var link = document.createElement("a");
    link.download = "react-generator";
    link.href = dataURL;
    document.body.appendChild(link);
    // link.click();
    document.body.removeChild(link);
  };

  const addImage = () => {
    stageEl.current.setPointersPositions();
    // add image

    const imgs = images.concat([
      {
        ...stageEl.current.getRelativePointerPosition(),
        src: dragUrl.current,
        id: `imag${images.length + 1}`,
      },
    ]);

    setImages(imgs);
    const shs = shapes.concat([`imag${images.length + 1}`]);
    setShapes(shs);
  };

  //adding rectangles
  const addRectangle = () => {
    const rect = {
      x: getRandomInt(100),
      y: getRandomInt(100),
      width: 100,
      height: 100,
      strokeWidth: 3, // border width
      stroke: "black",
      // fill: "black",
      id: `rect${rectangles.length + 1}`,
    };
    const rects = rectangles.concat([rect]);
    setRectangles(rects);
    const shs = shapes.concat([`rect${rectangles.length + 1}`]);
    setShapes(shs);
    console.log(
      "is",
      rectangles.findIndex((x) => x.id)
    );
  };

  const addCircle = () => {
    const circ = {
      x: getRandomInt(100),
      y: getRandomInt(100),
      width: 100,
      height: 100,
      strokeWidth: 3, // border width
      stroke: "black",
      //fill: "black",
      id: `circ${circles.length + 1}`,
    };
    const circs = circles.concat([circ]);
    setCircles(circs);
    const shs = shapes.concat([`circ${circles.length + 1}`]);
    setShapes(shs);
  };
  const drawLine = () => {
    if (draw) addLine(stageEl.current.getStage(), layerEl.current, "brush");
  };
  const eraseLine = () => {
    addLine(stageEl.current.getStage(), layerEl.current, "erase");
  };
  const doNothing = () => {
    addLine(stageEl.current.getStage(), layerEl.current, "none");
  };
  const drawText = () => {
    const id = addTextNode(stageEl.current.getStage(), layerEl.current);
    const shs = shapes.concat([id]);
    setShapes(shs);
  };

  const forceUpdate = React.useCallback(() => updateState({}), []);

  const undo = () => {
    const lastId = shapes[shapes.length - 1];

    let index = circles.findIndex((c) => c.id === lastId);
    if (index !== -1) {
      circles.splice(index, 1);
      setCircles(circles);
    }
    index = rectangles.findIndex((r) => r.id === lastId);

    if (index !== -1) {
      rectangles.splice(index, 1);
      setRectangles(rectangles);
    }

    index = images.findIndex((x) => x.id === lastId);

    // index = images.length - 1;
    if (index !== -1) {
      images.splice(index, 1);
      setImages(images);
    }
    shapes.pop();
    setShapes(shapes);
    forceUpdate();
  };

  const tweetdb = () => {
    const dataURL = stageEl ? stageEl.current.getStage().toDataURL() : null;

    const payload = {
      img: dataURL,
    };
    console.log(dataURL)
    fetch("http://localhost:5000/api/save", {
    // fetch("https://logolego.bookmane.in/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json();
      })
      .then((res) => {
        setTweetLink(res);
      });
  };

  const tweetfn = () => {
    tweetdb();
    setShow(true);
    setEditShow(true);
    setPrevHide(false);
  };

  const undoImage = () => {
    let index = images.length - 1;
    console.log("ind-", index);
    if (index !== -1) {
      console.log("len -", index);
      //  const newImages = [...images];
      images.splice(index, 1);
      setImages(images);
    }
    // shapes.pop();
    // setShapes(shapes);
    forceUpdate();
  };

  document.addEventListener("keydown", (ev) => {
    if (ev.code === "Delete") {
      let index = circles.findIndex((c) => c.id === selectedId);
      if (index !== -1) {
        circles.splice(index, 1);
        setCircles(circles);
      }
      index = rectangles.findIndex((r) => r.id === selectedId);
      if (index !== -1) {
        rectangles.splice(index, 1);
        setRectangles(rectangles);
      }
      index = images.findIndex((i) => i.id === selectedId.id);
      console.log(index)
      if (index !== -1) {
        images.splice(index, 1);
        setImages(images);
      }

      forceUpdate();
    }
  });

  const handleClick = () => {
    handleChange(document.getElementById("myInput").value);
  };

  const loadFn = () => {
    showCanvas();
  };

  return (
    <div className="home-page">
      {/* For the icon components  */}

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
      {/* <div id="yt-video">
        <center>
          <iframe
            src="https://www.youtube.com/embed/E7wJTI-1dvQ"
            frameBorder="2"
            margin-top-height="50"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="video"
            width="600"
            height="300"
          />
        </center>
      </div> */}
      <center>
        <div id="input-area">
          {/* <textarea */}
          <input
            type="text"
            autoComplete="off"
            placeholder="Search for the required logo"
            id="myInput"
            // name="name"

            onChange={(event) => handleChange(event.target.value)}
          />

          {/* <Button color="primary" id="search-btn" onClick = {handleClick}>Search</Button> */}
        </div>
        {btnShow ? (
          <Button
            color="primary"
            id="canvas-show-btn"
            onClick={showCanvas}
            title="Show Canvas"
          >
            Show Canvas
          </Button>
        ) : null}
      </center>
      <div></div>
      {}
      <center></center>
      <center>
        <img
          key="img3"
          id="logo"
          src={tmp}
          onLoad={loadFn}
          draggable="true"
          onDragStart={(e) => {
            dragUrl.current = e.target.src;
          }}
        />
        <img
          key="img3"
          id="logo"
          src={tmp2}
          onLoad={loadFn}
          draggable="true"
          onDragStart={(e) => {
            dragUrl.current = e.target.src;
          }}
        />

        {/* <img
          src={getBase64Image2(name2)} //name}
          draggable="true"
          onDragStart={(e) => {
            dragUrl.current = e.target.src;
          }}
        /> */}
      </center>

      {btnHide ? (
        <Button
          color="primary"
          id="canvas-hide-btn"
          onClick={hideCanvas}
          title="Close"
        >
          <i class="fa-solid fa-xmark"></i>
        </Button>
      ) : null}

      <div></div>

      <div className="container">
        {canvasShow ? (
          <div id="bts" role="group" aria-label="Basic example">
            <div></div>
            <Button color="primary" onClick={addRectangle} title="Square">
              <i class="fa-regular fa-square"></i>
            </Button>
            <Button color="primary" onClick={addCircle} title="Circle">
              <i class="fa-regular fa-circle"></i>
            </Button>
            <Button color="primary" onClick={drawLine} title="Pen">
              <i class="fa-solid fa-pencil"></i>
            </Button>

            <Button color="primary" onClick={eraseLine} title="Eraser">
              <i class="fa-solid fa-eraser"></i>
            </Button>

            <Button color="primary" onClick={drawText} title="Text">
              <i class="fa-solid fa-font"></i>
            </Button>

            <Button color="primary" onClick={undo} title="Undo Shape">
              <i class="fa-solid fa-delete-left"></i>
            </Button>

            <Button color="primary" onClick={doNothing} title="Pointer">
              <i class="fas fa-mouse-pointer"></i>
            </Button>
            <Button color="primary" onClick={refreshPage} title="Clear">
              Clear
            </Button>

            {isToggled}
          </div>
        ) : null}
        {imageList.map((item) => {
          return (
            <img
              src={item}
              draggable="true"
              onDragStart={(e) => {
                dragUrl.current = item;
              }}
            />
          );
        })}
        <div
          onDrop={(e) => {
            e.preventDefault();
            addImage();
            // register event position
            // stageEl.current.setPointersPositions(e);
            // // add image
            // const imag = {
            //   x: getRandomInt(100),
            //   y: getRandomInt(100),
            //   width: 100,
            //   height: 100,
            //   strokeWidth: 3, // border width
            //   id: `imag${images.length + 1}`,
            // };

            // const imgs =  images.concat([
            //   {
            //     ...stageEl.current.getRelativePointerPosition(),
            //     src: dragUrl.current,
            //   },
            // ])

            // setImages(imgs
            //   // images.concat([
            //   //   {
            //   //     ...stageEl.current.getRelativePointerPosition(),
            //   //     src: dragUrl.current,
            //   //   },
            //   // ])
            // );
            // const shs = shapes.concat([`imag${images.length + 1}`]);
            // setShapes(shs);
            // console.log("ids", images.findIndex((x) =>x.id));
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {canvasShow ? (
            <div id="child-canvas">
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  // register event position

                  addImage();
                  // stageEl.current.setPointersPositions(e);
                  // // add image
                  // setImages(
                  //   images.concat([
                  //     {
                  //       ...stageEl.current.getRelativePointerPosition(),
                  //       src: dragUrl.current,
                  //     },
                  //   ])
                  // );
                }}
                onDragOver={(e) => e.preventDefault()}
              ></div>

              <Stage
                style={{
                  border: "1px solid grey",
                  width: "1080px",
                  height: "640px",
                  position: "relative",
                  left: "10px",
                  bottom: "20px",
                  top: "5px",
                  background: "#f4f7f6",
                }}
                width={window.innerWidth * 0.7}
                height={window.innerHeight - 108}
                ref={stageEl} //,stageRef}
                onMouseDown={(e) => {
                  // deselect when clicked on empty area
                  const clickedOnEmpty = e.target === e.target.getStage();
                  if (clickedOnEmpty) {
                    selectShape(null);
                  }
                }}
              >
                <Layer ref={layerEl}>
                  {images.map((image, index) => {
                    return (
                      <URLImage
                        image={image}
                        key={index}
                        shapeProps={image}
                        stageScale={stageSpec.scale}
                        isSelected={image === selectedId}
                        unSelectShape={unSelectShape}
                        onClick={handleRemove}
                        onSelect={() => {
                          selectShape(image);
                        }}
                        onChange={(newAttrs) => {
                          const rects = images.slice();
                          rects[index] = newAttrs;
                          setImages(rects);
                        }}
                        onDelete={onDeleteImage}
                      />
                    );
                  })}
                  {rectangles.map((rect, i) => {
                    return (
                      <Rectangle
                        key={i}
                        shapeProps={rect}
                        isSelected={rect.id === selectedId}
                        onSelect={() => {
                          selectShape(rect.id);
                        }}
                        onChange={(newAttrs) => {
                          const rects = rectangles.slice();
                          rects[i] = newAttrs;
                          setRectangles(rects);
                        }}
                      />
                    );
                  })}

                  {circles.map((circle, i) => {
                    return (
                      <Circle
                        key={i}
                        shapeProps={circle}
                        isSelected={circle.id === selectedId}
                        onSelect={() => {
                          selectShape(circle.id);
                        }}
                        onChange={(newAttrs) => {
                          const circs = circles.slice();
                          circs[i] = newAttrs;
                          setCircles(circs);
                        }}
                      />
                    );
                  })}
                </Layer>
              </Stage>
              <div id="done-edit" role="group" aria-label="Basic example">
                {prevHide ? (
                  <Button
                    color="primary"
                    onClick={tweetfn}
                    title="Done"
                    id="done-btn"
                  >
                    <i class="fa-solid fa-check"></i>
                  </Button>
                ) : null}
                {show ? (
                  <Button
                    color="primary"
                    onClick={preview}
                    title="Preview"
                    id="preview-btn"
                  >
                    {/* <i class="fa-solid fa-file-image"></i> */}
                    <i class="fa-solid fa-image"></i>
                  </Button>
                ) : null}
                {editShow ? (
                  <Button
                    color="primary"
                    onClick={editfn}
                    title="Edit"
                    id="edit-btn"
                  >
                    <i class="fas fa-edit"></i>
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}

          <div>
            {show ? (
              <input
                type="text"
                id="tweet-textbox"
                value={tweet}
                autoComplete="off"
                placeholder="Your tweet text goes here"
                onChange={(e) => setTweet(e.target.value)}
              />
            ) : null}
            {show ? (
              <a
                id="twitter-share-button"
                title="Tweet"
                href={`https://twitter.com/intent/tweet?text=${tweet}&url=https://logolego.bookmane.in/images/${tweetLink}`}
                // href={`https://twitter.com/intent/tweet?text=${tweet}&url=https://logolego.bookmane.in/view/${tweetLink}`}
                data-size="large"
                target="_blank"
              >
                Tweet
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
