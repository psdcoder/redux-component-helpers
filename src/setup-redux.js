const _ = require('lodash');
const _isThunk = require('./thunk')._isThunk;

function _generateActionName(ns, fnName) {
  return `${_.toUpper(_.snakeCase(ns))}/${_.toUpper(_.snakeCase(fnName))}`;
}

module.exports = function setupRedux(ns, defaultState, actions) {
  const actionsReducers = {};
  const actionsCallers = {};
  const reducer = (state = defaultState, action) => {
    if (actionsReducers[action.type]) {
      return actionsReducers[action.type](state, action);
    }

    return state;
  };

  Object.keys(actions).forEach((actionName) => {
    if (_isThunk(actions[actionName])) {
      actionsCallers[actionName] = payload => (dispatch, getState) => actions[actionName].call(actionsCallers, payload, dispatch, () => getState()[ns]);
    } else {
      const generatedActionName = _generateActionName(ns, actionName);

      actionsCallers[actionName] = function (payload, isError) {
        return { type: generatedActionName, payload, error: isError !== undefined ? isError : false };
      };
      actionsReducers[generatedActionName] = actions[actionName];
    }
  });

  return {
    actions: actionsCallers,
    reducer: { [ns]: reducer },
    getState: state => state[ns],
  };
};
