import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import optimizelyReducer from './reducers/optimizelyReducer.js';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Step_1 from './Step_1.js'

const reducer = combineReducers({
 optimizelyReducer
})

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter>
   <Switch>
   <Route exact path='/' component={App}/>
   <Route exact path='/step_1' component={Step_1}/>
   </Switch>
   </BrowserRouter>
</Provider>, document.getElementById('root'));
registerServiceWorker();
