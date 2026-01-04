const express = require("express")

const app = express();
const port = 5002

//check server start
app.listen(port,()=>{
    console.log(`server start at post number ${port}`)
})