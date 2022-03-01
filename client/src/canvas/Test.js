import React, { useState, useCallback } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Button } from "reactstrap";

import Dropzone from "react-dropzone";

import {DragAndDrop} from "react-file-drop"

import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";
import { Stage, Layer, Image } from "react-konva";
import Rectangle from "./Rectangle";
import Circle from "./Circle";
import { addLine } from "./line";
import { addTextNode } from "./textNode";
import useImage from "use-image";
import { v1 as uuidv1 } from "uuid";
import html2canvas from "html2canvas";

uuidv1();
//https://www.google.com/s2/favicons?sz=128&domain_url=yahoo.com
//https://www.google.com/s2/favicons?sz=64&domain_url=microsoft.com
//Image drag drop with URLImage
const URLImage = ({ image }) => {
  const [img] = useImage(image.src);
  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      offsetX={img ? img.width / 2 : 0}
      offsetY={img ? img.height / 2 : 0}
    />
  );
};

function Home() {
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [selectedId, selectShape] = useState(null);
  const [shapes, setShapes] = React.useState([]);
  const [, updateState] = React.useState();
  const stageEl = React.createRef();
  const layerEl = React.createRef();
  const [name, setName] = React.useState("");
  const dragUrl = React.useRef();
  const [images, setImages] = React.useState([]);
  let y;
  const [imageList, setImageList] = React.useState([]);

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  async function getBase64(file) {
    let result_base64 = await new Promise((resolve) => {
      let reader = new FileReader();
      reader.onload = (e) => resolve(reader.result);
      reader.readAsDataURL(file);
    });
    return result_base64;
  }

  const takeshot = async () => {
    let div = await document.getElementById("canvass");

    // Use the html2canvas
    // function to take a screenshot
    // and append it
    // to the output div
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

  //end
  const download = () => {
    //get stage dataUrl
    const dataURL = stageEl ? stageEl.current.getStage().toDataURL() : null;
    var link = document.createElement("a");
    link.download = "react-generator";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    addLine(stageEl.current.getStage(), layerEl.current);
  };
  const eraseLine = () => {
    addLine(stageEl.current.getStage(), layerEl.current, "erase");
  };
  const drawText = () => {
    const id = addTextNode(stageEl.current.getStage(), layerEl.current);
    const shs = shapes.concat([id]);
    setShapes(shs);
  };
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const fileChange = (ev) => {
    let file = ev.target.files[0];
    let reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }
  };
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

    shapes.pop();
    setShapes(shapes);
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

      forceUpdate();
    }
  });
  return (
    <div className="home-page">
      <div id="canvass">
        <textarea
          autoComplete="off"
          rows="4"
          cols="150"
          placeholder="Search for the required logo"
          id="myInput"
          name="name"
          onChange={(event) =>
            setName(
              "https://www.google.com/s2/favicons?sz=128&domain_url=" +
                event.target.value +
                ".com"
            )
          }
        />
        <textarea
          autoComplete="off"
          rows="4"
          cols="150"
          placeholder="Enter the URL to fetch the logo"
          id="myInput"
          name="name"
          onChange={(event) =>
            setName(
              "https://www.google.com/s2/favicons?sz=128&domain_url=" +
                event.target.value
            )
          }
        />
   
        <div></div>
        <Dropzone
           onDrop = {
            (acceptedFiles) => {
                
            y = getBase64(acceptedFiles[0]);
            console.log(acceptedFiles[0])
            y.then((result) => {
              setImageList((prev) => [...prev, result]);
            });
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here</p>
              </div>
            </section>
          )}
        </Dropzone>
        <img
          src={name} //name}
          draggable="true"
          onDragStart={(e) => {
            dragUrl.current = e.target.src;
          }}
        />

        <div></div>

        <ButtonGroup>
          <Button color="primary" onClick={addRectangle}>
            Rectangle
          </Button>
          <Button color="primary" onClick={addCircle}>
            Circle
          </Button>
          <Button color="primary" onClick={drawLine}>
            Line
          </Button>

          <Button color="primary" onClick={eraseLine}>
            Erase
          </Button>

          <Button color="primary" onClick={drawText}>
            Text
          </Button>

          <Button color="primary" onClick={undo}>
            Undo
          </Button>
          <Button color="primary" onClick={download}>
            Export
          </Button>
        </ButtonGroup>
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
                  ...stageEl.current.getPointerPosition(),
                  src: dragUrl.current,
                },
              ])
            );
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <Stage
            style={{ border: "3px solid grey" }}
            width={window.innerWidth * 0.9}
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
              {images.map((image) => {
                return <URLImage image={image} />;
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
        </div>
      </div>

      <div id="output"></div>
    </div>
  );
}
export default Home;


// import React, {useCallback} from 'react'
// import {useDropzone} from 'react-dropzone'

// function MyDropzone() {
//   const onDrop = useCallback(acceptedFiles => {
//     // Do something with the files
//     console.log(acceptedFiles)
//   }, [])
//   const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

//   return (

//     <div>
//       <img src = "https://icons.duckduckgo.com/ip3/www.google.com.ico" draggable = "true"/>
//     <div {...getRootProps()}>
//       <input {...getInputProps()} />
//       {
//         isDragActive ?
//           <p>Drop the files here ...</p> :
//           <p>Drag 'n' drop some files here, or click to select files</p>
//       }
//     </div>
//     </div>
//   )
// }

// export default MyDropzone