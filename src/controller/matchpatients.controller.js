const matchedTrialsService = require('../service/matchpy');

const getMatchedTrials = async (req, res) => {
  try {
    const records = await matchedTrialsService.getAllMatchedTrials();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMatchedTrials,
};
