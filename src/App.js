import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link,withRouter} from 'react-router-dom'
import './App.css';

class App extends Component {
  componentDidMount() {
      this.props.dataFileManager('sync');
  }


  render() {
    return (
      <div className="App">
      {this.props.state.optlyClient && <div><Link to='/step_1'>Welcome, click here to be bucketed into experiment!</Link></div> }
      </div>
    );
  }
}
const mapStateToProps = (state) => ({state:state.optimizelyReducer});

const mapDispatchToProps = (dispatch) => ({
  dataFileManager: (timing, id, attributes) => dispatch({type:'USER_SERVICE', id:id, attributes:attributes},
                               dispatch({type:'DATAFILE_MANAGER', timing:timing})),
  updateAttr: (attr) => dispatch({type:'UPDATE_ATTR', attr:attr, value:value})
});

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export default App;
