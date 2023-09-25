const BotLoopErrorBehavior = require("./BotLoopErrorBehavior");
const PromptSequence=require("./PromptSequence")
class BotErrorDetails{
    constructor(){
        this.errorBehavior=BotLoopErrorBehavior.ReturnControlToScriptThroughErrorBranch
        this.errorPromptSequence=new PromptSequence
        this.systemErrorMessage=""
    }
}

module.exports=BotErrorDetails