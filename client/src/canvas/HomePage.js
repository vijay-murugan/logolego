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
  const [circles, setCircles] = useState([]);
  const [selectedId, selectShape] = useState(null);
  const [shapes, setShapes] = React.useState([]);
  const [, updateState] = React.useState();
  const stageEl = React.createRef();
  const layerEl = React.createRef();
  const [name, setName] = React.useState("");
  const [name2, setName2] = React.useState("");
  const dragUrl = React.useRef();
  const [images, setImages] = React.useState([]);

  let y;
  const [imageList, setImageList] = React.useState([]);
  const [dispImg, setDispImg] = React.useState([]);
  const [dispLogo, setDispLogo] = React.useState([]);
  const [tweet, setTweet] = React.useState("");
  const [prevLink, setPrevLink] = React.useState("");
  const [isToggled, setIsToggled] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [canvasShow, setCanvasShow] = React.useState(false);
  const [btnShow, setBtnShow] = React.useState(true);
  const [btnHide, setBtnHide] = React.useState(false);
  const [prevHide, setPrevHide] = React.useState(false);
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
  let { id } = useParams();
  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

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
    console.log("base64 = ", val);
    return val;
  };

  function refreshPage() {
    window.location.reload(false);
  }

  async function getBase64(file) {
    let result_base64 = await new Promise((resolve) => {
      let reader = new FileReader();
      reader.onload = (e) => resolve(reader.result);

      reader.readAsDataURL(file);
    });
    console.log(result_base64);
    return result_base64;
  }

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
  // const dis = () => {

  //   axios.get(`http://localhost:5000/images/${tmp}`).then((response)=> {
  //   // setLink(response)
  //   console.log("response = ",response)
  // });
  // }
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
          // console.log("nahi mila");
          // setNotfound("Logo not found")
          setTmp(null);
        } else if (res.key === "Search") {
          // setNotfound("Search for imager")
          setTmp(null);
        } else {
          setTmp(res.key);
          console.log("res = ", res.key);
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
          // console.log("nahi mila");
          // setNotfound("Logo not found")
          setTmp2(null);
        } else if (res.key === "Search") {
          // setNotfound("Search for imager")
          setTmp2(null);
        } else {
          setTmp2(res.key);
          console.log("res = ", res.key);
        }
      });
  };


  const handleChange = (value) => {
    // setName(
    //   "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www." +
    //     "https://www.google.com/s2/favicons?sz=128&domain_url=http://www." +
    //     value +
    //     ".com&size=128"
    //   "  https://icons.duckduckgo.com/ip3/www.google.com.ico"
    // );
    // setName2(
      // "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" +
      //   value +
      //   "&size=128"
    // );

    if (value != null){ 
      conveImg(value);
      conveImgURL(value)}
  };

  const display = () => {
    const dataURL = stageEl ? stageEl.current.getStage().toDataURL() : null;

    const payload = {
      img: dataURL,
    };
    // console.log(JSON.stringify(payload))

    //data.append("json", JSON.stringify(payload))
    // fetch("http://localhost:5000/api/tmp/save", {
      fetch("https://logolego.bookmane.in/api/save", {
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
        setPrevLink(res);
        console.log(res);
      });
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
  };

  const hideCanvas = () => {
    setCanvasShow(false);
    setBtnHide(false);
    setBtnShow(true);
    setPrevHide(false);
  };

  const preview = () => {
    const dataURL = stageEl ? stageEl.current.getStage().toDataURL() : null;
    console.log("dataurl=", dataURL);
    var link = document.createElement("a");
    link.href = dataURL;

    display(); // saves to db
    setDispImg(link.href);

    setShow(true);
    setCanvasShow(false);
    setPrevHide(false);
    setBtnHide(false);
  };
  //end
  const download = () => {
    //get stage dataUrl
    const dataURL = stageEl ? stageEl.current.getStage().toDataURL() : null;
    var link = document.createElement("a");
    link.download = "react-generator";
    link.href = dataURL;
    document.body.appendChild(link);
    // link.click();
    document.body.removeChild(link);
    console.log(link.href);
  };

  //tried background here
  const addBG = () => {
    const rect = {
      x: getRandomInt(100),
      y: getRandomInt(100),
      width: 100,
      height: 100,
      strokeWidth: 3, // border width
      stroke: "black",
      fill: "white",
      id: `rect${rectangles.length + 1}`,
    };
    const rects = rectangles.concat([rect]);
    setRectangles(rects);
    const shs = shapes.concat([`rect${rectangles.length + 1}`]);
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
    // setDraw(false)
    // console.log(draw)
    // nothing(stageEl.current.getStage(), layerEl.current);
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
    // index = images.findIndex((i) => i.id === lastId);
    // console.log('ind-',index)
    // if(index !== -1) {
    //   index = images.length-1
    //   console.log("len -",index)
    // //  const newImages = [...images];
    // images.splice(index, 1);
    // setImages(images);
    // }
    shapes.pop();
    setShapes(shapes);
    forceUpdate();
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
      index = images.findIndex((i) => i.id === selectedId);
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
          <textarea
            autoComplete="off"
            placeholder="Search for the required logo"
            id="myInput"
            name="name"
            className="textzone"
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
      <center>
        
      </center>
      <center>
        {/* <img
          id="logo"
          // src = {name}
          src={tmp}
          onLoad={loadFn}
          // width = "60px"
          // height = "60px"
          //  src={getBase64Image(name)} //name}
          // src = 'http://localhost:3000/images/6210893e5d0d95247d43f9d3'//{getBase64Image('http://localhost:3000/images/6210893e5d0d95247d43f9d3')}
          draggable="true"
          onDragStart={(e) => {
            dragUrl.current = e.target.src;
           
          }}
         
        /> */}
        <img
          // alt = {notfound}
          // height="50rem"
          //     width="50rem"
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
          // alt = {notfound}
          // height="50rem"
          //     width="50rem"
          key="img3"
          id="logo"
          src={tmp2}
          onLoad={loadFn}
          draggable="true"
          onDragStart={(e) => {
            dragUrl.current = e.target.src;
          }}
        />

        {/* <div
            onDrop={(e) => {
              e.preventDefault();
              // register event position
              stageEl.current.setPointersPositions(e);
              // add image
              setImages(
                images.concat([
                  {
                    ...stageEl.current.getRelativePointerPosition(),
                    src: dragUrl.current
                  }
                ])
              );
            }}
            onDragOver={(e) => e.preventDefault()}
          ></div> */}
        <img
          src={getBase64Image2(name2)} //name}
          draggable="true"
          onDragStart={(e) => {
            dragUrl.current = e.target.src;
          }}
        />
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
          <div className="bts" role="group" aria-label="Basic example">
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
            {/* <Button color="primary" onClick={download} title="download">
              Export
            </Button> */}
            <Button color="primary" onClick={undoImage} title="Undo Image">
              <i class="fa fa-undo" aria-hidden="true"></i>
            </Button>
            <Button color="primary" onClick={doNothing} title="Pointer">
              <i class="fas fa-mouse-pointer"></i>
            </Button>
            {/* <Button color="primary" onClick={display}>
                Save to db
              </Button> */}

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
            // register event position
            stageEl.current.setPointersPositions(e);
            // add image

            setImages(
              images.concat([
                {
                  ...stageEl.current.getRelativePointerPosition(),
                  src: dragUrl.current,
                },
              ])
            );
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {canvasShow ? (
            <div id="child-canvas">
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  // register event position
                  stageEl.current.setPointersPositions(e);
                  // add image
                  setImages(
                    images.concat([
                      {
                        ...stageEl.current.getRelativePointerPosition(),
                        src: dragUrl.current,
                      },
                    ])
                  );
                }}
                onDragOver={(e) => e.preventDefault()}
              ></div>
              <Stage
                style={{
                  border: "1px solid grey",
                  width: "1250px",
                  position: "relative",
                  left: "10px",
                  bottom: "20px",
                  top: "5px",
                  background: "#f4f7f6",
                }}
                width={window.innerWidth * 0.775}
                height={window.innerHeight - 150}
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
                  {/* {images.map((image) => {
                    return <URLImage image={image} />;
                  })} */}
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
                  {images.map((image, i) => {
                    return (
                      <Image
                        key={i}
                        imageUrl={image.content}
                        isSelected={image.id === selectedId}
                        onSelect={() => {
                          selectShape(image.id);
                        }}
                        onChange={(newAttrs) => {
                          const imgs = images.slice();
                          imgs[i] = newAttrs;
                        }}
                      />
                    );
                  })}
                </Layer>
              </Stage>
            </div>
          ) : null}

          {prevHide ? (
            <Button
              color="primary"
              onClick={preview}
              title="Preview"
              id="preview-btn"
            >
              <i class="fas fa-arrow-right"></i>
            </Button>
          ) : null}

          {show ? (
            <button
              type="button"
              id="reset-btn"
              class="btn btn-primary"
              onClick={erase}
            >
              Reset
            </button>
          ) : null}
          <div className="child-preview" id="preview">
            <img id="preview-image" src={dispImg} width="1000"></img>

            <div className="tweet-text" id="textbox-chars">
              {show ? (
                <textarea
                  className="tweet-text-area"
                  value={tweet}
                  onChange={(e) => setTweet(e.target.value)}
                />
              ) : null}
              {/* <link rel="canonical" href="/web/tweet-button"></link> */}
              {show ? (
                <a
                  class="twitter-share-button"
                  href={`https://twitter.com/intent/tweet?text=${tweet}&url=https://logolego.bookmane.in/images/${prevLink}`}
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
    </div>
  );
}
export default HomePage;
