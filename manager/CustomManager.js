const BotExchangeBranch = require("../models/BotExchangeBranch")
const ExchangeResponse = require("../models/ExchangeResponse")
const PromptDefinition = require("../models/PromptDefinition")
const UserInputType = require("../models/UserInputType")
const DFhandlers =require("../utils/DFhandlers")
const ManagerUtils=require("../utils/ManagerUtils")
const {struct} = require('pb-util');

function handleBotState(executionInfo){
    let botState=executionInfo.contactId + "_" + executionInfo.busNo
    //console.log(botState)
    return botState
}

async function handleCustomPayload(exchangeRequest,exchangeResponse,payload){
    //console.log("in custom payload",payload)
    //setDFWvalue(exchangeRequest.customPayload.customPayload.echoValue)
    
    const resultQuery= await DFhandlers.textQueryPayload(exchangeRequest.userInput, exchangeRequest.botSessionState,payload)
    //console.log(resultQuery[0].queryResult)
   
    exchangeResponse=ManagerUtils.setResponses(resultQuery,exchangeResponse,exchangeRequest.botSessionState)
        //exchangeResponse.nextPromptSequence.prompts[0].transcript=exchangeRequest.customPayload.customPayload.echoValue
    
    //  exchangeResponse.nextPromptSequence.prompts[1].transcript="Should I echo anything back?"
    return exchangeResponse
}
 async function handleAutomated(exchangeRequest,exchangeResponse){
    //exchangeResponse.intentInfo.intent="Default Welcome Intent"
    const res=await DFhandlers.eventQuery(exchangeRequest.botSessionState,exchangeRequest.userInput)
    exchangeResponse=ManagerUtils.setResponses(res,exchangeResponse,exchangeRequest.botSessionState)
    //exchangeResponse.customPayload=null
    return exchangeResponse
    
    
    //  exchangeResponse.nextPromptSequence.prompts[1].transcript="Should I echo anything back?"
    
}

async function handleText(exchangeRequest,exchangeResponse){
    
    try{
        const resultQuery= await DFhandlers.textQuery(exchangeRequest.userInput, exchangeRequest.botSessionState)
        exchangeResponse=ManagerUtils.setResponses(resultQuery,exchangeResponse,exchangeRequest.botSessionState)
        
        //exchangeResponse.intentInfo.intent=resultQuery[0].queryResult.intent.displayName
        //exchangeResponse.intentInfo.intentConfidence=resultQuery[0].queryResult.intentDetectionConfidence
        
        return exchangeResponse
    }catch(err){
        console.log(err)
    }
}
function handleDTMF(userInput,exchangeResponse){
    exchangeResponse.intentInfo.intent="DTMF intent"
    
    exchangeResponse.nextPromptSequence.prompts[0].transcript="You entered a DTMF"
    //exchangeResponse.customPayload=null
    return exchangeResponse
}
function handleBase64(exchangeRequest,exchangeResponse){
    exchangeResponse.intentInfo.intent="Base64 intent"
    let audio=exchangeRequest.base64wavFile
    exchangeResponse.nextPromptSequence.prompts[0].transcript="You sent an audio!"
    //exchangeResponse.nextPromptSequence.prompts[0].transcript="You sent an audio!"
    //console.log(exchangeResponse.nextPromptSequence.prompts[0].base64EncodedG711ulawWithWavHeader)
    //exchangeResponse.customPayload={}
    return exchangeResponse
}



const customManager=async(exchangeRequest)=>{
    //console.log("inside custom manager",exchangeRequest)
    let exchangeResponse=new ExchangeResponse;
    //console.log(exchangeRequest.userInput)
    
    let executionInfo=exchangeRequest.executionInfo
    let userInputType=exchangeRequest.userInputType
    try{
        if(exchangeRequest.botSessionState ==null){
            //console.log("debug 1")
            let state = handleBotState(executionInfo)
            exchangeRequest.botSessionState={state}
            console.log(exchangeRequest.botSessionState)
        }
    }catch(err){
        console.log("ERROR",err)
        return err
    }
    //console.log("debug 2")
   
    
    //handling by userInputType
    if(userInputType===0){
        finalizedResponse=await handleAutomated(exchangeRequest,exchangeResponse)
        
        
    }

    else if(userInputType==UserInputType.TEXT){
        console.log("in text")
        if(exchangeRequest.customPayload){
            //console.log(exchangeRequest.customPayload)
            finalizedResponse=await handleCustomPayload(exchangeRequest,exchangeResponse,exchangeRequest.customPayload)
        }else{
            finalizedResponse=await handleText(exchangeRequest,exchangeResponse)
        }
        
    }else if(userInputType==2){
        finalizedResponse=handleBase64(exchangeRequest,exchangeResponse)
    }else if(userInputType==6){
        finalizedResponse=handleDTMF(exchangeRequest.userInput,exchangeResponse)
    }
    else if(userInputType==5){
       
       if(exchangeRequest.customPayload){
        //console.log(exchangeRequest.customPayload)
        finalizedResponse=await handleCustomPayload(exchangeRequest,exchangeResponse,exchangeRequest.customPayload)
    }else{
        finalizedResponse=await handleAutomated(exchangeRequest,exchangeResponse)
    }
       }
    
    //finalizedResponse.botSessionState=exchangeRequest.botSessionState

    


    return finalizedResponse
}

module.exports={customManager}