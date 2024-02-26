import { useEffect, useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"


function App() {

    //Set up local states
    const [purchaseReqs, setPurchaseReqs] = useState(null);

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
    
    //INPUT FROM FREEAGENT Specifiy App to bring in
    const PURCHASE_REQ_APP = 'custom_app_53';

    const initializeFreeAgentConnection = () => {
        const FAAppletClient = window.FAAppletClient;
        
        //Initialize the connection to the FreeAgent this step takes away the loading spinner
        const FAClient = new FAAppletClient({
            appletId: 'test-app-iframe',
        });
    
        //Bridge to access freeagent apps
        FAClient.listEntityValues({
            entity: PURCHASE_REQ_APP,
            limit: 100,
            fields: [
                "seq_id",
                "request_date",
            ]
        }, (purchaseReqs) => {
                console.log('initializeFreeAgentConnection Success!', purchaseReqs);
            if (purchaseReqs) {
                setPurchaseReqs(purchaseReqs);
            }
        });

         //OUTPUT 
        //Function to create a new record/entity in FA app
        // FAClient.createEntity({
        //     entity:"requests",
        //     field_values: {
        //         request_type: "",
        //         subject: "",
        //         requester: "",
        //     }
        // })

        //Function to update or delete a record/entity in FA app
        // FAClient.updateEntity({
        //     entity:"requests", // app name
        //     id:"", //What record to update
        //     field_values: {
        //         request_type: "",
        //         subject: "",
        //         requester: "",
        //         deleted: false //ONLY USE IF need to delete
        //     }
        // })
    };

    const [formData, setFormData] = useState({
        entity: "",
        id: ""
    })

    const handleChange = (e)=>{
        e.preventDefault()
        const {name,value} = e.target
        let key = name.toLowerCase().replaceAll(" ","_")
        setFormData({...formData,...{[key]:value}})
        console.log({...formData,...{[key]:value}})
    }

    return (
    
    <div className="App justify-content-center">

        <h2>FreeAgent Iframe Integration Test App</h2>
        
        <div className="d-flex flex-column" style={{margin: "auto", width: "500px"}}>
            <form>
                <div className="form-floating mb-3">
                    <input id="entity" name="entity" className="form-control" placeholder="App Name" onChange={(e)=>handleChange(e)}></input>
                    <label htmlFor="entity" className="form-label" style={{color: "lightgray"}}>App Name</label>
                </div>
                <div className="form-floating">
                    <input id="id" name="id" className="form-control" placeholder="Record Id" onChange={(e)=>handleChange(e)}></input>
                    <label htmlFor="id" className="form-label" style={{color: "lightgray"}}>Record Id</label>
                </div>
            </form>
            <div className="d-flex justify-content-center">
                <button className="btn btn-primary">Submit</button>
            </div>
        </div>

        {purchaseReqs && (
            purchaseReqs.map(pReq => (
            <div>{pReq.field_values.description.value}</div>
            ))
        )}

    </div>
    );
}

export default App;