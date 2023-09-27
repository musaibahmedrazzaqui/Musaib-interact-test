const BotExchangeBranch = require("../models/BotExchangeBranch")
const ExchangeResponse = require("../models/ExchangeResponse")
const PromptDefinition = require("../models/PromptDefinition")
const UserInputType = require("../models/UserInputType")
const DFhandlers =require("../utils/DFhandlers")

function handleBotState(executionInfo){
    let botState=executionInfo.contactId + "_" + executionInfo.busNo
    //console.log(botState)
    return botState
}
async function handleEndContact(userInput,exchangeResponse,dfres){
    exchangeResponse.intentInfo.intent="End intent"
    exchangeResponse.branchName=BotExchangeBranch.ReturnControlToScript
    exchangeResponse.nextPromptSequence.prompts[0].transcript=dfres
    //exchangeResponse.customPayload=null
    exchangeResponse.botSessionState=null;
    //  exchangeResponse.nextPromptSequence.prompts[1].transcript="Should I echo anything back?"
    return exchangeResponse
}
 async function handleAutomated(userInput,exchangeResponse){
    //exchangeResponse.intentInfo.intent="Default Welcome Intent"
    const res=await DFhandlers.eventQueryWelcome(exchangeResponse.botSessionState,userInput)
    let fulfillmentMessages=res[0].queryResult.fulfillmentMessages
    if(fulfillmentMessages[0].text==undefined){
        console.log("in if",fulfillmentMessages)
        //console.log(typeof(text))
        console.log("PAYLOAD",fulfillmentMessages[0].payload)
        exchangeResponse.nextPromptSequence.customPayload=fulfillmentMessages[0].payload.fields
        
    }else{
        console.log("in else",fulfillmentMessages)
        let text=res[0].queryResult.fulfillmentMessages[0].text.text[0]
        exchangeResponse.nextPromptSequence.prompts[0].transcript=text
    }
    
    //console.log(typeof(text))
    exchangeResponse.branchName=BotExchangeBranch.PromptAndCollectNextResponse
    
    exchangeResponse.intentInfo.intent=res[0].queryResult.intent.displayName
    exchangeResponse.intentInfo.intentConfidence=res[0].queryResult.intentDetectionConfidence
    //exchangeResponse.customPayload=null
    return exchangeResponse
    
    
    //  exchangeResponse.nextPromptSequence.prompts[1].transcript="Should I echo anything back?"
    
}
async function handleText(userInput,exchangeResponse){
    
    try{
        const resultQuery= await DFhandlers.textQuery(userInput, exchangeResponse.botSessionState)
        let fulfillmentMessages=resultQuery[0].queryResult.fulfillmentMessages
        const fulfillmentLength=resultQuery[0].queryResult.fulfillmentMessages.length
        
        
        if(fulfillmentMessages[0].text==undefined){
            //console.log(typeof(text))
            console.log("PAYLOAD",fulfillmentMessages[0].payload)
            exchangeResponse.nextPromptSequence.prompts[0].mediaSpecificObject=fulfillmentMessages[0].payload
            
        }else{
            //console.log("HI")
            for(let i=0;i<fulfillmentLength;i++){
                if(!exchangeResponse.nextPromptSequence.prompts[i]){
    
                    exchangeResponse.nextPromptSequence.prompts.push(new PromptDefinition)
                }
                exchangeResponse.nextPromptSequence.prompts[i].transcript=resultQuery[0].queryResult.fulfillmentMessages[i].text.text[0]
            }
            if(resultQuery[0].queryResult.intent.endInteraction == false){
                exchangeResponse.branchName=BotExchangeBranch.PromptAndCollectNextResponse
            }else{
                exchangeResponse.branchName=BotExchangeBranch.ReturnControlToScript
            }
            
            exchangeResponse.nextPromptSequence.prompts[0].transcript=fulfillmentMessages[0].text.text[0]
            if(resultQuery[0].queryResult.intent.displayName=="Default Fallback Intent"){
               
                exchangeResponse.intentInfo.intent="UserInputNotUnderstood"
              
                exchangeResponse.branchName=BotExchangeBranch.UserInputNotUnderstood
            }else{
                
                exchangeResponse.intentInfo.intent=resultQuery[0].queryResult.intent.displayName
            }
            
            exchangeResponse.intentInfo.intentConfidence=resultQuery[0].queryResult.intentDetectionConfidence
            
        }
        //exchangeResponse.intentInfo.intent=resultQuery[0].queryResult.intent.displayName
        //exchangeResponse.intentInfo.intentConfidence=resultQuery[0].queryResult.intentDetectionConfidence
        
        return exchangeResponse
    }catch(err){
        console.log(err)
    }
}
function handleDTMF(userInput,exchangeResponse){
    exchangeResponse.intentInfo.intent="DTMF intent"
    
    exchangeResponse.nextPromptSequence.prompts[0].transcript=userInput
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
function handleTimeout(userInput,exchangeResponse){
    exchangeResponse.intentInfo.intent="userinputtimeout"
    exchangeResponse.branchName=BotExchangeBranch.UserInputTimeout
    exchangeResponse.nextPromptSequence.prompts[0].transcript="Timing out due to no input "
    //exchangeResponse.customPayload=null
    //  exchangeResponse.nextPromptSequence.prompts[1].transcript="Should I echo anything back?"
    return exchangeResponse
}

const customManager=async(exchangeRequest)=>{
    console.log("inside custom manager",exchangeRequest)
    let exchangeResponse=new ExchangeResponse;
    //console.log(exchangeRequest.userInput)
    let executionInfo=exchangeRequest.executionInfo
    let userInputType=exchangeRequest.userInputType
    try{
        if(exchangeRequest.botSessionState ==null){
            //console.log("debug 1")
            let state = handleBotState(executionInfo)
            exchangeResponse.botSessionState={state}
        }else{
            exchangeResponse.botSessionState=exchangeRequest.botSessionState
        }
    }catch(err){
        console.log("ERROR",err)
        return err
    }
    //console.log("debug 2")
   
    
    //handling by userInputType
    if(userInputType===0){
        finalizedResponse=handleTimeout(exchangeRequest.userInput,exchangeResponse)
        
    }

    else if(userInputType==UserInputType.TEXT){
        console.log("in text")
        finalizedResponse=await handleText(exchangeRequest.userInput,exchangeResponse)
        
        //console.log("FINALIZED",finalizedResponse.nextPromptSequence)
        
       
     //   finalizedResponse.nextPromptSequence.prompts[0].transcript=resultQuery[0].queryResult.fulfillmentMessages[0].text.text[0]
        //finalizedResponse.customPayload=null

    //return exchangeResponse
    }else if(userInputType==2){
        finalizedResponse=handleBase64(exchangeRequest,exchangeResponse)
    }else if(userInputType==6){
        finalizedResponse=handleDTMF(exchangeRequest.userInput,exchangeResponse)
    }else if(userInputType==5){
        finalizedResponse=await handleAutomated(exchangeRequest.userInput,exchangeResponse)
        console.log("DEBUG")
    }

    return finalizedResponse
}

module.exports={customManager}