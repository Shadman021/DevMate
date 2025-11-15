const express = require("express");

const app = express();

// app.use("/",(req, res) => {
//     res.send("Hello from");
// });
app.use("/sec",(req, res) => {
    res.send("Hello from another page");
});
app.use("/test",(req, res) => {
    res.send("Hello from server");
});

app.listen(3000, () => {
    console.log("server is running sussessfully...");
    
})