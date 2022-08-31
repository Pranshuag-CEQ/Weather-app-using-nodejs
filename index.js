
const http = require("http");
const fs  = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("home.html" , "utf-8");

const replaceVal = (tempVal, orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
}


const server = http.createServer((req , res)=>{
    if(req.url == "/"){
        requests(
            `https://api.openweathermap.org/data/2.5/weather?q=Aligarh&units=metric&appid=faf320f961bbed6ce2d48337fb12acc8`
            ).on("data", (chunk) =>{
            const obj = JSON.parse(chunk);
            const arrData = [obj];
           const realTimeData  = arrData.map(val=>replaceVal(homeFile, val)).join("");
           res.write(realTimeData);
          // console.log(realTimeData)
        }).on("end", (err)=>{
            if (err) return console.log("Connection closed due to error",err);
            res.end();
        });
    }
});

server.listen(8000, "127.0.0.1");

 /*   const port=8000;
    server.listen(port, function (error) {
    
        // Checking any error occur while listening on port
        if (error) {
            console.log('Something went wrong', error);
        }
        // Else sent message of listening
        else {
            console.log('Server is listening on port' + port);
        }
    })*/