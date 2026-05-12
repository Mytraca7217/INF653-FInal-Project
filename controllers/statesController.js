const statesData = require('../data/statesData');
const State = require('../model/States');

const getAllStates = async (req, res) => {
    let states = statesData.states;
    const mongoStates = await State.find();
  
    states = states.map(st => {
      const mongoState = mongoStates.find(ms => ms.stateCode === st.code);
      return mongoState
        ? { ...st, funfacts: mongoState.funfacts }
        : st;
    });
  
    if (req.query.contig === 'true') {
      states = states.filter(st => st.code !== 'AK' && st.code !== 'HI');
    }
  
    if (req.query.contig === 'false') {
      states = states.filter(st => st.code === 'AK' || st.code === 'HI');
    }
  
    res.json(states);
  };
  
  const getState = async (req, res) => {
    const state = statesData.states.find(st => st.code === req.code);
    const mongoState = await State.findOne({ stateCode: req.code });
  
    if (mongoState) {
      return res.json({ ...state, funfacts: mongoState.funfacts });
    }
  
    res.json(state);
  };

const getCapital = async (req, res) => {
    const state = statesData.states.find(
      st => st.code === req.code
    );
  
    res.json({
      state: state.state,
      capital: state.capital_city
    });
  };

  const getNickname = async (req, res) => {
    const state = statesData.states.find(st => st.code === req.code);
  
    res.json({
      state: state.state,
      nickname: state.nickname
    });
  };
  
  const getPopulation = async (req, res) => {
    const state = statesData.states.find(st => st.code === req.code);
  
    res.json({
      state: state.state,
      population: state.population.toLocaleString()
    });
  };
  
  const getAdmission = async (req, res) => {
    const state = statesData.states.find(st => st.code === req.code);
  
    res.json({
      state: state.state,
      admitted: state.admission_date
    });
  };

  const getFunfact = async (req, res) => {
    const mongoState = await State.findOne({ stateCode: req.code });
  
    if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
      return res.json({
        message: `No Fun Facts found for ${req.params.state.toUpperCase()}`
      });
    }
  
    const randomIndex = Math.floor(Math.random() * mongoState.funfacts.length);
  
    res.json({
      funfact: mongoState.funfacts[randomIndex]
    });
  };

  const createFunfacts = async (req, res) => {
    if (!req.body.funfacts) {
      return res.status(400).json({
        message: 'State fun facts value required'
      });
    }
  
    if (!Array.isArray(req.body.funfacts)) {
      return res.status(400).json({
        message: 'State fun facts value must be an array'
      });
    }
  
    const mongoState = await State.findOne({ stateCode: req.code });
  
    if (mongoState) {
      mongoState.funfacts.push(...req.body.funfacts);
      const result = await mongoState.save();
      return res.json(result);
    }
  
    const result = await State.create({
      stateCode: req.code,
      funfacts: req.body.funfacts
    });
  
    res.status(201).json(result);
  };

  const updateFunfact = async (req, res) => {
    const { index, funfact } = req.body;
  
    if (!index) {
      return res.status(400).json({
        message: 'State fun fact index value required'
      });
    }
  
    if (!funfact) {
      return res.status(400).json({
        message: 'State fun fact value required'
      });
    }
  
    const mongoState = await State.findOne({ stateCode: req.code });
  
    if (!mongoState || !mongoState.funfacts[index - 1]) {
      return res.status(400).json({
        message: `No Fun Fact found at that index for ${req.params.state.toUpperCase()}`
      });
    }
  
    mongoState.funfacts[index - 1] = funfact;
    const result = await mongoState.save();
  
    res.json(result);
  };

  const deleteFunfact = async (req, res) => {
    const { index } = req.body;
  
    if (!index) {
      return res.status(400).json({
        message: 'State fun fact index value required'
      });
    }
  
    const mongoState = await State.findOne({ stateCode: req.code });
  
    if (!mongoState || !mongoState.funfacts[index - 1]) {
      return res.status(400).json({
        message: `No Fun Fact found at that index for ${req.params.state.toUpperCase()}`
      });
    }
  
    mongoState.funfacts.splice(index - 1, 1);
    const result = await mongoState.save();
  
    res.json(result);
  };

  module.exports = {
    getAllStates,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    getFunfact,
    createFunfacts,
    updateFunfact,
    deleteFunfact
  };