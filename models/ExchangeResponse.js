const BotExchangeBranch=require("./BotExchangeBranch")
const PromptSequence = require("./PromptSequence")
const IntentInfo=require("./IntentInfo")
const PromptBehaviors=require("./PromptBehaviors")
const BotErrorDetails = require("./BotErrorDetails")
class ExchangeResponse{
    constructor(){
        this.branchName=BotExchangeBranch.PromptAndCollectNextResponse
        this.nextPromptSequence=new PromptSequence
        this.intentInfo=new IntentInfo
        this.nextPromptBehaviors=new PromptBehaviors
        this.customPayload={}
        this.errorDetails=new BotErrorDetails
        this.botSessionState={}
    }
}
module.exports=ExchangeResponse