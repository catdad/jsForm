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

Most major HTML inputs are supported. Here are sample options for the different types of questions:

    // text input
    var options = {
        name: 'name', //specify unique name
        type: 'text', //single line
        question: 'What am I asking?'
    };
    
    var options = {
        name: 'name', //specify unique name
        type: 'paragraph', //multi-line
        question: 'Do you have a comment?'
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

`liveValidate` whether or not to validate on change. Value is `true` or `false`. The default is `false`.

`schema` specifies the key for the `.allResponses()` object. Use this if you need a JSON object with specific non-descriptive keys. If this value is not specified, `name` is used instead. *This is useful if submitting to a Google Form, where the keys are in the form `entry.0.single`.*

##Special Inputs

There is some support for special HTML and HTML5 inputs. This is done through the `htmlType` property in the options. Inputs such as `email`, `tel`, `number`, and some others are all text fields with special behavior. To create those fields, use these options:

    var options = {
        type: 'text',
        htmlType: 'email'
        
        //optional
        validate: form.valid.email
    }
    
_Note: I have not tested or confirmed all of these options, so please test before using them._

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

Validation will also provide some helper CSS classes. It adds either a `valid` or `invalid` class to the question div. You can adjust how those classes are displayed through your CSS, such as this:

    div.question.valid { color: green; }
    div.question.invalid { color: red; }
    
    div.map.valid { border: 2px solid green; }
    div.map.invalid { border: 2px solid red; }

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

## License

This project is licensed under the MIT X11 License. Please use, adapt, and modify this project to your heart's content. Link back to this page wherever you can.
