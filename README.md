# JS SDK React Integration ![CI status](https://img.shields.io/badge/build-passing-brightgreen.svg)

This is a Redux Reducer that can be used to get up and running with Optimizely Full Stack quickly!

## Installation

### Requirements
* Node
* npm
* React
* React-Router
* sync-request
* optimizely JS SDK
* axios
* uuidv4

`$ npm install`

## Usage

To get started, please use the following steps:

1. Drag and drop 'optimizelyreducer.js' into your reducers folder and update both the datafile and timing variables within the reducer file. See below:

```jsx
//************ Insert your datafile link below ************
var datafile = 'your datafile link here';

//************ Insert the polling time to trigger a datafile fetch *******
const timing = 5; //input in terms of minutes

```


2. Add it to a combine reducers function. Example below:

```jsx
import optimizelyReducer from './reducers/optimizelyReducer.js';

const reducer = combineReducers({
 optimizelyReducer
})
```

3. Pass along the functionality/data from the Optimizely Reducer to the components via props. Example below:

```jsx
const mapStateToProps = (state) => ({state:state.optimizelyReducer});

const mapDispatchToProps = (dispatch) => ({
  dataFileManager: (timing, id, attributes) => dispatch({type:'USER_SERVICE', id:id},
                               dispatch({type:'DATAFILE_MANAGER', timing:timing})),
  updateAttr: (attr) => dispatch({type:'UPDATE_ATTR', attr:attr})
});

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export default App;
```

4. Envoke the datafilemanager action via props in ONLY container componentDidMount(). Example below (all come with userprofileService by default):

```jsx
componentDidMount() {
      //The following line would handle datafile management using a sync configuration and assign a random uuid for the userId      //as well as initialize with an empty attribute object
      this.props.dataFileManager('sync');
      
      //The following line would handle datafile management async and assign the userId provided with pre-defined attribution
      this.props.dataFileManager('async', 'pistolPete', {theMan:true})
  }
```



5. Start Testing!!! Examples of it below:

The actions key is a wrapper around the usual functionality of the JS SDK (A/B testing, event tracking, Feature Management...)

A/B Testing: 

```jsx
  // userId and attributes auto applied for all

  //Activate Calls
  //@key - Experiment Key, String, Required

  
  this.props.state.actions.activate(key)
  
  //GetVariation
  //@key - Experiment Key, String, Required

  
  this.props.state.actions.getVariation(key)
  
```

Event Tracking:

```jsx
  //@key - Event key, string, Required

  this.props.state.actions.event(key)
  
  //used as an element click track
  <button onClick= () => this.props.state.actions.event(key) />
  ```

Feature Management:

```jsx
  // userId and attributes auto applied for all

  //Is Feature Enabled
  //@key - Feature Key, String, Required

  
  this.props.state.actions.isFeatureEnabled(key)
  
  //Get Feature Variable
  //@key - Experiment Key, String, Required
  //@type - data type of feature variable

  
  this.props.state.actions.getFeatureVariable(feature_key, variable_key, type)
  
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
