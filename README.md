# JS SDK React Integration ![CI status](https://img.shields.io/badge/build-passing-brightgreen.svg)

This is a Redux Reducer that can be used to get up and running with Optimizely Full Stack quickly!

## Installation

### Requirements
* Node
* npm

`$ npm install`

## Usage

To get started, please use the following steps:

1. Drag and drop 'optimizelyreducer.js' into your reducers folder

2. Add it to a combine reducers function. Example below:

```javacript
import optimizelyReducer from './reducers/optimizelyReducer.js';

const reducer = combineReducers({
 optimizelyReducer
})
```

3. Pass along the functionality/data from the Optimizely Reducer to the components via props. Example below:

```javacript
const mapStateToProps = (state) => ({state:state.optimizelyReducer});

const mapDispatchToProps = (dispatch) => ({
  dataFileManager: (timing, id, attributes) => dispatch({type:'USER_SERVICE', id:id},
                               dispatch({type:'DATAFILE_MANAGER', timing:timing})),
  updateAttr: (attr) => dispatch({type:'UPDATE_ATTR', attr:attr})
});

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export default App;
```

4. Envoke the datafilemanager action via props in ONLY container componentDidMount(). Example below:

```javacript
componentDidMount() {
      this.props.dataFileManager('sync');
  }
```

5. Start Testing!!! Examples of it below:



## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
