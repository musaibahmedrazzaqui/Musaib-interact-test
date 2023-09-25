class PromptDefinition {
    constructor() {
        this.transcript = "";
        this.base64EncodedG711ulawWithWavHeader = "";
        this.audioFilePath = "";
        this.textToSpeech = "";
        this.mediaSpecificObject = {};
    }
}

module.exports=PromptDefinition;