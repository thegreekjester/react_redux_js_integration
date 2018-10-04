import optimizely from '@optimizely/optimizely-sdk';
import axios from 'axios';
import uuidv4 from 'uuid/v4';
import request from 'sync-request';



//************ Insert your datafile link below ************
var datafile = 'https://cdn.optimizely.com/datafiles/BwwucPUXt9Zc4PttHxBCXQ.json';

//************ Insert the polling time to trigger a datafile fetch *******
const timing = 5; //input in terms of minutes

//************ Logger Level **********************************



/******************************DATAFILE ACTIONS MANAGER*************************************************/

const datafileActions = {

  fetchAsync: async () => { //Fetches Datafile async as well as stores it in redux store
    try {
      return await axios.get(datafile)
        .then(response => {
          window.localStorage.setItem('datafile', JSON.stringify(response.data));
          return response;
        })

    } catch (error) {
      console.log(error)
    }
  },
  fetchSync: () => {
    var req = request('GET', datafile);
    window.localStorage.setItem('datafile', req.body);
    return req.body;
  },
  datafileCheck: async () => {
    return await axios.get(datafile)
      .then(response => {
        let datafile = window.localStorage.getItem('datafile')
        if (datafile !== JSON.stringify(response.data)) {
          window.localStorage.setItem('datafile', JSON.stringify(response.data))
          console.log("the datafile has been updated")
          return true;
        } else {
          console.log('just did a datafile check but the datafile has remained the same')
          return false;
        }
      })
  }

}

//The initial state of redux (first load)
const intialState = {
  optlyClient: false,
  lastRequest: false,
  datafileChange: false,
  attributes: {},
  actions: false
}

/*************************************** REDUCER *******************************************************/

function rootReducer(state = intialState, action) {

  let newState = Object.assign({}, state); // copies the state as is
  let now = new Date(); //used to make sure that the datafile check insn't too often

  /********************************** Optimizely Actions (Tools to carry out your tests here) ************************/
  var optlyActions = {
    activate: (key) => {
      if(newState.optlyClient){
      return newState.optlyClient.activate(key, newState.userProfile.user_id, newState.attributes);
    }else{
      console.log('no client available, did not activate experiment: ', key)
      return
    }
    },
    event: (key) => {
      if(newState.optlyClient){
      newState.optlyClient.track(key, newState.userProfile.user_id, newState.attributes);
      console.log('sent event: ', key)
      return
    }else{
      console.log('no client available, did not send event: ', key)
      return
    }
    },
    getVariation:(key) => {
      if(newState.optlyClient){
      return newState.optlyClient.getVariation(key, newState.userProfile.user_id, newState.attributes)
    }else{
      console.log('no client available, did not get variation for experiment: ', key)
      return
    }
    },
    isFeatureEnabled: (key) => {
      if(newState.optlyClient){
      return newState.isFeatureEnabled(key, newState.userProfile.user_id, newState.attributes)
    }else{
      console.log('no client available, could not enable feature for experiment: ', key)
      return
    }
    },
    getFeatureVariable(feature_key, variable_key, type){
      if(newState.optlyClient){
        switch(type){
          case 'boolean':
            return newState.optlyClient.getFeatureVariableBoolean(feature_key, variable_key, newState.userProfile.user_id, newState.attributes)
          case 'string':
            return newState.optlyClient.getFeatureVariableString(feature_key, variable_key, newState.userProfile.user_id, newState.attributes)
          case 'integer':
            return newState.optlyClient.getFeatureVariableInteger(feature_key, variable_key, newState.userProfile.user_id, newState.attributes)
          case 'double':
            return newState.optlyClient.getFeatureVariableDouble(feature_key, variable_key, newState.userProfile.user_id, newState.attributes)
          default:
          console.log('please specify a type of feature variable to return')
           return
        }

      }
    }
  }

  /************************ User Profile Service *******************************************/

  var userProfileService = {
    lookup: function(userId) {
      return newState.userProfile;
    },
    save: function(userProfileMap) {
      newState.userProfile = userProfileMap
    }
  };

  var userProfileInit = () => {
    var obj = {
      user_id: '',
      experiment_bucket_map: {}
    }
    return obj
  }

  /****************** Initialize the Optimizely Client ********************************************/

  var initializeOptlyClient = (datafile) => {
    let optimizelyClientInstance = optimizely.createInstance({
      datafile: datafile,
      userProfileService: userProfileService
    });
    return optimizelyClientInstance;
  }

  switch (action.type) {
    /************************** DATA FILE FUNCTIONALITY ********************************************/

    case 'DATAFILE_MANAGER':
      var lastRequest = window.localStorage.getItem('lastRequest') //last request of datafile
      if (!window.localStorage.getItem('datafile') || now.getTime() - lastRequest >= timing * 60 * 10000) { // Checks to see if datafile is present
        if (action.timing === 'async') { // If the timing parameter is asynchronous
          datafileActions.fetchAsync() //fetch asynchronously
            .then(response => {
              newState.optlyClient = initializeOptlyClient(response.data)
              window.localStorage.setItem('lastRequest', now.getTime())
              console.log('i have downloaded it async and initialized')
              return newState;
            })
          return newState;
        } else if (action.timing === 'sync') { //if timing is sync, fetch sync
          var datafile = datafileActions.fetchSync()
          window.localStorage.setItem('lastRequest', now.getTime())
          newState.optlyClient = initializeOptlyClient(datafile)
          console.log('I have downloaded it sync and initalized')
          return newState;
        } else { //if no timing is present, console log the error
          console.log('error, you need to supply a timing paramater')
          return newState;
        }
      } else { //if has datafile cached
        if (!lastRequest || now.getTime() - lastRequest >= timing * 60 * 1000) {
          window.localStorage.setItem('lastRequest', now.getTime())
          datafileActions.datafileCheck() //check if datafile is up to date (async)
            .then(bool => { // if it has changed, turn the datafilechange flag on
              if (bool) {
                newState.datafileChange = true;
                console.log('I have set the datafileChange flag', newState)
                return newState;
              }
            })
        }
        if (!newState.datafileChange && newState.optlyClient) { //Has client and no datafilechange, so do nothing
          console.log('I have not re-initialized the client due to no datafile change')
          return newState;
        } else if (newState.datafileChange && newState.optlyClient) { //has client and there is a datafilechange, re-initialize
          newState.optlyClient = initializeOptlyClient(JSON.parse(window.localStorage.getItem('datafile')))
          newState.datafilechange = false
          console.log('I had a client already but there was a datafilechange, so I re-initalized the client')
          return newState;
        } else { //doesn't have client but there is a datafile, inialize client
          console.log('just initalized the client!')
          newState.optlyClient = initializeOptlyClient(JSON.parse(window.localStorage.getItem('datafile')))
          return newState;
        }
      }
      /*******************************USER_SERVICE_INIT*****************************************************/
    case 'USER_SERVICE':
      var userId;
      if(action.id){//Supplied userID via the dataFileManager call within a componentDidMount
          userId = action.id
          window.localStorage.setItem('userId', action.id)
      }else{
          userId = window.localStorage.getItem('userId'); //Checks if userID is stored in localStorage
      }

      if(action.attributes){ // if the user provided pre-defined attribution, assign it in the redux store here
        newState.attributes = action.attributes
      }
      //The Following takes care of initializing the userProfile Service object that lives in the redux store

      //if they have it cached/it was given but not in redux store (first load on return)
      if (userId && !newState.userProfile) {
        console.log('set user id in redux store')
        newState.userProfile = userProfileInit()
        newState.userProfile.user_id = userId;
        newState.actions = optlyActions // Initializes all the optimizely actions like activate, feature enabled etc..
        return newState;
      } else if (!userId) {
        //dont have it stored, so generatre one and store in both places (localStorage and redux store)
        let id = uuidv4();
        newState.userProfile = userProfileInit()
        newState.userProfile.user_id = id;
        window.localStorage.setItem('userId', id);
        newState.actions = optlyActions // Initializes all the optimizely actions like activate, feature enabled etc..
        console.log('created user ID and set it in redux and local cache')
        return newState;
      }
      return newState;

      /************************************ATTRIBUTION_UPDATES*****************************************/
    case 'UPDATE_ATTR':
      if(action.attr && action.value){
        newState.attributes[action.attr] = action.value
      }else{
        console.log('You need to provide a key and value to update your attributes')
      }
      return newState;
    default:
      return state;
  }
}

export default rootReducer;
