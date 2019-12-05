const Alexa = require('ask-sdk-core');

const story = 'tokyo2020.html';
var $twine = null;

// Card Content
const DisplayImg1 = {
    title: 'Doughnut',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Glazed-Donut.jpg'
};
const DisplayImg2 = {
    title: 'Muffin',
    url: 'https://www.tasteofhome.com/wp-content/uploads/2018/01/Wild-Blueberry-Muffins_EXPS_FTTMZ19_787_B03_05_7b_rms-696x696.jpg'
};
const myImage1 = new Alexa.ImageHelper()
    .addImageInstance(DisplayImg1.url)
    .getImage();
        
const myImage2 = new Alexa.ImageHelper()
    .addImageInstance(DisplayImg2.url)
    .getImage();
        
const primaryText = new Alexa.RichTextContentHelper()
    .withPrimaryText("this is amazing!!!")
    .getTextContent();


/** TO-DO: export handler here? **/
// module.exports.handler = (event, context, callback) => {
//     console.log(`handler: ${JSON.stringify(event.request)}`);
  

// read the Twine 2 (Harlowe) story into JSON
var fs = require('fs');
var contents = fs.readFileSync(story, 'utf8');
var m = contents.match(/<tw-storydata [\s\S]*<\/tw-storydata>/g);
var xml = m[0];
// because Twine xml has an attribute with no value
xml = xml.replace('hidden>', 'hidden="true">');
var parseString = require('xml2js').parseString;
parseString(xml, function(err, result) {
    $twine = result['tw-storydata']['tw-passagedata'];
});

const LaunchRequestHandler = {
    canHandle(handlerInput) {
       
       return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        console.log(sessionAttributes);

        //var room = currentRoom(sessionAttributes.event)

        const response = handlerInput.responseBuilder;
        const speakOutput = 'Test';

        response.addRenderTemplateDirective({
            type: 'BodyTemplate2',
            token: 'string',
            backButton: 'HIDDEN',
            backgroundImage: myImage2,
            image: myImage1,
            title: "space facts",
            textContent: primaryText
          });
          
        return response
          .speak(speakOutput)
              .getResponse();
      },
};

const CancelAndStopHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
      const speakOutput = 'Goodbye!';
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    },
  };
  const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
      return handlerInput.responseBuilder.getResponse();
    },
  };
  const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
      console.log(error.trace);
      return handlerInput.responseBuilder
        .speak('Sorry, I can\'t understand the command. Please say again.')
        .getResponse();
    },
  };

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    // HelloHandler,
    // HelpHandler,
    CancelAndStopHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();