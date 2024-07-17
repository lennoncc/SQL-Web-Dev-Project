const sql = require('mssql');

const config = require('./config.js') 



//(https://www.youtube.com/watch?v=N2tpYsPeoCU)
// Queries to db handled here
async function executeQuery(query, values = [], paramNames = [], isStoredProcedure = true, outputParamName = null) {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    if (values && paramNames) {
      for (let i = 0; i < values.length; i++) {
        request.input(paramNames[i], values[i]);
      }
    }

    // Handle output parameter
    if (outputParamName) {
      request.output(outputParamName, sql.Int);
    }

    values.forEach((val, index) => {
      if (typeof val === 'undefined') {
        console.error (`Undefined value found for ${pramNames[index]}`);
      }
    });

    let result;
    if (isStoredProcedure) {
      result = await request.execute(query);``
    } else {
      result = await request.batch(query);
    }

    if (outputParamName) {
      result = { ...result, [outputParamName]: request.parameters[outputParamName].value};
    }

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  connect: () => sql.connect(config),
  sql,
  executeQuery,
};
