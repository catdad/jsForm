#PGIS

This is a sample participatory GIS / volunteered geographic information application.

_I will add an extended read-me soon, with more information on how to use this application._

The major part of this project is the for builder. Although this goes against general app organization, it allows for easy creation of creating and recording questions for the app. Creating the form builder works like this:

    var myForm = new Form();

After that, creating questions works as follows:

    var myQuestion = myForm.newQuestion({
      name: 'name',
      type: 'text',
      question: 'What am I asking?'
    });
    
This app extends jQuery. After that, adding the question to the form:

    $('#form').addQuestion( myQuestion );
    
##Question Options

Most major HTML inputs are supported. _I will work to add HTML5 inputs as well._ Here are sample options for the different types of questions:

    // text input
    var options = {
      name: 'name',
      type: 'text',
      question: 'What am I asking?'
    };
    
    // radio input (select one)
    var options = {
      name: 'name',
      type: 'radio',
      question: 'Which is the best number?',
      answers: [ 'one', 'two', 'three' ]
    };
    
    // checkbox input (select many)
    var options = {
      name: 'name',
      type: 'checkbox',
      question: 'Which numbers are even?',
      answers: [ 'one', 'two', 'three' ]
    };
    
There is also a special question type for map markers. This question requires that you have Google Maps set up with your own developer key. Here are the options for one:

    // map marker question
    var options = {
      type: 'map',
      name: 'location',
      question: 'Pick a location.',
      map: {
        zoom: 8,
        center: new google.maps.LatLng(38.5002893070005, -98.5006261939997),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    };
    
The variables inside `map` are optional for creating a question, but required by Google Maps. These are passed directly to the [Google Maps API](https://developers.google.com/maps/documentation/javascript/tutorial), and all options from the [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference#MapOptions) are supported here.

There are several optional values you can specify:

##Validation

The question options takes an optional value for `validate`. The value can either be `'required'`, or a function. The function will be given one parameter, the `.response()` object, and needs to return `true` or `false`.

    //checks that a valid repose is given
    var options = {
        ...
        validate: 'required'
    };
    
    //custom validation
    var options = {
        ...
        validate: function(value){ ( checkIfValid(value) ) ? true:false }
    };
    
There are also some validation helpers to check formatting. These are in the `Form.valid` object.

    //check phone number formatting
    var options = {
        ...
        validate: myForm.valid.phone
    };
    
    //check email formatting
    var options = {
        ...
        validate: myForm.valid.email
    };
    
    //check work count requirements
    var options = {
        ...
        validate: myForm.valid.wordCount(25) //checks for 25 words or less
    };

##The Question Object

The question object exposes a few useful things.

`.DOM` is the DOM object for the question. It is linked directly to what is displayed on the page.

`.response()` returns the response of each question. This will return `null` if no response is found, or an appropriate response. For 'radio' or 'checkbox' questions, it will return an array. For 'text' questions, it returns a string. For 'map' quetions, it will return an object of the format `{ lat: 30.4349, lon: -90.4563 }`.

`.validate()` returns `true` or `false`. However, this is not required, so you should check if validate exists before calling it.

##Saving Responses

Responses are saved through a [Google Docs form](http://support.google.com/drive/bin/answer.py?hl=en&answer=87809&topic=1360904&ctx=topic). This part will need to be configured by the user with a form key and a schema for the answers.

_This section is not complete, and I still need to make that part configurable._

##Credits

My geography department has asked for an app like this several times. I finally created this so that they, and anyone else can use.
