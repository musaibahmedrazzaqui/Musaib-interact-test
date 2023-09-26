const BotExchangeBranch = require("../models/BotExchangeBranch")
const ExchangeResponse = require("../models/ExchangeResponse")
const PromptDefinition = require("../models/PromptDefinition")
const DFhandlers =require("../utils/DFhandlers")
//function to handleBotState
function handleBotState(executionInfo){
    let botState=executionInfo.contactId + "_" + executionInfo.busNo
    //console.log(botState)
    return botState
}
function handleEndContact(userInput,exchangeResponse){
    exchangeResponse.intentInfo.intent="End intent"
    exchangeResponse.branchName=BotExchangeBranch.ReturnControlToScript
    exchangeResponse.nextPromptSequence.prompts[0].transcript="allahhagiz! Bye"
    exchangeResponse.customPayload=null
    exchangeResponse.botSessionState=null;
    //  exchangeResponse.nextPromptSequence.prompts[1].transcript="Should I echo anything back?"
    return exchangeResponse
}
function handleAutomated(userInput,exchangeResponse){
    exchangeResponse.intentInfo.intent="Welcome intent"
    exchangeResponse.branchName=BotExchangeBranch.ReturnControlToScript
    exchangeResponse.nextPromptSequence.prompts[0].transcript=userInput
    exchangeResponse.customPayload=null
    //  exchangeResponse.nextPromptSequence.prompts[1].transcript="Should I echo anything back?"
    return exchangeResponse
}
function handleText(userInput,exchangeResponse){
    exchangeResponse.intentInfo.intent="TEXT intent"
    
    exchangeResponse.nextPromptSequence.prompts[0].transcript=userInput
    exchangeResponse.customPayload=null
    return exchangeResponse
}
function handleDTMF(userInput,exchangeResponse){
    exchangeResponse.intentInfo.intent="DTMF intent"
    
    exchangeResponse.nextPromptSequence.prompts[0].transcript=userInput
    exchangeResponse.customPayload=null
    return exchangeResponse
}
function handleBase64(exchangeRequest,exchangeResponse){
    exchangeResponse.intentInfo.intent="Base64 intent"
    let audio=exchangeRequest.base64wavFile
    exchangeResponse.nextPromptSequence.prompts[0].base64EncodedG711ulawWithWavHeader=exchangeRequest.base64wavFile
    exchangeResponse.nextPromptSequence.prompts[0].transcript="You sent an audio!"
    //console.log(exchangeResponse.nextPromptSequence.prompts[0].base64EncodedG711ulawWithWavHeader)
    //exchangeResponse.customPayload=null
    return exchangeResponse
}
function handleTimeout(userInput,exchangeResponse){
    exchangeResponse.intentInfo.intent="End intent"
    exchangeResponse.branchName=BotExchangeBranch.ReturnControlToScript
    exchangeResponse.nextPromptSequence.prompts[0].transcript="Timing out "+userInput
    exchangeResponse.customPayload=null
    //  exchangeResponse.nextPromptSequence.prompts[1].transcript="Should I echo anything back?"
    return exchangeResponse
}
function echoManager(exchangeRequest){
    console.log("inside manager")
    let exchangeResponse=new ExchangeResponse;
    //console.log(exchangeRequest.userInput)
    let executionInfo=exchangeRequest.executionInfo
    let userInputType=exchangeRequest.userInputType
    if(exchangeRequest.botSessionState ==null){
        let state = handleBotState(executionInfo)
        exchangeResponse.botSessionState={state}
    }else{
        exchangeResponse.botSessionState=exchangeRequest.botSessionState
    }
    //handling by userInputType
    if(userInputType===0){
        finalizedResponse=handleTimeout(exchangeRequest.userInput,exchangeResponse)
    }
    else if(userInputType===1){
        finalizedResponse=handleText(exchangeRequest.userInput,exchangeResponse)
    }else if(userInputType==2){
        finalizedResponse=handleBase64(exchangeRequest,exchangeResponse)
    }else if(userInputType==6){
        finalizedResponse=handleDTMF(exchangeRequest.userInput,exchangeResponse)
    }else if(userInputType==5){
        finalizedResponse=handleAutomated(exchangeRequest.userInput,exchangeResponse)
    }

    //handling by userinput
    if(exchangeRequest.userInput=="Bye" ||exchangeRequest.userInput=="bye".toLowerCase()||exchangeRequest.userInput=="bye".toUpperCase()){
        finalizedResponse=handleEndContact(exchangeRequest.userInput,exchangeResponse)
    }
    if(exchangeRequest.userInput=="transfer" ||exchangeRequest.userInput=="transfer".toLowerCase()||exchangeRequest.userInput=="transfer".toUpperCase()){
        finalizedResponse=handleEndContact(exchangeRequest.userInput,exchangeResponse)
    }
    return finalizedResponse
}
const customManager=async(exchangeRequest)=>{
    console.log("inside custom manager")
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
   const resultQuery= await DFhandlers.textQuery(exchangeRequest.userInput, exchangeResponse.botSessionState)
    console.log("DIALOGFLOW RESPONSE",resultQuery[0].queryResult.fulfillmentMessages[0].text.text[0])
    const fulfillmentLength=resultQuery[0].queryResult.fulfillmentMessages.length
    console.log(fulfillmentLength)
    //console.log(userInputType)
    //console.log(resultQuery)
    
    //handling by userInputType
    if(userInputType===0){
        finalizedResponse=handleTimeout(exchangeRequest.userInput,exchangeResponse)
        //finalizedResponse.nextPromptSequence.
    }
    else if(userInputType===1){
        finalizedResponse=handleText(exchangeRequest.userInput,exchangeResponse)
        finalizedResponse.intentInfo.intent=resultQuery[0].queryResult.intent.displayName
        finalizedResponse.intentInfo.intentConfidence=resultQuery[0].queryResult.intentDetectionConfidence
        for(let i=0;i<fulfillmentLength;i++){
            if(!finalizedResponse.nextPromptSequence.prompts[i]){

                finalizedResponse.nextPromptSequence.prompts.push(new PromptDefinition)
            }
            finalizedResponse.nextPromptSequence.prompts[i].transcript=resultQuery[0].queryResult.fulfillmentMessages[i].text.text[0]
        }
     //   finalizedResponse.nextPromptSequence.prompts[0].transcript=resultQuery[0].queryResult.fulfillmentMessages[0].text.text[0]
        finalizedResponse.customPayload=null

    //return exchangeResponse
    }else if(userInputType==2){
        finalizedResponse=handleBase64(exchangeRequest,exchangeResponse)
    }else if(userInputType==6){
        finalizedResponse=handleDTMF(exchangeRequest.userInput,exchangeResponse)
    }else if(userInputType==5){
        finalizedResponse=handleAutomated(exchangeRequest.userInput,exchangeResponse)
    }


    //handling by userinput
    if(exchangeRequest.userInput=="Bye" ||exchangeRequest.userInput=="bye".toLowerCase()||exchangeRequest.userInput=="bye".toUpperCase()){
        finalizedResponse=handleEndContact(exchangeRequest.userInput,exchangeResponse)
    }
    if(exchangeRequest.userInput=="transfer" ||exchangeRequest.userInput=="transfer".toLowerCase()||exchangeRequest.userInput=="transfer".toUpperCase()){
        finalizedResponse=handleEndContact(exchangeRequest.userInput,exchangeResponse)
    }
    return finalizedResponse
}
module.exports={echoManager, customManager}