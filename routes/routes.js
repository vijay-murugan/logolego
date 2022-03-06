const express = require('express');
const { Mongoose } = require('mongoose');
const route = express.Router();
const Image = require('../models/images');
var bodyParser = require('body-parser')
var fs = require('fs');
const data ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAD60lEQVR4nO3bbajecxzH8dfZMZoxiiGUdAjbQm4XtigRuXniNmsm4QGteXRNoUzUMaklMgkNDyiWlXCmSG6aMlqRB9ukMDY3x91hJpcHv2s5O87N9bv5X/9L57zr36n///re/D7nd/1/39/N1dNsNk1mptWdQN3sFfPh/v7+qvIYjRNxOU7DHfi0HaNGoxEVJEqADjEPK3AZelv3HqoqWLcJcBeWY99h95r4qaqA3STA47hplPu/4tuqgnbLS3CF0RsPH+GbqgJ3gwDnCl1/LJ4UvgaVULcAvRhvaNmIF6pMoG4BzmhdY9HA71UmULcA147zbDneqDqBOkeBHpw1xrNlWNWJJOrsATNx5Ih7b+NCHWo89faAXcIQN7v193kd6PIjqUKAOZiLQ7APfsEWfGjPim4nLvbfIW4GTscJOFyoCv/ADmxu+SlWGJUSYBoWC8XMmf6t4YfzFV7EGqER7Nn4eViEK9A3Tqzv8DIexGdZWSsjwHxhLF84weeOwFLcijexVugZRwkTnwswvY14B+NGXIn7sFJGoZQrwBKhhm8n8d304vzWlcMsQfhThd63M8VJjgA3CGVq3Vwl9IAlwrsiitRhcD4eS7StgnNwUIphigAzsRp7pwSsgHdxtvCSjSblK3C9sFzVDWzARcJQm0RsD5hu7Hl7p9mGq2U0nngBFuLknIAFaeCLXCexAlyaG7AQW4SiKptYARaUCFqApzBUwlGsAEeXCJpJE+tLOYsV4IBSgTP4EVtLOYsVoO4VJPhZ5pt/ON3QoFh6WlcR/o8CzML+pZzFCvB3qcAZHIhjSzmLFeC3UoEz6BHWDooQK8C2UoEzWYT9SjiKFSB7CaoQfbiuhKNYATaUCFqIe4QF2CxiBXgrN2BBDsU6HJbjJFaAjxWYgRWkD6/hlFQHsQIM4ZXUYBVxEt7BncImSxQphdBAgk3VzMC9uC3WMEWA9fg8wa4TvB5rkCLAEJ5IsKua9/B+rFHqXOBRfJ1oWxX3S9ghShVgEE8n2lbBJryaYpgzG1yp4MJEJndLnKjlCDCI2zPsS7FW2C1OInc9YB2eyfSRw/fCjnMyJRZElqpvkrQMX+Y4KCHAoDAzi96ZzeQBPJvrpNSS2EbcUshXOwwY/3Rp25Q8I7RGKEkfMfoRmd3sEnZ0PxDOAP8lLLfPwXkmnt29JJwF+DMv3UDpQ1KrhTJ5FY4f8Ww7nhPqh01j2M/GNbhZODM0nB+Ec0H9Cq5NVnFKbED4T16CY4RktwprCZsnsN2Bh4Xv9gIcJ5wS2y6cIfykdLI9Uz+amuRMCVB3AnUzJUDdCdTNlAB1J1A3UwLUnUDdTHoB/gFLx6Ni4xGRFQAAAABJRU5ErkJggg==";
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
  

  route.get('/images/:id', (req, res) => {
    Image.findOne({_id: req.params.id}, (err, result) => {
      if (err) {
          console.log(req.params.id)
        console.log( "Failed to get clients.")
      } else {
        
        res.send(result.img)
       
      }
    });
  })



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