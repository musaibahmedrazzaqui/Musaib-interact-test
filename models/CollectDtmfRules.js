
class CollectDtmfRules {
    constructor() {
        this.detectDtmf = false;
        this.clearDigits = false;
        this.terminationCharacters = "";
        this.stripTerminator = false;
        this.interDigitTimeoutMilliseconds=0;
        this.maxDigits=0;
    }
}

module.exports=CollectDtmfRules;