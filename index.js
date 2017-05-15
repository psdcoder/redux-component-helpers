const { createStore, applyMiddleware, combineReducers } = require('redux');
const { default: reduxThunk } = require('redux-thunk');
const { createLogger } = require('redux-logger');
const { setupRedux, thunk } = require('./src');

// We can create one file in components folder: `redux.js`, and use default export from it.
// reducer - generated object with component's `reducer` as *namespace* key. { postsTable: reducerFn }
// actions - object with actions. just call it =)
const { reducer, actions } = setupRedux(
  'postsTable', // namespace. will be used for actions namespace and as reducer key
  { lalala: 'lalala' }, // default state
  { // actions. can be async with thunk() helper
    setPosts(state, action) {
      return Object.assign(
        {},
        state,
        { posts: action.payload.posts }
      );
    },
    resetPosts(state) {
      return Object.assign(
        {},
        state,
        { posts: [] }
      );
    },
    fetchPosts: thunk(function fetchPosts(payload, dispatch, getState) { // arrow function isn't allowed because it should be bonded to actions object
      console.log('fetchPosts state', getState());
      // call action through this.*actionName*. The first parameter will be passed as payload key to the action. The second parameter is error flag, and it's optional.
      dispatch(this.setPosts({ posts: [{ id: 1, name: 'some post name' }] }));

      setTimeout(() => {
        dispatch(this.resetPosts());
      }, 3000);
    }),
  }
);


/*
 Example for store.js:

 ```
 const reducers = combineReducers({
 ...require('components/activities-overview/redux').reducer,
 ...require('components/app-messenger/redux').reducer,
 ...require('components/applicant-profile/redux').reducer,
 });
 ```

 So, it's unnecessary to know reducer key in the `store.js`...
 */
const store = createStore(
  combineReducers(Object.assign(
    {},
    reducer
  )),
  applyMiddleware(reduxThunk, createLogger())
);

store.dispatch(actions.setPosts({ posts: [{ id: 2, name: 'temporary post' }] }));
store.dispatch(actions.fetchPosts());
