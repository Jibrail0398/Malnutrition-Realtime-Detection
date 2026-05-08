import { useState, useEffect } from "react";
import * as ort from "onnxruntime-web";

ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";


export function useModel(modelURL){
    const [session,setSession]= useState(null);
    const [loading,setLoading]= useState(true);

    useEffect(()=>{

        async function loadModel(){
            setLoading(true);
            try{
              
                const mySession = await ort.InferenceSession.create(modelURL, {
                executionProviders: ['wasm'],
                graphOptimizationLevel: 'all'
                });

                setSession(mySession);
                
    
            }catch(e){
                console.log(`Terjadi error saat load model: ${e}`);
            }finally{
                setLoading(false)
            }
        }
        loadModel();
    },[modelURL]);

    return {session,loading};
}