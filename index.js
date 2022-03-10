
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const routeHandler = require("./routes/routes");
const Image = require('./models/images');
const multer = require("multer");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const path = require('path')

const PORT = process.env.PORT || 5000;
const upload = multer({ dest: "public/files" });
var routers = require('./routes/routes')
let cors = require("cors");
app.use(cors());
const corsOptions = {
  origin: "http://localhost:5000"//"https://logolego.bookmane.in"
};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
  const filepath = path.resolve(__dirname,'client', 'build', 'index.html');
  fs.readFile(filepath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
  res.send(result);
  });
});

app.use(express.static('client/build'));

app.get('*', function(request, response) {
  const filePath = path.resolve(__dirname, 'client', 'build', 'index.html');
  response.sendFile(filePath);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


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
app.use('/api/routes', routers);
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));
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

// connectDB()

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});