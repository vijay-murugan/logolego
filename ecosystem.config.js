module.exports = {
    apps : [{
      name        : "my-app",
      script      : "server.js", // path needs to be relative from ecosystem.config.js
      watch       : true, // any changes to app folder will get pm2 to restart app
      env         : {
        "NODE_ENV": "development",
        "PORT": 3001 // define env variables here
      }
    }]
  }