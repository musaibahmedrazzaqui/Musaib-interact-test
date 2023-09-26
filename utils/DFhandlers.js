
const dialogflow = require('@google-cloud/dialogflow')
const config=require("./config")



//handling config files here

const privateKey=config.googlePrivateKey
const projectId=config.googleProjectId

const credentials={
    client_email:config.googleClientEmail,
    private_key:config.googlePrivateKey
}

const dialogflowClient = new dialogflow.SessionsClient({credentials});

const textQuery=async(userText,userId)=>{
    //let response=""
    //const sessionPath=dialogflowClient.sessionPath(projectId, userId)
    console.log("debug 4")
    let sessionPath=dialogflowClient.projectAgentSessionPath(projectId,userId)
    const request={
        session:sessionPath,
        queryInput:{
            text:{
                text:userText,
                languageCode:config.languageCode
            }
        }
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

module.exports={
    textQuery
}