#PGIS
___

This is a sample participatory GIS / volunteered geographic information application.

_I will add an extended read-me soon, with more information on how to use this application._

The major part of this project is the for builder. Although this goes against general app organization, it allows for easy creation of creating and recording questions for the app. Creating the form builder works like this:

    var myApp = new App();

After that, creating questions works as follows:

    var myQuestion = myApp.newQuestion({
      name: 'name',
      type: 'text'
    });
    
This app extends jQuery. After that, adding the question to the form:

    $('#form').addquestion( myQuestion );
    
##Question Options

Most major HTML inputs are supported. _I will work to add HTML5 inputs as well._ Here are sample options for the different types of questions:

    // text input
    var options = {
      name: 'name',
      type: 'text'
    };
    
    // radio input (select one)
    var options = {
      name: 'name',
      type: 'radio',
      answers: [ 'one', 'two', 'three' ]
    };
    
    // checkbox input (select many)
    var options = {
      name: 'name',
      type: 'checkbox',
      answers: [ 'one', 'two', 'three' ]
    };
    
There is also a special question type for map markers. This question requires that you have Google Maps set up with your own developer key. Here are the options for one:

    // map marker question
    var options = {
      type: 'map',
      name: 'location',
      map: {
        zoom: 8,
        center: new google.maps.LatLng(38.5002893070005, -98.5006261939997),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    };
    
The variables inside `map` are optional for creating a question, but required by Google Maps. These are passed directly to the [Google Maps API](https://developers.google.com/maps/documentation/javascript/tutorial), and all options from the [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference#MapOptions) are supported here.

##The Question Object

The question object exposes a few useful things.

`.DOM` is the DOM object for the question. It is linked directly to what is displayed on the page.

`.response()` returns the response of each question. _This still needs to be standardized._

##Credits

My geography department has asked for an app like this several times. I finally created this so that they, and anyone else can use.
