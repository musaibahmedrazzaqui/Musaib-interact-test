const ActionExecutionInfo = require("./ActionExecutionInfo");
const SystemTelemetryData=require("./SystemTelemetryData")
const UserInputType=require("./UserInputType")

class ExchangeRequest {
    constructor() {
        this.virtualAgentId ="";
        this.botConfig = {};
        this.userInput = "";
        this.automatedIntent = "";
        this.userInputType = UserInputType.TEXT;
        this.executionInfo=new ActionExecutionInfo;
        this.systemTelemetryData=new SystemTelemetryData;
    }
}
module.exports=ExchangeRequest;