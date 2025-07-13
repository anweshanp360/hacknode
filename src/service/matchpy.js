const { sql, poolPromise } = require("../db/config");

async function saveMatchedPatients(matches) {
  try {
    const pool = await poolPromise;

    for (const match of matches) {
      const { patientId, patientName, trialIds, trialNames, matchingFactors } =
        match;

      await pool
        .request()
        .input("patientId", sql.Int, patientId)
        .input("patientName", sql.NVarChar(100), patientName)
        .input("trialIds", sql.NVarChar(sql.MAX), trialIds.join(","))
        .input("trialNames", sql.NVarChar(sql.MAX), trialNames.join(","))
        .input(
          "matchingFactors",
          sql.NVarChar(sql.MAX),
          matchingFactors.join(",")
        ).query(`
                    INSERT INTO MatchedPatients (patientId, patientName, trialIds, trialNames, matchingFactors)
                    VALUES (@patientId, @patientName, @trialIds, @trialNames, @matchingFactors)
                `);
    }

    return { message: "Matched patients saved successfully" };
  } catch (error) {
    console.error("Error saving matched patients:", error);
    throw error;
  }
}

async function getAllMatchedPatients() {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT * FROM MatchedPatients ORDER BY matchedDate DESC");
    return result.recordset;
  } catch (error) {
    console.error("Error fetching matched patients:", error);
    throw error;
  }
}
async function getAllUnmatchedPatients() {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT * FROM UnMatchedPatients ORDER BY matchedDate DESC");
    return result.recordset;
  } catch (error) {
    console.error("Error fetching matched patients:", error);
    throw error;
  }
}

module.exports = {
  saveMatchedPatients,
  getAllMatchedPatients,
  getAllUnmatchedPatients,
};
