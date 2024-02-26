import * as freeAgentApi from "./freeAgent.js";
import * as nlightnApi from './nlightn.js';

export const getData = async (appName) => {

    const environment = window.environment

    let response = []
    if(environment==="freeagent"){
        response = await freeAgentApi.getFAAllRecords(appName);
        return response
    }else{
        response = await nlightnApi.getTable(appName)
        return response.data
    }
};


export const updateRecord = async (appName, selectedRecordId, formData) => {

    const environment = window.environment

    if(environment === "freeagent"){
        try {
            await freeAgentApi.updateFARecord(appName, selectedRecordId, formData)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }else{
        await nlightnApi.updateRecord(appName,"id", selectedRecordId,formData)
    }
}


export const addRecord = async (appName, updatedForm) => {

    const environment = window.environment

    if(environment == "freeagent"){
        try {
            delete updatedForm.id
            delete updatedForm.seq_id
            await freeAgentApi.addFARecord(appName, updatedForm)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }else{
       nlightnApi.addRecord(appName, updatedForm)
    }
}

export const deleteRecord = async (appName, selectedRecordId) => {
    
    const environment = window.environment

    if(environment == "freeagent"){
        try {
            await freeAgentApi.updateFARecord(appName, selectedRecordId)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }else{
        await nlightnApi.deleteRecord(appName,"id",selectedRecordId)
    }
}


