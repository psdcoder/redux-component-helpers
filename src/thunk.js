module.exports = function thunk(asyncAction) {
  asyncAction._isThunk = true;

  return asyncAction;
};

module.exports._isThunk = function _isThunk(action) {
  return action._isThunk === true;
};
