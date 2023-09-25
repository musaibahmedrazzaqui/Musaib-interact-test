class IntentInfo {
    constructor() {
        this.intent = "";
        this.context = "";
        this.intentConfidence = 100;
        this.lastUserUtterance = "";
        this.slots = {};
    }
}

module.exports=IntentInfo;