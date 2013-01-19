#jsForm

This project is a lightweight forms library that can construct, validate, and otherwise manipulate custom HTML forms. Although this goes against general site organization (some of your content will be in JS, rather than HTML), it allows easier creating and recording questions for the app. Creating the form builder works like this:

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
      name: 'name', //specify unique name
      type: 'text',
      question: 'What am I asking?'
    };
    
    // radio input (select one)
    var options = {
      name: 'name', //specify unique name
      type: 'radio',
      question: 'Which is the best number?',
      answers: [ 'one', 'two', 'three' ]
    };
    
    // checkbox input (select many)
    var options = {
      name: 'name', //specify unique name
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

`validate` options for validation of the question. *See section below.*

`schema` specifies the key for the `.allResponses()` object. Use this if you need a JSON object with specific non-descriptive keys. If this value is not specified, `name` is used instead. *This is useful if submitting to a Google Form, where the keys are in the form `entry.0.single`.*

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
        validate: function(value){ return ( checkIfValid(value) ) ? true:false }
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
    
    //check word count requirements
    var options = {
        ...
        validate: myForm.valid.wordCount(25) //checks for 25 words or less
    };
    
Checkbox questions have the following helpers:

    myForm.valid.checkbox.countExact(5); //select exactly 5
    myForm.valid.checkbox.countOrLess(5); //select 5 or less
    myFOrm.valid.checkbox.countOrMore(5); //select 5 or more
    
*Note: these helpers do not check against question type. Make sure that the helper makes sense for the question type you are using.*

##The Question Object

The question object exposes a few useful things.

`.DOM` is the DOM object for the question. It is linked directly to what is displayed on the page.

`.response()` returns the response of each question. This will return `null` if no response is found, or an appropriate response. For 'radio' or 'checkbox' questions, it will return an array. For 'text' questions, it returns a string. For 'map' quetions, it will return an object of the format `{ lat: 30.4349, lon: -90.4563 }`.

`.validate()` returns `true` or `false`. However, this is not required, so you should check if validate exists before calling it.

##Saving Responses

The `Form` object has the helper `.allResponses()`, which will return all validated responses. This is essentially the JSON object for the form output.

*TODO*

Responses are saved through a [Google Docs form](http://support.google.com/drive/bin/answer.py?hl=en&answer=87809&topic=1360904&ctx=topic). This part will need to be configured by the user with a form key and a schema for the answers.

_This section is not complete, and I still need to make that part configurable._

##Credits

My geography department has asked for a participatory GIS app various times. I finally created a sample app, and this library came from the need for a stupid-simple way to create complex custom questions.
