
import './App.css';
import React, {useState, useEffect} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import {toProperCase} from "./functions/formatValue.js";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';
import * as crud from "./components/apis/crud.js"


function App() {

// ********************************************************************FREE AGENT CONNECTION***********************************************************
    
    // IMPORTANT:  Be sure to import crud functions file where data needs to be added, updated, or deleted and include freeagent api file in api folder

    // Set the environment to either freeagent or nlightn
    let environment = "freeagent"
    if(process.env.NODE_ENV ==="development"){
        environment = "nlightn"
    }
    window.environment = environment
    
    const useExternalScript = (src) => {
        useEffect(() => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.body.appendChild(script);

            //Initialize the connection to the FreeAgent this step takes away the loading spinner
            setTimeout(() => {
                const FAAppletClient = window.FAAppletClient;

                const FAClient = new FAAppletClient({
                    appletId: 'nlightn_iframe_template',
                });
                window.FAClient = FAClient;

            }, 500);

            return () => {
                document.body.removeChild(script);
            };
        }, [src]);
    };
    //script to itnegrate FreeAgent library
    useExternalScript('https://freeagentsoftware1.gitlab.io/apps/google-maps/js/lib.js');


// ********************************************************APP SPECIFIC CODE STARTS HERE******************************************************************************
    
    const [apps, setApps] = useState([])
    const [appList, setAppList] = useState([])
    const [data, setData] = useState([]);
    const [fields, setFields] = useState([])
    const [appLabel, setAppLabel] = useState("")
    const [appName, setAppName] = useState("")
    const [formData, setFormData] = useState({})
    const [selectedRecordId, setSelectedRecordId] = useState(null)
    const [updatedForm, setUpdatedForm] = useState({})

    
    //Get data for all apps
    const getApps = async ()=>{

        let appname = null    
        if(process.env.NODE_ENV==="production" && environment==="freeagent"){
            appname = "web_app"
        }else{
            appname = "apps"
        }

        const response = await crud.getData(appname)
        setApps(response)
        let list = []
        response.map(item=>{
            list.push(item.label)
        })
        setAppList(list)
    }

    useEffect(()=>{
       setTimeout(()=>{
            getApps()
       },500) 
    },[])


    const handleGetData = async ()=>{
        
        const response = await crud.getData(appName)  
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


    const pageStyle = {
        fontSize: "12px",
        height: environment==="freeagent" ? "700px" : "100vh",
        width: "100%",
        overflow: "hidden"
    }

    const handleSelectApp = (e)=>{
        const {name, value} = e.target 
        setAppLabel(value)

        let system_name = apps.find(item =>item.label ===value).name
        setAppName(system_name)
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

      useEffect(()=>{
        
      },[data])



  return (
    <div className="d-flex flex-column" style={pageStyle}>

        <h2 className="text-center">nlightnlabs FreeAgent Iframe Test</h2>

        <div className="d-flex w-100" style={{height:"90%", width: "100%"}}>

        <div className="d-flex flex-column m-3 bg-light p-3 rounded-3 shadow" style={{position: "relative", width: "300px", height:"100%", overflowY: "hidden"}}>

            <div className="form-floating mb-3">
                <select name= "app_name" value={appLabel} placeholder="app_name" onChange={(e)=>handleSelectApp(e)} 
                    className="form-control" 
                    style={{ fontSize: "12px", color: "rgb(50,150,250)"}}
                    >
                    {appList.map((item,index)=>(
                        <option key={index} value={item}>{item}</option>
                    ))}
                </select>
                <label htmlFor="app_name" className="form-label">App system name: </label>
            </div>
        

            <div className="d-flex justify-content-center mb-3">
                <button className="btn btn-primary" onClick={(e)=>handleGetData()}>Get Data</button>
            </div>

            {appName !="" && appName !=null && data.length>0 &&
                <div className="d-flex flex-column" style={{borderTop: "1px solid lightgray", height:"100%", overflowY: "hidden"}}>
                    {Object.keys(formData).length> 0  && 
                        <div className="d-flex flex-column p-1" style={{height:"80%", overflowY: "auto"}}>
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
                            <button className="btn btn-success" onClick={(e)=>crud.addRecord(appName, updatedForm)}>Add</button>
                            <button className="btn btn-warning" onClick={(e)=>crud.updateRecord(appName,selectedRecordId,updatedForm)}>Update</button>
                            <button className="btn btn-danger" onClick={(e)=>crud.deleteRecord(appName,selectedRecordId)}>Delete</button>
                        </div>
                    </div>
                </div> 
            }
        </div> 

        <div className="d-flex p-3 flex-column w-75" style={{height:"100%"}}>
            <div id="myGrid" style={{height: "100%", width:"100%"}} className="ag-theme-quartz">
                <AgGridReact
                    rowData={data}
                    columnDefs={fields}
                    onCellClicked = {onCellClicked}
                />
            </div>
        </div>
        </div>
    </div>
  );
}

export default App;
