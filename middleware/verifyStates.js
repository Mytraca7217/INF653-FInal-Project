const statesData = require('../data/statesData');

const verifyStates = (req, res, next) => {
  const stateCodes = statesData.states.map(st => st.code);

  const state = req.params.state.toUpperCase();

  if (!stateCodes.includes(state)) {
    return res.status(404).json({
      message: 'Invalid state abbreviation parameter'
    });
  }

  req.code = state;
  next();
};

module.exports = verifyStates;