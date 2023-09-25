const PromptSequence = require("./PromptSequence");

class SilenceRules {
    constructor() {
        this.engageComfortSequence = false;
        this.botResponseDelayTolerance = 0;
        this.comfortPromptSequence = new PromptSequence;
        this.millisecondsToWaitForUserResponse = 0;
    }
}

module.exports=SilenceRules;