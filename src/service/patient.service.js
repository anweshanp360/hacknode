// src/services/patient.service.js
const { sql, poolPromise } = require("../db/config"); // Adjust path to db config
const axios = require('axios');

/**
 * Retrieves patient records based on provided filters.
 * @param {object} filters - An object containing filter criteria for patients.
 * @returns {Array} - An array of patient records.
 */
const getAllPatients = async (filters) => {
  let query = `SELECT * FROM Patients WHERE 1=1`;
  const inputs = [];

  // Required fields
  if (filters.patient_name) {
    query += ` AND patient_name LIKE @patient_name`;
    inputs.push({
      name: "patient_name",
      type: sql.NVarChar,
      value: `%${filters.patient_name}%`,
    });
  }
  if (filters.age) {
    query += ` AND age = @age`;
    inputs.push({ name: "age", type: sql.Int, value: parseInt(filters.age) });
  }
  if (filters.gender) {
    query += ` AND gender = @gender`;
    inputs.push({ name: "gender", type: sql.VarChar, value: filters.gender });
  }
  if (filters.symptom_duration) {
    query += ` AND symptom_duration = @symptom_duration`;
    inputs.push({
      name: "symptom_duration",
      type: sql.Int,
      value: parseInt(filters.symptom_duration),
    });
  }

  // Boolean (BIT) fields
  const booleanFields = [
    "muscle_weakness",
    "twitching",
    "speech_difficulty",
    "swallowing_difficulty",
    "breathing_difficulty",
    "family_history",
  ];
  booleanFields.forEach((field) => {
    if (filters[field] !== undefined) {
      query += ` AND ${field} = @${field}`;
      inputs.push({
        name: field,
        type: sql.Bit,
        value: filters[field] === "true" || filters[field] === true ? 1 : 0,
      });
    }
  });

  // Optional dropdown/text fields
  const optionalFields = [
    { name: "previous_diagnosis", type: sql.NVarChar },
    { name: "current_treatment", type: sql.VarChar },
    { name: "biomarker_status", type: sql.VarChar },
    { name: "EMG_result", type: sql.VarChar },
  ];
  optionalFields.forEach((field) => {
    if (filters[field.name]) {
      query += ` AND ${field.name} = @${field.name}`;
      inputs.push({
        name: field.name,
        type: field.type,
        value: filters[field.name],
      });
    }
  });

  try {
    const pool = await poolPromise;
    const request = pool.request();

    inputs.forEach((input) => {
      request.input(input.name, input.type, input.value);
    });

    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error("❌ Error in patient.service:", err);
    throw err;
  }
};

/**
 * Inserts a new patient record into the database.
 * @param {object} patientData - An object containing all patient data fields.
 * @returns {object} - An object indicating success or failure.
 */
const getPatientById = async (id) => {
  const query = `SELECT * FROM Patients WHERE id = @id`;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", sql.Int, id);

    const result = await request.query(query);
    return result.recordset[0] || null;
  } catch (err) {
    console.error("❌ Error in patient.service (getPatientById):", err);
    throw err;
  }
};

const postPatient = async (patientData) => {
  const {
    patient_name,
    age,
    gender,
    symptom_duration,
    muscle_weakness,
    twitching,
    speech_difficulty,
    swallowing_difficulty,
    breathing_difficulty,
    family_history,
    previous_diagnosis,
    current_treatment,
    biomarker_status,
    EMG_result,
  } = patientData;

  const query = `
    INSERT INTO Patients (
      patient_name, age, gender, symptom_duration,
      muscle_weakness, twitching, speech_difficulty, swallowing_difficulty,
      breathing_difficulty, family_history,
      previous_diagnosis, current_treatment, biomarker_status, EMG_result
    )
    OUTPUT INSERTED.id
    VALUES (
      @patient_name, @age, @gender, @symptom_duration,
      @muscle_weakness, @twitching, @speech_difficulty, @swallowing_difficulty,
      @breathing_difficulty, @family_history,
      @previous_diagnosis, @current_treatment, @biomarker_status, @EMG_result
    )
  `;

  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input("patient_name", sql.NVarChar, patient_name);
    request.input("age", sql.Int, parseInt(age));
    request.input("gender", sql.VarChar, gender);
    request.input("symptom_duration", sql.Int, parseInt(symptom_duration));

    request.input("muscle_weakness", sql.Bit, muscle_weakness ? 1 : 0);
    request.input("twitching", sql.Bit, twitching ? 1 : 0);
    request.input("speech_difficulty", sql.Bit, speech_difficulty ? 1 : 0);
    request.input(
      "swallowing_difficulty",
      sql.Bit,
      swallowing_difficulty ? 1 : 0
    );
    request.input(
      "breathing_difficulty",
      sql.Bit,
      breathing_difficulty ? 1 : 0
    );
    request.input("family_history", sql.Bit, family_history ? 1 : 0);

    request.input(
      "previous_diagnosis",
      sql.NVarChar,
      previous_diagnosis || null
    );
    request.input("current_treatment", sql.VarChar, current_treatment || null);
    request.input("biomarker_status", sql.VarChar, biomarker_status || null);
    request.input("EMG_result", sql.VarChar, EMG_result || null);

    const result = await request.query(query);
    const insertedId = result.recordset[0].id;

    const newPatient = await getPatientById(insertedId);

    let matchResponse = null;
    try {
      matchResponse = await axios.post("http://localhost:5001/match_trial", newPatient);
      console.log("✅ Python matching API called successfully.");
    } catch (err) {
      console.error("⚠️ Failed to call Python matching API:", err.message);
    }

    return {
      success: true,
      message: "Patient data inserted successfully.",
      patient: newPatient,
      matchedTrial: matchResponse?.data || null,
    };
  } catch (err) {
    console.error("❌ Error in patient.service (postPatient):", err);
    throw err;
  }
};

/**
 * Updates an existing patient record in the database.
 * @param {number} patientId - The ID of the patient to update.
 * @param {object} patientData - An object containing the fields to update and their new values.
 * @returns {object} - An object indicating success or failure.
 */
const updatePatient = async (patientId, patientData) => {
  const updates = [];
  const inputs = [];

  // Define field types for validation and input binding
  const fieldDefinitions = {
    patient_name: sql.NVarChar,
    age: sql.Int,
    gender: sql.VarChar,
    symptom_duration: sql.Int,
    muscle_weakness: sql.Bit,
    twitching: sql.Bit,
    speech_difficulty: sql.Bit,
    swallowing_difficulty: sql.Bit,
    breathing_difficulty: sql.Bit,
    family_history: sql.Bit,
    previous_diagnosis: sql.NVarChar,
    current_treatment: sql.VarChar,
    biomarker_status: sql.VarChar,
    EMG_result: sql.VarChar,
  };

  for (const key in patientData) {
    if (patientData.hasOwnProperty(key) && fieldDefinitions[key]) {
      updates.push(`${key} = @${key}`);
      let value = patientData[key];
      let type = fieldDefinitions[key];

      // Handle boolean (BIT) fields
      if (type === sql.Bit) {
        value = value === "true" || value === true ? 1 : 0;
      }
      // Handle integer fields
      if (type === sql.Int) {
        value = parseInt(value);
      }
      // Handle null for optional fields if an empty string is passed
      if (value === "") {
        value = null;
      }

      inputs.push({ name: key, type: type, value: value });
    }
  }

  if (updates.length === 0) {
    return { success: false, message: "No valid fields to update." };
  }

  const query = `UPDATE Patients SET ${updates.join(", ")} WHERE id = @id`;

  try {
    const pool = await poolPromise;
    const request = pool.request();

    inputs.forEach((input) => {
      request.input(input.name, input.type, input.value);
    });
    request.input("id", sql.Int, patientId); // Add patient_id for WHERE clause

    const result = await request.query(query);
    if (result.rowsAffected[0] > 0) {
      return {
        success: true,
        message: `Patient with ID ${patientId} updated successfully.`,
      };
    } else {
      return {
        success: false,
        message: `Patient with ID ${patientId} not found or no changes made.`,
      };
    }
  } catch (err) {
    console.error("❌ Error in patient.service (updatePatient):", err);
    throw err;
  }
};

/**
 * Deletes a patient record from the database.
 * @param {number} patientId - The ID of the patient to delete.
 * @returns {object} - An object indicating success or failure.
 */
const deletePatient = async (patientId) => {
  const query = `DELETE FROM Patients WHERE id = @id`;

  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", sql.Int, patientId);

    const result = await request.query(query);
    if (result.rowsAffected[0] > 0) {
      return {
        success: true,
        message: `Patient with ID ${patientId} deleted successfully.`,
      };
    } else {
      return {
        success: false,
        message: `Patient with ID ${patientId} not found.`,
      };
    }
  } catch (err) {
    console.error("❌ Error in patient.service (deletePatient):", err);
    throw err;
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  postPatient,
  updatePatient,
  deletePatient,
};
