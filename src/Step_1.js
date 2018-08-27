import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'

class Step_1 extends Component{

  componentDidMount(){
    this.props.dataFileManager('sync')
  }

  render(){
    let button;
    let variation;
    if(this.props.state.optlyClient){
      variation = this.props.state.actions.activate('Test')
      if(variation=== 'original'){
        button =  <button style={{backgroundColor:'blue'}} onClick={() => this.props.state.actions.event('saw_it')}>Hello</button>
      }else if(variation === 'variation_1'){
        button =  <button style={{backgroundColor:'red'}} onClick={() => this.props.state.actions.event('saw_it')}>Sup</button>
      }else{
        button = <button style={{backgroundColor:'blue'}} onClick={() => this.props.state.actions.event('saw_it')}>Hello</button>
      }
    }
    return(
      <div>
      <h1 style={{margin:'0 auto'}}>This page shows a basic A/B testing activate call</h1>
      {button}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({state:state.optimizelyReducer});

const mapDispatchToProps = (dispatch) => ({
  dataFileManager: (timing) => dispatch({type:'USER_SERVICE'},
                              dispatch({type:'DATAFILE_MANAGER', timing:timing}))
});

Step_1 = withRouter(connect(mapStateToProps, mapDispatchToProps)(Step_1));

export default Step_1;
