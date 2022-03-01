const imageToBase64 = require('image-to-base64');
//or
//import imageToBase64 from 'image-to-base64/browser';

imageToBase64("https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://go.com&size=128") // Path to the image
    .then(
        (response) => {
            console.log("data:image/png;base64,"+response); // "cGF0aC90by9maWxlLmpwZw=="
        }
    )
    .catch(
        (error) => {
            console.log(error); // Logs an error if there was one
        }
    )