
import * as nlightnApi from './nlightn.js';
import * as freeAgentApi from './freeAgent.js'

export const queryData = async (query) => {

    const environment = window.environment

    let response = []
    if(environment==="freeagent"){
        response = await freeAgentApi.queryFA(query);
        return response
    }else{
        response = await nlightnApi.getData(query)
        return response[0]
    }
};

export const getValue = async (tableName,fieldName,conditionalField,conditionalValue) => {

    const environment = window.environment

    let response = []
    if(environment==="freeagent"){
        response = await freeAgentApi.getFAValue(tableName,fieldName,conditionalField,conditionalValue);
        return response
    }else{
        response = await nlightnApi.getValue(tableName,fieldName,conditionalField,conditionalValue)
        return response
    }
};


export const getData = async (appName) => {

    const environment = window.environment

    let response = []
    if(environment==="freeagent"){
        response = await freeAgentApi.getFAAAppRecords(appName);
        return response
    }else{
        response = await nlightnApi.getTable(appName)
        // console.log(response)
        return response.data
    }
};

export const getList = async (tableName,fieldName)=>{
    const environment  = window.environment 
    let results = []
    if(environment==="freeagent"){
        results = await freeAgentApi.getFAList(tableName,fieldName);
    }else{
        let response = await nlightnApi.getList(tableName,fieldName)
        results = await response
    }
    return results
}

  export const getConditionalList = async (tableName,fieldName,conditionalField, condition)=>{
    const environment  = window.environment 
    
    let results = []
    if(environment==="freeagent"){
        results = await freeAgentApi.getFAConditionalList(tableName,fieldName,conditionalField,condition);
    }else{
        let response = await nlightnApi.getConditionalList(tableName,fieldName,conditionalField,condition)
        results = await response
    }
    return results
  }

  export const getRecord = async (appName, conditionalField, condition)=>{
    const environment  = window.environment 
    
    let results = null
    if(environment==="freeagent"){
        let response = await freeAgentApi.getFAAppRecord(appName,conditionalField, condition)
        results = response
    }else{
        let response = await nlightnApi.getRecord(appName,conditionalField, condition)
        results = await response
    }
    return results
  }


export const updateRecord = async (appName, selectedRecordId, formData) => {

    const environment = window.environment
    let response = null
    if(environment === "freeagent"){
        response = await freeAgentApi.updateFARecord(appName, selectedRecordId, formData)
    }else{
        response = await nlightnApi.updateRecord(appName,"id", selectedRecordId,formData)
    }
}


export const addRecord = async (appName, updatedForm) => {
    const environment = window.environment
    let response = null
    if(environment == "freeagent"){
        response = await freeAgentApi.addFARecord(appName, updatedForm)
    }else{
        response = await nlightnApi.addRecord(appName, updatedForm)
    }
    return response
}

export const deleteRecord = async (appName, selectedRecordId) => {
    const environment = window.environment
    let response = null
    if(environment == "freeagent"){
        response = await freeAgentApi.deleteFARecord(appName, selectedRecordId)
    }else{
        response = await nlightnApi.deleteRecord(appName,"id",selectedRecordId)
    }
    return response
}

export const getUserData = async () => {

    const environment = window.environment

    let user = null
    let users = []

    if(environment==="freeagent"){
        // user = await freeAgentApi.getCurrentFAUserData();
        users = await freeAgentApi.getFAUsers();
        // console.log(users)
        user = await users.find(i=>i.full_name==="Amy Williams")
        
        // let currentUser = await freeAgentApi.getFAUser()
        // console.log(currentUser)
        
    }else{
        let response = await nlightnApi.getTable("users")
        // console.log(response)
        users = await response.data
        user = await users.find(i=>i.first_name==="General")
    }

    return {user, users}
};

export const search = async (searchTerms) => {

    const environment  = window.environment 
    
    let results = []
    if(environment == "freeagent"){
        for(let i=1;i<=100;i++){
            results.push({id: i, title:`Search Result ${i}`, contents:`Results ${i} contents`, source: `Source ${i}`, link:""},)
        }
    }else{
        for(let i=1;i<=100;i++){
            results.push({id: i, title:`Search Result ${i}`, contents:`Results ${i} contents`, source: `Source ${i}`, link:""},)
        }
    }
    return results
}




  export const getColumnData = async (tableName)=>{
    const environment  = window.environment 
    
    let results = []
    if(environment==="freeagent"){
        results = await freeAgentApi.getFAColumnData(tableName);
    }else{
        results = await nlightnApi.getColumnData(tableName)
    }
    return results
  }


