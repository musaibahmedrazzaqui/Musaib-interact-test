
const dialogflow = require('@google-cloud/dialogflow')
const config=require("./config")
const {struct} = require('pb-util');


//handling config files here

const privateKey=config.googlePrivateKey
const projectId=config.googleProjectId

const credentials={
    client_email:config.googleClientEmail,
    private_key:config.googlePrivateKey
}

const dialogflowClient = new dialogflow.SessionsClient({credentials});
const textQuery=async(userText,userId,userPayload)=>{
    //let response=""
    //const sessionPath=dialogflowClient.sessionPath(projectId, userId)
    //console.log("debug 4")
    //const payloadToSend=struct.encode(userPayload)
   // console.log("inside dfhandlers")
    let sessionPath=dialogflowClient.projectAgentSessionPath(projectId,userId)
    //console.log("SESSION PATH",sessionPath)
    const request={
        session:sessionPath,
        queryInput:{
            text:{
                text:userText,
                languageCode:config.languageCode
            }
        },
       
    }

    try{
        const response=await dialogflowClient.detectIntent(request)
        //console.log(response)
        return response
        //console.log("debug 5")
        //eturn response
    }catch(err){
        console.log(err)
        return err
    }
    //console.log("debug 7")
    //return response
}
const textQueryPayload=async(userText,userId,userPayload)=>{
    //let response=""
    //const sessionPath=dialogflowClient.sessionPath(projectId, userId)
    //console.log("debug 4")
    
    const payloadToSend=struct.encode(userPayload)
    console.log("inside dfhandlers",payloadToSend)
    let sessionPath=dialogflowClient.projectAgentSessionPath(projectId,userId)
    //console.log("SESSION PATH",sessionPath)
    
    const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: userText,
            languageCode: config.languageCode,
          },
        },
        queryParams: {
          payload: payloadToSend,
        },
      };

    try{
        //console.log(request)
        const response=await dialogflowClient.detectIntent(request)
        //console.log(response)
        return response
        //console.log("debug 5")
        //eturn response
    }catch(err){
        console.log(err)
        return err
    }
    //console.log("debug 7")
    //return response
}
const eventQuery=async(userId,userInput)=>{
    let sessionPath=dialogflowClient.projectAgentSessionPath(projectId,userId)
    
    const request={
        session:sessionPath,
        queryInput:{
            event:{
                name:userInput,
                languageCode:config.languageCode
            }
        }
    }

    try{
        const response= await dialogflowClient.detectIntent(request)
        //console.log(response)
        return response
        //console.log("debug 5")
        //eturn response
    }catch(err){
        console.log(err)
        return err
    }
    //console.log("debug 7")
    //return response
}
module.exports={
    textQuery,eventQuery,textQueryPayload
}