const { poolPromise } = require('../db/config');

const getAllMatchedTrials = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM MatchedTrials');
    return result.recordset;
  } catch (error) {
    throw new Error(`Error fetching matched trials: ${error.message}`);
  }
};

module.exports = {
  getAllMatchedTrials,
};
