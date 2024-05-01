import axios from "axios";

export const baseURL = process.env.NODE_ENV==="production" ? "https://nlightnlabs.net" : "http://localhost:3001"

export const dbUrl = axios.create({
  baseURL,
})

//General Query
export const getData = async (query, res)=>{
  try{
    const result = await dbUrl.post("/nlightn/db/query",{query})
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}


//Get Table
export const getTable = async (tableName)=>{
    try{
      const result = await dbUrl.get(`/nlightn/db/table/${tableName}`)
      // console.log(result.data)
      const {data,dataTypes} = await result.data
      return ({data,dataTypes})
    }catch(error){
      // console.log(error)
    }
  }

  //Get List
  export const getList = async (tableName,fieldName)=>{

    try{
      const result = await dbUrl.get(`/nlightn/db/list/${tableName}/${fieldName}`)
      const data = await result.data
      return (data)
    }catch(error){
      // console.log(error)
    }
  }


// Get  Conditional List
  export const getConditionalList = async (tableName,fieldName,conditionalField, condition)=>{
   
    try{
      const result = await dbUrl.get(`/nlightn/db/subList/${tableName}/${fieldName}/${conditionalField}/${condition}`)
      const data = await result.data
      return (data)
    }catch(error){
      console.log(error)
    }
  }


//Get Record
export const getRecord = async (tableName,conditionalField, condition)=>{

  try{
    const result = await dbUrl.post("/nlightn/db/getRecord",{tableName,conditionalField, condition})
    // console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    // console.log(error)
  }
}

//Get Records
export const getRecords = async (tableName, conditionalField, condition)=>{

  try{
    const result = await dbUrl.post("/nlightn/db/getRecords",{tableName,conditionalField, condition})
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}

//Look up a single value
export const getValue = async (tableName,lookupField, conditionalField,conditionalValue)=>{
  
  try{
    const result = await dbUrl.get(`/nlightn/db/value/${tableName}/${lookupField}/${conditionalField}/${conditionalValue}`)
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}


//Create New Record
export const addRecord = async (tableName, formData)=>{
  if(tableName.length > 0 && Object.entries(formData).length>0){
    try{
      const result = await dbUrl.post("/nlightn/db/addRecord",{tableName, formData})
      console.log(result)
      const data = await result.data
      return (data)
    }catch(error){
      console.log(error)
    }
  }else{
    alert("Please provide information for the new record")
  }
}

//Update Record
export const updateRecord = async (tableName,idField,recordId,formData)=>{
  
    try{
      const result = await dbUrl.post("/nlightn/db/updateRecord",{tableName,idField,recordId,formData})
      //console.log(result)
      const data = await result.data
      return (data)
    }catch(error){
      //console.log(error)
    }
}

//Delete Record
export const deleteRecord = async (tableName,idField,recordId)=>{

  const params = {
    tableName,
    idField,
    recordId
}
  try{
    const result = await dbUrl.post("/nlightn/db/deleteRecord",{params})
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}


//Reset User Password
export const resetPassword = async (req)=>{

  const params = {
    tableName: req.tableName,
    idField: req.idField,
    recordId: req.recordId,
    formData: req.formData
  }

  try{
    const result = await dbUrl.post("/nlightn/db/updateRecord",{params})
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}


//Send Email
export const sendEmail = async (req, res)=>{
    
  const params = {
      to: req.to,
      subject: req.subject,
      message: req.message,
      htmlPage: req.htmlPage
  }

  //console.log(params)
  try{
    const result = await dbUrl.post("/nlightn/sendEmail",{params})
    // console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    // console.log(error)
  }
}

//Ask GPT
export const askGPT = async (prompt)=>{

  console.log(prompt)

  try{
    const response = await dbUrl.post("/openai/gpt/ask",{prompt})
    return (response.data)
  }catch(error){
    // console.log(error)
  }
}


//openai/gpt/ classify
export const gptClassify = async (text, list)=>{

  console.log("text",text)
  console.log("list",list)

  try{
    const response = await dbUrl.post("/openai/gpt/classify",{text, list})
    console.log(response.data)
    return (response.data)
  }catch(error){
    // console.log(error)
  }
}

//Generate Image
export const generateImage = async (prompt)=>{

  try{
    const result = await dbUrl.post("/openai/dalle/image",{prompt})
    // console.log(result)
    return (result.data[0].url)
  }catch(error){
    // console.log(error)
  }
}

//Scan Document
export const scanInvoice = async (documentText, record)=>{
  
  const prompt = `The following is an invoice received from a supplier: ${documentText}. Fill in the values in this javascript object: ${JSON.stringify(record)} based on the information in the invoice. Leave a value blank if it can not be determined based on the invoice document received. Return response as javascript object. Be sure to return a properly structured json object with closed brackets and array sub elements if needed.`

  try{
    const result = await dbUrl.post("/openai/gpt/ask",{prompt})
    return (JSON.parse(result.data))
  }catch(error){
    // console.log(error)
  }
}

export const runPython = async (pythonAppName,args)=>{
  const params = {
    pythonAppName,
    args
  }
  try{
    const result = await dbUrl.post("/nlightn/runPython",{params})
    console.log(JSON.parse(result.data))
    return (JSON.parse(result.data))

  }catch(error){
    // console.log(error)
  }
}

//Get list of all tables in database:
export const getAllTables = async()=>{
  const query= `SELECT table_name FROM information_schema.tables where table_schema = 'public';`
  try{
    const result = await dbUrl.post("/nlightn/query",{query})
    console.log(JSON.parse(result.data))
    return (JSON.parse(result.data))
  }catch(error){
    console.log(error)
  }
  
}

// show columsn
export const getColumnData = async(tableName)=>{

  const query= `SELECT column_name as name, data_type FROM information_schema.COLUMNS where TABLE_NAME = N'${tableName}';`
  try{
    const result = await dbUrl.post("/nlightn/db/query",{query})
    const data = result.data

    let fieldList = [] 
      data.map(item=>{
        fieldList.push(item.name)
      })
    return ({data: data, fieldList:fieldList})
  }catch(error){
    console.log(error)
  }
}

export const updateActivityLog = async(app, recordId, userEmail, description)=>{
  
  const formData = {
    "app":app,
    "record_id":recordId,
    "user":userEmail,
    "description":description
  }
  
  const tableName = "activities"

  try{
    const result = await dbUrl.post("/nlightn/db/addRecord",{tableName, formData})
    // console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    // console.log(error)
  }
}


export const convertAudioToText = async (audioBlob) => {

  console.log('audioBlob:', audioBlob); // Log audioBlob to check its content

// Create a new FormData object
const formData = new FormData();
// Append data to the formData object
formData.append('file', audioBlob, 'audio.wav');

  try {
    const response = await dbUrl.post('/openai/whisper', formData)
    return response.data.text
  } catch (error) {
    console.error('Error sending data to backend:', error);
  }
 
};



// python api
export const pythonUrl = process.env.NODE_ENV==="production" ? "https://nlightnlabs.net/python" : "http://127.0.0.1:5000"

export const python = axios.create({
  pythonUrl
})

export const pythonApp = async (appName) =>{
  console.log(appName)
  const response = await axios.post('http://127.0.0.1:5000/apps/getData', { appName })
  console.log(JSON.parse(response.data))
  return JSON.parse(response.data)
}



