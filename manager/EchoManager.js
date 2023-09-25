const ExchangeResponse = require("../models/ExchangeResponse")

//function to handleBotState
function handleBotState(executionInfo){
    let botState=executionInfo.contactId + "_" + executionInfo.busNo
    //console.log(botState)
    return botState
}

function handleAutomated(userInput){
    
}
function handleText(userInput,exchangeResponse){
    exchangeResponse.intentInfo.intent="TEXT intent"
    
    exchangeResponse.nextPromptSequence.prompts[0].transcript=userInput
    return exchangeResponse
}
function handleText(userInput,exchangeResponse){
    exchangeResponse.intentInfo.intent="DTMF intent"
    
    exchangeResponse.nextPromptSequence.prompts[0].transcript=userInput
    return exchangeResponse
}
function manager(exchangeRequest){
    console.log("inside manager")
    let exchangeResponse=new ExchangeResponse;
    //console.log(exchangeRequest.userInput)
    let executionInfo=exchangeRequest.executionInfo
    let userInputType=exchangeRequest.userInputType
    if(exchangeRequest.botSessionState ==null){
        let state = handleBotState(executionInfo)
        exchangeResponse.botSessionState={state}
    }
    //handling by userInputType
    if(userInputType===1){
        finalizedResponse=handleText(exchangeRequest.userInput,exchangeResponse)
    }else if(userInputType==2){
        handleDTMF(exchangeRequest.userInput,exchangeResponse)
    }
    return finalizedResponse
}

module.exports=manager