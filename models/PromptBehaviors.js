const AudioCollectionRules = require("./AudioCollectionRules");
const SilenceRules = require("./SilenceRules");

class PromptBehaviors {
    constructor() {
        this.silenceRules=new SilenceRules
        this.audioCollectionRules=new AudioCollectionRules
    }
}
module.exports=PromptBehaviors;

