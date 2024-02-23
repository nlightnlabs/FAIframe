
import './App.css';
import React, {useState, useEffect} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import * as freeAgentApi from "./apis/FreeAgent.js";
import * as nlightnApi from './apis/nlightn.js';
import {toProperCase} from "./functions/formatValue.js";

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';

import Spinner from './components/Spinner.js'

function App() {

    const [environment, setEnvironment] = useState("nlightn")
    const [icons, setIcons] = useState([])
    const [apps, setApps] = useState([])
    const [appList, setAppList] = useState([])
    
    const [data, setData] = useState([]);
    const [fields, setFields] = useState([])
    const [appName, setAppName] = useState("")

    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({})
    const [selectedRecordId, setSelectedRecordId] = useState(null)

    const [updatedForm, setUpdatedForm] = useState({})

    const [showLoadingModal, setShowLoadingModal] = useState(false)

    useEffect(()=>{
        const environment = process.env.NODE_ENV==="production" ? "freeagent" : "nlightn"
        console.log(`Environment: ${environment}`)
    },[])

    const useExternalScript = (src) => {
        useEffect(() => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.body.appendChild(script);

            setTimeout(() => {
                initializeFreeAgentConnection();
            }, 500);

            return () => {
                document.body.removeChild(script);
            };
        }, [src]);
    };

    //script to itnegrate FreeAgent library
    useExternalScript('https://freeagentsoftware1.gitlab.io/apps/google-maps/js/lib.js');
    


    const initializeFreeAgentConnection = () => {
        const FAAppletClient = window.FAAppletClient;
        
        //Initialize the connection to the FreeAgent this step takes away the loading spinner
        const FAClient = new FAAppletClient({
            appletId: 'test-app-iframe',
        });
        window.FAClient = FAClient;

        //Get list of apps
        freeAgentApi.getFAAllRecords(FAClient, "web_app")
        .then(response => {
            let fieldList = []
            if(response.length>0){
                Object.keys(response[0]).map((field,index)=>{
                    fieldList.push({headerName: toProperCase(field.replaceAll("_"," ")), field: field, filter: true})
                })
                setAppList(fieldList)
            }
            setApps(response);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

        freeAgentApi.getFAAllRecords(FAClient, "icon")
        .then(response => {
            let fieldList = []
            if(response.length>0){
                Object.keys(response[0]).map((field,index)=>{
                    fieldList.push({headerName: toProperCase(field.replaceAll("_"," ")), field: field, filter: true})
                })
                setAppList(fieldList)
            }
            setIcons(response);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

    }

    const getData = async (appName) => {
        let response = []
        
        if(environment==="freeagent"){
            const FAClient = window.FAClient;
            response = await freeAgentApi.getFAAllRecords(FAClient, appName);
        }else{
            response = await nlightnApi.getTable(appName)
            return response.data
        }
        console.log(response)
        return response
    };

    const handleGetData = async ()=>{
        const response = await getData(appName)  
        setData(response)
        
        let fieldList = []
        if (response.length > 0) {
            Object.keys(response[0]).map((field, index) => {
                fieldList.push({ headerName: toProperCase(field.replaceAll("_", " ")), field: field, filter: true });
                setFormData(prev => ({ ...prev, ...{ [field]: "" } }));
            });
        }
        setFields(fieldList);
    }

    const updateRecord = async () => {

        if(environment === "freeagent"){
            try {
                const FAClient = window.FAClient;
                await freeAgentApi.updateFARecord(FAClient, appName, selectedRecordId, updatedForm)
                setInterval(()=>{
                    setShowLoadingModal(true)
                },600)
                setTimeout(async ()=>{
                    const response = await getData(appName)  
                    setData(response)
                    setShowLoadingModal(false)
                },500)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }else{
            await nlightnApi.updateRecord(appName,"id", selectedRecordId,updatedForm)
            const updatedData = await getData(appName)
            setData(updatedData)
        }
    }


    const addRecord = async () => {
        if(environment == "freeagent"){
            try {
                const FAClient = window.FAClient;
    
                delete updatedForm.id
                delete updatedForm.seq_id
    
                await freeAgentApi.addFARecord(FAClient, appName, updatedForm)
                setInterval(()=>{
                    setShowLoadingModal(true)
                },600)
                setTimeout(async ()=>{
                    const response = await getData(appName)  
                    setData(response)
                    setShowLoadingModal(false)
                },500)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }else{
            const response = await nlightnApi.addRecord(appName, updatedForm)
            const updatedData = await getData(appName)
            console.log(updatedData)
            setData(updatedData)
        }
    }
    

    const deleteRecord = async () => {
        if(environment == "freeagent"){
            try {
                const FAClient = window.FAClient;
                await freeAgentApi.updateFARecord(FAClient, appName, selectedRecordId)
                setInterval(()=>{
                    setShowLoadingModal(true)
                },600)
                setTimeout(async ()=>{
                    const response = await getData(appName)  
                    setData(response)
                    setShowLoadingModal(false)
                },500)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }else{
            await nlightnApi.deleteRecord(appName,"id",selectedRecordId)
            const updatedData = await getData(appName)
            setData(updatedData)
        }
    }


    const pageStyle = {
        fontSize: "12px",
        height: "100%",
        width: "100%",
        overflow: "hidden"
    }

    const cellStyle={
        whiteSpace: "nowrap",
        maxWidth: "150px",
        height: "20px"
    }


    const handleInputChange=(e)=>{
        const {name, value} = e.target 
        setFormData({...formData,...{[name]:value}})
        setUpdatedForm({...updatedForm,...{[name]:value}})
    }

    const onCellClicked = (e) => {
        setSelectedRecordId(e.data.id)
        setFormData(e.data)
      }

      const props = {
        disabled: false,
        readOnly: false
      }

      useEffect(()=>{
        
      },[data])

      const modalStyle={
        position: "fixed",
        zIndex: 9999,
        height: "200px",
        width: "300px",
        transform: "translate(-50%, -50%)"
      }


  return (
    <div className="d-flex flex-column" style={pageStyle}>

        <h2 className="text-center">nlightnlabs FreeAgent Iframe Test</h2>

        <div className="d-flex w-100" style={{height:"700px", width: "100%"}}>

        <div className="d-flex flex-column m-3 bg-light p-3 rounded-3 shadow" style={{position: "relative", width: "300px", height:"700px", overflowY: "hidden"}}>
            
            <div className="form-floating mb-3">
                <input name= "app_name" value={appName} placeholder="app_name" onChange={(e)=>setAppName(e.target.value)} 
                    className="form-control" 
                    style={{ fontSize: "12px", color: "rgb(50,150,250)"}}>
                </input>
                <label htmlFor="app_name" className="form-label">App system name: </label>
            </div>

            <div className="d-flex justify-content-center">
                <button className="btn btn-primary" onClick={(e)=>handleGetData()}>Get Data</button>
            </div>

            {appName !="" && appName !=null && data.length>0 &&
                <div className="d-flex flex-column" style={{borderTop: "1px solid lightgray", height:"700px", overflowY: "hidden"}}>
                    {Object.keys(formData).length> 0  && 
                        <div className="d-flex flex-column" style={{height:"80%", overflowY: "auto"}}>
                            {Object.keys(formData).map((key, index)=>(
                                <div key={index} className="form-floating mb-3">
                                    <input id={key} name= {key} value={formData[key] || ""} className="form-control" placeholder={key} onChange={(e)=>handleInputChange(e)} style={{fontSize: "12px", color: "rgb(50,150,250)"}}></input>
                                    <label htmlFor={key} className="form-label">{toProperCase(key.replaceAll("_"," "))}</label>
                                </div>
                            ))}
                        </div>
                    }
                    <div className="d-flex justify-content-center mt-3">
                        <div className="btn-group">
                            <button className="btn btn-outline-success" onClick={(e)=>addRecord()}>Add</button>
                            <button className="btn btn-outline-primary" onClick={(e)=>updateRecord()}>Update</button>
                            <button className="btn btn-outline-danger" onClick={(e)=>deleteRecord()}>Delete</button>
                        </div>
                    </div>
                </div> 
            }
            </div> 

        <div className="d-flex p-3 w-75" style={{height:"700px"}}>
            <div id="myGrid" style={{height: 700, width:"100%"}} className="ag-theme-quartz">
                <AgGridReact
                    rowData={data}
                    columnDefs={fields}
                    onCellClicked = {onCellClicked}
                />
            </div>
        </div>
        </div>
        { 
            showLoadingModal &&
            <div 
                className="d-flex justify-contents-center align-items-center" 
                style={modalStyle}
            >
                <Spinner/>
            </div>
        }
    </div>
  );
}

export default App;
