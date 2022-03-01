
var fs = require('fs-extra')
  //"C:\\Users\\Vijay Murugan A S\\Downloads\\react-generator.png"
 //  "C:\\Users\\Vijay Murugan A S\\Desktop\\Files\\work\\new\\app\\src\\images\\"

fs.move("C:/Users/Vijay Murugan A S/Downloads/react-generator.png","C:\\Users\\Vijay Murugan A S\\Desktop\\Files\\work\\new\\app\\src\\images\\react-generator.png",{ overwrite: true })
.then(() => console.log("File moved to the destination"+
" folder successfully"))
.catch((e) => console.log(e));

