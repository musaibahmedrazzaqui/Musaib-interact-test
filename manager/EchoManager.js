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
    //exchangeResponse.nextPromptSequence.prompts[0].transcript="You sent an audio!"
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

module.exports={echoManager}