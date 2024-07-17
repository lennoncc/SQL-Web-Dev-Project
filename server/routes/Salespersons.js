const express = require("express");
const router = express.Router();
const { executeQuery } = require("../db.js");

// To add parameters, looks like the following:
// router.get("/allSalespersons/:id", async (req, res) => {
// const id = req.params.id  
// const query = "SELECT * FROM AdventureWorks2019.Sales.vSalesperson WHERE id = 32"
//   const values = [];
//   const paramNames = [];
// });


router.get("/allSalespersons", async (req, res) => {
  const query = "SELECT * FROM AdventureWorks2019.Sales.vSalesperson"
  const values = [];
  const paramNames = [];
  const isStoredProcedure = false;
  try {
    const result = await executeQuery(query, values, paramNames, isStoredProcedure);
    res.send(result.recordset)
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = { router };