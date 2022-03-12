const express = require('express');
const { Mongoose } = require('mongoose');
const route = express.Router();
const Image = require('../models/images');
var bodyParser = require('body-parser')
var fs = require('fs');
const imageToBase64 = require('image-to-base64');
var request = require("request");
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();
var FileReader = require('filereader')

var jsonParser = bodyParser.json()
var request = require('request').defaults({ encoding: null });
function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

route.get('/', function(req,res){
  res.send("Hello")
    // Image.find({}, function(err,docs){
    //     if(err) res.json(err); 
    //     else
    //     res.send(docs)

    // })
})
var l;var x;
const conv = (url) =>{
  
  request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        s = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
        
        x = s;
        // console.log(x);
        
    }
   
    
});

return x;
}


  route.post('/tmp',jsonParser,(req,res) => {
    const data = req.body;
    
    console.log(req.body)
    const valu = "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www."+ data.img +".com&size=128"
    request.get(valu, function (error, response, body) {
      var s;
      
     if (!error && response.statusCode == 200) {
          s = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
          x = s;
        
          res.send(JSON.stringify({key:s}))
          
      }
      else{
        res.send(JSON.stringify({key:"Not Found"}))
      }
      // s = undefined;
    });
    // console.log("xyz=",x)
    
  });
  
  route.post('/tmp/url',jsonParser,(req,res) => {
    const data = req.body;
    
    console.log(req.body)
    const valu = "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url="+ data.img +"&size=128"
    request.get(valu, function (error, response, body) {
      var s;
      
     if (!error && response.statusCode == 200) {
          s = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
          x = s;
        
          res.send(JSON.stringify({key:s}))
          
      }
      else{
        res.send(JSON.stringify({key:"Not Found"}))
      }
      // s = undefined;
    });
    // console.log("xyz=",x)
    
  });
  

  // route.get('/images/:id', (req, res) => {
  //   console.log("a")
  //   Image.findOne({_id: req.params.id}, (err, result) => {
  //     if (err) {
  //         console.log(req.params.id)
  //       console.log( "Failed to get clients.")
  //     } else {
  //       console.log("saf")
  //       res.send(result.img)
       
  //     }
  //   });
  // })



route.post('/save',jsonParser,function(req,res) {
    const data = req.body;
    console.log("body= ",data)
    const image = new Image(data);
    image.save(function(err,imag){
        var im = imag._id;
        if(err){
            res.status(500).json({msg: "Internal error "})
        }
        else{
            res.send(im)
        }
        console.log(im)
    })
    
})

module.exports = route;