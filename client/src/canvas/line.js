import Konva from "konva";
let isPaint = false;
const fn =(mode)=>{
  if (mode === "none" ){
  isPaint = false;
  return 0;}
  else if (mode === "brush")
  return 4
  else
  return 20
}
export const addLine = (stage, layer, mode ) => {
  
  let lastLine;
  stage.on("mousedown touchstart", function (e) {
    isPaint = true;
    let pos = stage.getPointerPosition();
    lastLine = new Konva.Line({
      stroke:mode === "brush" ? "black" : "white" ,//mode === "brush"?"black":mode === "eraser"?"white":null ,
      strokeWidth:  fn(mode),
      
      globalCompositeOperation:
        mode === "brush" ? "source-over" : "destination-out",
        lineCap: 'round',
      points: [pos.x, pos.y],

    });
    layer.add(lastLine);
  });
  stage.on("mouseup touchend", function () {
    isPaint = false;
  });
  stage.on("mousemove touchmove", function (e) {
    if (!isPaint) {
      return;
    }
    e.evt.preventDefault();
    const pos = stage.getPointerPosition();
    let newPoints = lastLine.points().concat([pos.x, pos.y]);
    lastLine.points(newPoints);
    // layer.batchDraw();
  });
};
