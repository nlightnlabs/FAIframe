import axios from "axios";

export const baseURL = process.env.NODE_ENV==="production" ? "https://nlightnlabs.net" : "http://localhost:3001"


export default axios.create({
  baseURL,
})

export const dbUrl = axios.create({
  baseURL,
})

//General Query
export const queryFA = async (appName)=>{
    
    const query = {query: `query{listEntityValues(entity: \"${appName}\", "order" : [["seq_id","ASC"]]){ entity_values {id, field_values} } }`}

    try {
        const response = await dbUrl.post("/freeAgent/query", query);
   
        const data = response.data.listEntityValues.entity_values;

        const result = data.map(record => {
            let rowData = { id: record.id };
            Object.entries(record.field_values).forEach(([key, value]) => {
                let val = value.value;
                if(value.type==="reference" || value.type==="reference_join"){
                    val = value.display_value
                }
                if (typeof val === "object") {
                    val = JSON.stringify(val);
                }
                rowData = { ...rowData, [key]: val };
            });
            return rowData;
        });

        return result;
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}

//Get value
export const getFAValue = async (appName,fieldName,conditionalField,conditionalValue)=>{
    
    const query = {query: `query{listEntityValues(entity: \"${appName}\", fields: [\"${fieldName}\"], filters: [{field_name: \"${conditionalField}\", operator: \"equals\",values:[\"${conditionalValue}\"}]],limit: 1){ entity_values {id, field_values} } }`}

    try {
        const response = await dbUrl.post("/freeAgent/query", query);

        const data = response.data.listEntityValues.entity_values;
        const result = data.map(record => {
            let rowData = { id: record.id };
            Object.entries(record.field_values).forEach(([key, value]) => {
                let val = value.value;
                if(value.type==="reference"){
                    val = value.display_value
                }
                if (typeof val === "object") {
                    val = JSON.stringify(val);
                }
                rowData = { ...rowData, [key]: val };
            });
            return rowData;
        });

        return result;
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}


//Get Free Agent User Data
export const getFAUsers = async ()=>{

    const query = {query: "query{getTeamMembers(active: true) {agents {id, full_name, teamId, email_address, access_level, status, job_title, roles {id, name, import, export, bulk_edit, bulk_delete, task_delete, is_admin}, subteams {id, name, description}}}}"}
    
    try {
        const response = await dbUrl.post("/freeAgent/query",query);
        const data = response.data.getTeamMembers.agents
        // console.log(data);
        return data;
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}

//Get Free Agent User 
export const getFAUser = async ()=>{

    // const query = {query: "query{getUserInfo(){id, email}}"}
    const query = {query: "query{agents($id: String) {profiles(id: $id, limit: \"1\")}}"}
      
    try {
        const response = await dbUrl.post("/freeAgent/query",query);
        console.log(console.log(data));

        const data = response.data.agents;
        console.log(data);

        return data;
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}


//Get Free Agent Apps
export const getFAApps = async ()=>{

    const query  = {query: "query{getEntities(alphabetical_order:true) {name, display_name, label, label_plural, entity_id}}"}
    
    try {
        const response = await dbUrl.post("/freeAgent/query",query);

        const data = response.data.getEntities;
        return data;
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}


//Standard function to get all records from a FreeAgent App
export const getFAAAppRecords = async (appName) => {

    const query = {query: `query{listEntityValues(entity: \"${appName}\", order : [["seq_id","ASC"]]){ entity_values {id, field_values} } }`}
    try {
        const response = await dbUrl.post("/freeAgent/query", query);

        const data = response.data.listEntityValues.entity_values;

        const result = data.map(record => {
            let rowData = { id: record.id };
            Object.entries(record.field_values).forEach(([key, value]) => {
                let val = value.value;
                if(value.type==="reference"  || value.type==="reference_join"){
                    val = value.display_value
                }
                if (typeof val === "object") {
                    val = JSON.stringify(val);
                }
                rowData = { ...rowData, [key]: val };
            });
            return rowData;
        });

        return result;
    } catch (error) {
        throw new Error(`Error fetching data for ${appName}: ` + error);
    }
   
};

//Standard function to get a single record from a FreeAgent App
export const getFAAppRecord = async (appName, conditionalField, condition)=>{

    console.log("appName",appName)
    console.log("conditionalField",conditionalField)
    console.log("condition",condition)

    const query =  {query: `query{listEntityValues(entity: \"${appName}\", filters: [{field_name: \"${conditionalField}\", operator: \"equals\", values:[\"${condition}\"]}], limit: 1){ entity_values {field_values} } }`}
    console.log("query",query)

    try {
        const response = await dbUrl.post("/freeAgent/query", query);
        console.log(response)
    
        const record = response.data.listEntityValues.entity_values[0];
        console.log(record)

            let rowData = { id: record.id };
            Object.entries(record.field_values).forEach(([key, value]) => {
                let val = value.value;
                if(value.type==="reference" || value.type==="reference_join"){
                    val = value.display_value
                }
                if (typeof val === "object") {
                    val = JSON.stringify(val);
                }
                rowData = { ...rowData, [key]: val };
            });
            console.log("result",rowData )
            return rowData;
    
    } catch (error) {
        console.log(error)
    }
}


//Standard function to get specific records from a FreeAgent App
export const getFAAppRecordsSubset = async (appName, fields, filters, order, limit, offset, pattern)=>{

    const query = {query: `query{listEntityValues(entity: \"${appName}\", fields: \"${fields}\", filters: \"${filters}\", order: \"${order}\", limit: \"${limit}\", offset: \"${offset}\", pattern: \"${pattern}\"}){ entity_values {id, field_values} } }`}

    try {
        const response = await dbUrl.post("/freeAgent/query", query);

        const data = response.data.listEntityValues.entity_values;

        const result = data.map(record => {
            let rowData = { id: record.id };
            Object.entries(record.field_values).forEach(([key, value]) => {
                let val = value.value;
                if(value.type==="reference" || value.type==="reference_join"){
                    val = value.display_value
                }
                if (typeof val === "object") {
                    val = JSON.stringify(val);
                }
                rowData = { ...rowData, [key]: val };
            });
            return rowData;
        });

        return result;
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}

//Standard function to add a new record in a FreeAgent App
export const addFARecord = async (appName, formData)=>{
    let record = formData
    delete record.id
    delete record.seq_id

    let updatedFormData = "";
    let i=0;
    (Object.entries(record).map(([key,val])=>{
        if(i==0){
            updatedFormData = `${key}:\"${val}\"`
        }else{
            updatedFormData = `${updatedFormData}, ${key}:\"${val}\"`
        }
        i = i+1;
    }))

    const query = {query: `mutation{createEntity(entity: \"${appName}\",field_values: {${updatedFormData}}){entity_value {id, seq_id, field_values}}}`}


    try {
        const response = await dbUrl.post("/freeAgent/query", query);
        const data = response.data.createEntity.entity_value;
        return(data)
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}

//Standard function to add a new record in a FreeAgent App
export const addFARecordWithLineItems = async (appName, formData, lineItemAppName, lineItems)=>{
    let record = formData
    delete record.id
    delete record.seq_id

    let updatedFormData = "";
    let i=0;
    (Object.entries(record).map(([key,val])=>{
        if(i==0){
            updatedFormData = `${key}:\"${val}\"`
        }else{
            updatedFormData = `${updatedFormData}, ${key}:\"${val}\"`
        }
        i = i+1;
    }))

    let children = []
    lineItems.map(item=>{
        let lineItemFieldValues = "";
        let l=0;
        (Object.entries(item).map(([key,val])=>{
            if(l==0){
                lineItemFieldValues = `${key}:\"${val}\"`
            }else{
                lineItemFieldValues = `${lineItemFieldValues}, ${key}:\"${val}\"`
            }
            l= l+1;
        }))
        let lineItemData = `{entity: \"${lineItemAppName}\",field_values: ${lineItemFieldValues}}`
        children.push(lineItemData)
    })

    const query = {query: `upsertCompositeEntity(entity: \"${appName}\",field_values: {${updatedFormData}},children: [${children.toString()}]){entity_value {id, field_values}children{id, field_values}}}`}

    try {
        const response = await dbUrl.post("/freeAgent/query", query);
        const data = response.data.upsertCompositeEntity.entity_value;
        return(data)
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }

}


// Update record in FreeAgent
export const updateFARecord = async (appName, recordId, formData) => {

    let updatedFormData = "";
    let i=0;
    (Object.entries(formData).map(([key,val])=>{
        if(i==0){
            updatedFormData = `${key}:\"${val}\"`
        }else{
            updatedFormData = `${updatedFormData}, ${key}:\"${val}\"`
        }
        i = i+1;
    }))

    const query = {query: `mutation{updateEntity(entity: \"${appName}\", id: \"${recordId}\",field_values: {${updatedFormData}}){entity_value {id, seq_id, field_values}}}`}
 
    try {
        const response = await dbUrl.post("/freeAgent/query", query);
     
        let data = response.data.updateEntity.entity_value;
        let updatedRecord = {id: recordId}
        return(data)
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }

};


//Update or delete a record in a Free Agent app
export const deleteFARecord = async (appName, recordId) => { 
    const query = {query: `mutation{deleteEntity(entity: \"${appName}\", id: \"${recordId}\"){ entity_value {id} }}`}
    try {
        const response = await dbUrl.post("/freeAgent/query", query);
        return response
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}

//Get List
export const getFAList = async (appName,fieldName)=>{

    const query = {query: `query{listEntityValues(entity: \"${appName}\", fields: [\"${fieldName}\"], order : [[\"seq_id\",\"ASC\"]]){ entity_values {id, field_values} } }`}

    try{
      const response = await dbUrl.post("/freeAgent/query", query);
      const data = response.data.listEntityValues.entity_values;
     
       let set = new Set()
        data.map(record => {
            let item = record.field_values[fieldName]
            let value = item.value
            if(item.type==="reference" || item.type==="reference_join"){
                value = item.display_value
            }
            if (typeof value === "object") {
                value = JSON.stringify(value);
            }
            set.add(value)
        });
        let result = Array.from(set)
        return (result)

    }catch(error){
      console.log(error)
    }
  }


//   Get Conditional List
  export const getFAConditionalList = async (appName,fieldName,conditionalField, condition)=>{

     // query{listEntityValues(entity: \"custom_app_56\", fields: [\"subcategory\"], filters : [{field_name : \"category\", operator : \"equals\", values : [\"Furniture\"]}]){ entity_values {id, field_values} } }"}
    const query = {query: `query{listEntityValues(entity: \"${appName}\", fields: [\"${fieldName}\"], filters : [{field_name : \"${conditionalField}\", operator : \"equals\", values : [\"${condition}\"]}], order : [[\"seq_id\",\"ASC\"]]){ entity_values {id, field_values} } }`}

    try{
        const response = await dbUrl.post("/freeAgent/query", query);
        const data = response.data.listEntityValues.entity_values;
  
         let set = new Set()
          data.map(record => {
              let item = record.field_values[fieldName]
              let value = item.value
              if(item.type==="reference" || item.type==="reference_join"){
                  value = item.display_value
              }
              if (typeof value === "object") {
                  value = JSON.stringify(value);
              }
              set.add(value)
          });
          let result = Array.from(set)
          return (result)

    }catch(error){
      console.log(error)
      return []
    }
  }

  //   Get Column Data
  export const getFAColumnData = async (appName)=>{

    const query = {query: `query{getFields(entity: \"${appName}\",show_hidden:${false}){id, name, name_label, main_type, is_required, is_visible, is_unique, default_value, catalog_type_id, reference_field_id, reference_fa_entity_id, reference_fa_entity_name}`}
    
    try{
      const result = await dbUrl.post("/freeAgent/query", query);
      const data = await result.data
      let fieldList = []
      data.map(item=>{
        fieldList.push(item.name)
      })
      return ({data: data, fieldList:fieldList})
    }catch(error){
      console.log(error)
    }
  }

 