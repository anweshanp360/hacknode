const axios = require('axios');

async function runMatchingAPI(patientData) {
  // Post the patient data to Flask
  await axios.post('http://localhost:5000/data', patientData);

  // Then trigger the matching
  const matchResponse = await axios.get('http://localhost:5000/match');
  return matchResponse.data;
}

module.exports = { runMatchingAPI };
