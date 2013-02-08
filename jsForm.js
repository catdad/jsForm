var Form = function(callback){
	//helper each function
	//acts like $.each()
	var each = this.each = function(arr, callback){
		var len = arr.length, i;
		
		for (i = 0; i < len; i++){
			callback( i, arr[i] );
		}
	};
	
	//container for all questions
	var questions = this.questions = [];
	
	var newQuestion = this.newQuestion = function(options){
		//create new question
		var question = new Question(options);
		
		//add question to list
		questions.push(question);
		
		return question;
	};
  
	//constructor for map question
	//options = { type, name, map{ center, zoom, mapTypeId } }
  	var MapQuestion = this.MapQuestion = function(options){
		//configure map options
		var mapOptions = this.mapOptions = options.map;
	  	//set up necessary variables if not present
	  	if (mapOptions && !mapOptions.center) mapOptions.center = new google.maps.LatLng(38.5002893070005, -98.5006261939997);
	  	if (mapOptions && !mapOptions.zoom) mapOptions.zoom = 4;
	  	if (mapOptions && !mapOptions.mapTypeId) mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
	  	
	  	//update map DOM
	  	var mapDOM = this.DOM = options.DOM;
		mapDOM.classList.add('map');
		
	  	var map = this.map = new google.maps.Map(mapDOM, mapOptions);
		
	  	//configure listener for marker
		var that = this;
	  	map.addListener('click', function(ev){
			//marker is saved inside Question
			if (that.marker){
				that.marker.setPosition(ev.latLng);
				console.log('location: ' + ev.latLng.toString() + ' update');
			}
			else{
				var marker = that.marker = new google.maps.Marker({
					position: ev.latLng,
					draggable: true,
					map: map
				});
				marker.addListener('dragend', function(ev){
					console.log('location: ' + ev.latLng.toString() );
				}); /* */
			}
		});
		
		this.response = function(){
			if (this.marker && this.marker.position) {
				var position = this.marker.position;
				return { lat: position.Ya, lon: position.Za };
			}
			else 
				return null;
		};
  	};
	
	//constructor for radio question
	//options = { type, name, answers[] }
	var RadioQuestion = this.RadioQuestion = function(options){
		var answers = this.answers = options.answers;
		var DOM = this.DOM = options.DOM;
		
		//return input DOM elements
		var input = this.input = function(value){
			//create input element
			var el = document.createElement('input');
			el.type = options.type;
			el.name = options.name;
			el.value = value;
			el.id = value;
			
			//create label for the element
			var label = document.createElement('label');
			label.innerHTML = value;
			label.setAttribute('for', value);
			
			//create container for each input
			var div = document.createElement('div');
			div.appendChild(el);
			div.appendChild(label);
			
			return div;
		};
		
		//this.answers.forEach(function(value, idx, arr){
		each(this.answers, function(idx, value){
			DOM.appendChild( input(value) );
		});
		
		//response function
		this.response = function(){
			var results = [];
			var values = this.DOM.getElementsByTagName('input');
			
			each(values, function(idx, el){
				if (el.checked) results.push(el.value);
			});
			
			return (results.length > 0) ? results : null;
		};
	};
	
	//constructor for text input
	//options = { type, name }
	var TextQuestion = this.TextQuestion = function(options){
		var el = document.createElement('input');
		el.type = options.type;
		el.name = options.name;
		el.id = options.name;
		
		//create the DOM for this question
		var DOM = this.DOM = options.DOM;
		
		DOM.appendChild( el );
		
		//response function
		this.response = function(){
			return textQuestion.DOM.getElementsByTagName('input')[0].value || null;
		};
	};
	
	// Question constructor
	// always use keyword 'new' when creating one
	var Question = this.Question = function(options){
		//get question based on type
		var that;
		
		//create the DOM for this question
		var DOM = document.createElement('div');
		DOM.id = options.name;
		DOM.classList.add('question');
		
		//add question to DOM
		var question = document.createElement('div');
		question.classList.add('text');
		question.innerHTML = options.question || ''; //this is ugly, sorry
		DOM.appendChild( question );
		
		//add DOM to options
		options.DOM = DOM;
		
		switch (options.type){
			case 'radio':
				that = new RadioQuestion(options);
				break;
			case 'checkbox':
				that = new RadioQuestion(options);
				break;
			case 'text':
				that = new TextQuestion(options);
				break;
			case 'map':
				that = new MapQuestion(options);
				break;
			default:
				that = null;
				break;
		};
		
		//set up the Question object
		that.type = options.type;
		that.name = options.name;
		that.question = options.question;
		that.schema = options.schema || options.name;
		
		//set up validation
		if (!options.validate)
			that.validate = null;
		else
			that.validate = function(){
				var response = this.response();
				
				if ( (typeof options.validate) === 'function' && response ){
					//call custom function -- myValidate( value )
					debug('custom validation');
					return that.validateDOM( options.validate(response) );
				}
				else if (options.validate === 'required'){
					//check if this.response() is valid
					return that.validateDOM( !!response );
				}
				else return that.validateDOM( false ); //no response was given
			};
			
		that.validateDOM = function( valid ){
			console.log('validateDOM: ' + valid);
			if (valid) that.DOM.classList.remove('invalid');
			else that.DOM.classList.add('invalid');
			
			return valid;
		}
		
		//return the new question
		return that;
	};
	
	var valid = this.valid = {
		phone: function(value){
			var clean = value.replace(/[^0-9]+/g, '');
			debug('clean string: ' + clean);
			
			return ((clean.charAt(0) !== '1' && clean.length === 10) || clean.charAt(0) === '1' && clean.length === 11);
		},
		email: function(value){
			var exp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return exp.test(value);
		},
		wordCount: function(count){
			return function(value){
				return (value.split(' ').length <= count);
			};
		},
		checkbox: {
			countExact: function(n){ return function(value){ return (value.length === n); }; },
			countOrLess: function(n){ return function(value){ return (value.length <= n); }; },
			countOrMore: function(n){ return function(value){ return (value.length >= n); }; }
		}
	};
	
	var options = this.options = {
		debug: true
	};
	
	var debug = this.debug = function(message){
		if (options.debug) console.log(message);
	};
	
	var allResponses = this.allResponses = function(){
		var responses = {};
		
		each(questions, function(idx, question){
			if (question.validate){
				responses[question.schema] = (question.validate()) ? question.response() : null;
			}
			else{
				responses[question.schema] = question.response();
			}
		});
		
		return responses;
	};
	
	var submit = this.submit = function(){
		var type = 'injury';
		var report = 'fall';
		var lat = 39.9319532526238;
		var lon = -82.96221015624998;
		
		var data = {
			"entry.0.single": type,
			"entry.1.single": report,
			"entry.2.single": lat,
			"entry.3.single": lon,
			
			"submit": "Submit",
			"pageNumber": "0",
			"backupCache": ""
		};
		
	  	var formkey = 'dFQ0NnIyRTJBMko3TkJIalozeDhPeXc6MQ';
		var url = "https://docs.google.com/spreadsheet/formResponse?formkey=" + formkey + "&amp;ifq";
		
		$.ajax({
			type: "POST",
			url: url,
			data: data
		}).done(function(data){
			debug(arguments);
		});
	};
};

//extend jQuery function
if ($){
	(function($){
		$.fn.addQuestion = function(question){
			this.append(question.DOM);
			return this;
		};
	})(jQuery);
}