const BotExchangeBranch = require("../models/BotExchangeBranch")

const PromptDefinition = require("../models/PromptDefinition")

const {struct} = require('pb-util');
function setResponses(resultQuery,exchangeResponse,botState){
    let fulfillmentMessages=resultQuery[0].queryResult.fulfillmentMessages
    const fulfillmentLength=resultQuery[0].queryResult.fulfillmentMessages.length
    
    
    

    if(fulfillmentMessages[0].payload){
        
        let check=struct.decode(fulfillmentMessages[0].payload)
        if(check.dfomessage){
            
            //console.log(exchangeResponse.customPayload)
            exchangeResponse.nextPromptSequence.prompts[0].mediaSpecificObject=check
        }else{
            exchangeResponse.customPayload=check
            exchangeResponse.nextPromptSequence.prompts[0].transcript=fulfillmentMessages[1].text.text[0]
            
        }
        //exchangeResponse.customPayload=struct.decode(fulfillmentMessages[0].payload)
        exchangeResponse.intentInfo.intent=resultQuery[0].queryResult.intent.displayName
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
            //exchangeResponse.botSessionState=null
        }
        
        exchangeResponse.nextPromptSequence.prompts[0].transcript=fulfillmentMessages[0].text.text[0]
        if(resultQuery[0].queryResult.intent.isFallback==true){
           
            exchangeResponse.intentInfo.intent="UserInputNotUnderstood"
          
            exchangeResponse.branchName=BotExchangeBranch.UserInputNotUnderstood
        }else{
            
            exchangeResponse.intentInfo.intent=resultQuery[0].queryResult.intent.displayName
        }
        
        exchangeResponse.intentInfo.intentConfidence=resultQuery[0].queryResult.intentDetectionConfidence
        
    }
    const checkForError=exchangeResponse.nextPromptSequence.prompts[0]
    
    if(checkForError.transcript=="" && checkForError.base64EncodedG711ulawWithWavHeader==""&&checkForError.audioFilePath=="" && checkForError.textToSpeech==""&&checkForError.mediaSpecificObject==null){
        exchangeResponse.errorDetails.errorPromptSequence.prompts[0].transcript="ERROR!"
        exchangeResponse.errorDetails.systemErrorMessage="ERROR!"
        exchangeResponse.branchName=BotExchangeBranch.Error
    }
    if(exchangeResponse.branchName==BotExchangeBranch.ReturnControlToScript){
        exchangeResponse.botSessionState=null
    }else{
        exchangeResponse.botSessionState=botState
    }
    
    return exchangeResponse
}

module.exports={setResponses}