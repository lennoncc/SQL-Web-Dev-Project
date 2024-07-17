const express = require('express')
const app = express()
const port = 3333
const cors = require("cors");
const bodyParser = require("body-parser");
const { connect, sql } = require("./db.js")
const salespersonRoutes = require("./routes/Salespersons.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

connect()
  .then((connection) => {
    console.log("Connected to the database!")
  })
  .catch((error) => {
    console.log("Database connection failed!");
    console.log(error);
  });

app.use("/api", salespersonRoutes.router);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})