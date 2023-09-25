const UserInputCollectType = require("./UserInputCollectType");
const CollectDtmfRules = require("./CollectDtmfRules");
const PromptBargeConfiguration = require("./PromptBargeConfiguration");
const AudioTranscriptionConfig = require("./AudioTranscriptionConfig");

class AudioCollectionRules {
    constructor(){
      this.collectionType = UserInputCollectType.SEND_UTTERANCE_AUDIO;
    this.dtmfRules = new CollectDtmfRules();
    this.bargeConfiguration = new PromptBargeConfiguration();
    this.audioTranscriptionConfig = new AudioTranscriptionConfig();
    }
 
}
module.exports=AudioCollectionRules