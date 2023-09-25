const ActionExecutionInfo = require("./ActionExecutionInfo");
const SystemTelemetryData=require("./SystemTelemetryData")
const UserInputType=require("./UserInputType")

class ExchangeRequest {
    constructor() {
        this.virtualAgentId ="";
        this.botConfig = {};
        this.userInput = "";
        this.automatedIntent = "";
        this.userInputType = new UserInputType;
        this.executionInfo=new ActionExecutionInfo;
        this.systemTelemetryData=new SystemTelemetryData;
    }
}
module.exports=ExchangeRequest;