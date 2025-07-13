const sql = require("mssql"); // Assuming you have mssql imported/available
const { poolPromise, config } = require("../db/config"); // Assuming your config is in ../db/config

const getAllTrials = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM dbo.Trials");

    return result.recordset;
  } catch (err) {
    throw new Error("Failed to fetch trials: " + err.message);
  }
};

const createTrial = async (trialData) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input('trial_name', sql.VarChar, trialData.trial_name);
    request.input('sponsor', sql.VarChar, trialData.sponsor);
    request.input('min_age', sql.Int, trialData.min_age);
    request.input('max_age', sql.Int, trialData.max_age);
    request.input('gender_requirement', sql.VarChar, trialData.gender_requirement);
    request.input('min_symptom_duration', sql.Int, trialData.min_symptom_duration);
    request.input('requires_muscle_weakness', sql.Bit, trialData.requires_muscle_weakness);
    request.input('requires_twitching', sql.Bit, trialData.requires_twitching);
    request.input('requires_positive_biomarker', sql.VarChar, trialData.requires_positive_biomarker);
    request.input('requires_abnormal_emg', sql.VarChar, trialData.requires_abnormal_emg);
    request.input('allowed_treatments', sql.VarChar, trialData.allowed_treatments);
    request.input('exclusion_previous_diagnosis', sql.VarChar, trialData.exclusion_previous_diagnosis);
    request.input('location', sql.VarChar, trialData.location);
    request.input('status', sql.VarChar, trialData.status);
    request.input('start_date', sql.Date, trialData.start_date);
    request.input('end_date', sql.Date, trialData.end_date);

    const result = await request.query(`
      INSERT INTO Trials (
        trial_name, sponsor, min_age, max_age, gender_requirement,
        min_symptom_duration, requires_muscle_weakness, requires_twitching,
        requires_positive_biomarker, requires_abnormal_emg, allowed_treatments,
        exclusion_previous_diagnosis, location, status, start_date, end_date
      ) VALUES (
        @trial_name, @sponsor, @min_age, @max_age, @gender_requirement,
        @min_symptom_duration, @requires_muscle_weakness, @requires_twitching,
        @requires_positive_biomarker, @requires_abnormal_emg, @allowed_treatments,
        @exclusion_previous_diagnosis, @location, @status, @start_date, @end_date
      );
    `);

    return { success: true, rowsAffected: result.rowsAffected };
  } catch (error) {
    console.error('Error creating trial:', error);
    throw error;
  }
};

const updateTrial = async (trial_id, trialData) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Input parameters for update
    request.input('trial_id', sql.Int, trial_id); // Assuming 'id' is your primary key for trials
    if (trialData.trial_name !== undefined) request.input('trial_name', sql.VarChar, trialData.trial_name);
    if (trialData.sponsor !== undefined) request.input('sponsor', sql.VarChar, trialData.sponsor);
    if (trialData.min_age !== undefined) request.input('min_age', sql.Int, trialData.min_age);
    if (trialData.max_age !== undefined) request.input('max_age', sql.Int, trialData.max_age);
    if (trialData.gender_requirement !== undefined) request.input('gender_requirement', sql.VarChar, trialData.gender_requirement);
    if (trialData.min_symptom_duration !== undefined) request.input('min_symptom_duration', sql.Int, trialData.min_symptom_duration);
    if (trialData.requires_muscle_weakness !== undefined) request.input('requires_muscle_weakness', sql.Bit, trialData.requires_muscle_weakness);
    if (trialData.requires_twitching !== undefined) request.input('requires_twitching', sql.Bit, trialData.requires_twitching);
    if (trialData.requires_positive_biomarker !== undefined) request.input('requires_positive_biomarker', sql.VarChar, trialData.requires_positive_biomarker);
    if (trialData.requires_abnormal_emg !== undefined) request.input('requires_abnormal_emg', sql.VarChar, trialData.requires_abnormal_emg);
    if (trialData.allowed_treatments !== undefined) request.input('allowed_treatments', sql.VarChar, trialData.allowed_treatments);
    if (trialData.exclusion_previous_diagnosis !== undefined) request.input('exclusion_previous_diagnosis', sql.VarChar, trialData.exclusion_previous_diagnosis);
    if (trialData.location !== undefined) request.input('location', sql.VarChar, trialData.location);
    if (trialData.status !== undefined) request.input('status', sql.VarChar, trialData.status);
    if (trialData.start_date !== undefined) request.input('start_date', sql.Date, trialData.start_date);
    if (trialData.end_date !== undefined) request.input('end_date', sql.Date, trialData.end_date);

    // Dynamically build the SET clause for the UPDATE query
    const setClause = Object.keys(trialData)
      .map(key => {
        // Exclude 'id' from being updated as it's used in WHERE clause
        if (key === 'trial_id' || key === 'trial_id') return null; // Assuming id is the PK and won't be updated
        return `${key} = @${key}`;
      })
      .filter(Boolean) // Remove nulls
      .join(', ');

    if (!setClause) {
      throw new Error("No fields provided for update.");
    }

    const result = await request.query(`
      UPDATE Trials
      SET ${setClause}
      WHERE trial_id = @trial_id; -- Assuming 'id' is the primary key column name
    `);

    return { success: true, rowsAffected: result.rowsAffected };
  } catch (error) {
    console.error(`Error updating trial with ID ${trial_id}:`, error);
    throw error;
  }
};

const deleteTrial = async (trial_id) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input('trial_id', sql.Int, trial_id); // Assuming 'id' is your primary key

    const result = await request.query(`
      DELETE FROM Trials
      WHERE trial_id = @trial_id; -- Assuming 'id' is the primary key column name
    `);

    return { success: true, rowsAffected: result.rowsAffected };
  } catch (error) {
    console.error(`Error deleting trial with ID ${trial_id}:`, error);
    throw error;
  }
};

module.exports = { getAllTrials, createTrial, updateTrial, deleteTrial };