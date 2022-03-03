
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const routeHandler = require("./routes/routes");
const Image = require('./models/images');
const multer = require("multer");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const PORT = process.env.PORT || 5000;
const upload = multer({ dest: "public/files" });

let cors = require("cors");
app.use(cors());
const corsOptions = {
  origin: "https://logolego.bookmane.in"
};

app.get('/getData', cors(corsOptions), async (req, res) => {
  const fetchOptions = {
      method: 'GET'
  }
  const response = await fetch(requestEndpoint, fetchOptions);
  // const jsonResponse = await response.json();
  // res.json(jsonResponse);
  console.log(response)
});

app.use("/api", routeHandler);
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());



// app.post("/api/uploadFile", upload.single("myFile"), (req, res) => {
//   // Stuff to be added later
//   console.log(req.file);
// });


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb://localhost:27017/Logolego',
      // "mongodb+srv://Vijay:RWHVGUd17nl3ewJe@cluster0.w5mit.mongodb.net/WhiteboardApp?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

app.use(express.static('./client/build'))
app.get('*', (req,res)=>{
  res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'))
})

connectDB()

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});