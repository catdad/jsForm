var App = function(callback){
	//container for all questions
	var questions = this.questions = [];
	
	var newQuestion = this.newQuestion = function(options){
		//create new question
		var question = new Question(options);
		
		//add question to list
		questions.push(this);
		
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
	  	
	  	//create map
	  	var mapDOM = this.DOM = document.createElement('div');
	  	mapDOM.id = name;
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
			var position = this.marker.position;
			return { lat: position.Ya, lon: position.Za };
		};
  	};
	
	//constructor for radio question
	//options = { type, name, answers[] }
	var RadioQuestion = this.RadioQuestion = function(options){
		var answers = this.answers = options.answers;
		
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
		
		//create the DOM for this question
		var DOM = this.DOM = document.createElement('div');
		DOM.id = options.name;
		DOM.classList.add('question');
		
		//this.answers.forEach(function(value, idx, arr){
		$.each(this.answers, function(idx, value){
			DOM.appendChild( input(value) );
		});
		
		//response function
		this.response = function(){
			var result;
			
			$(this.DOM).find('input').each(function(idx, el){
				if (el.checked) result = el.value;
			});
			
			return result || null;
		};
	};
	
	// Question constructor
	// always use keyword 'new' when creating one
	var Question = this.Question = function(options){
		//get question based on type
		var that;
		
		switch (options.type){
			case 'radio':
				that = new RadioQuestion(options);
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
		
		//return the new question
		return that;
	};
	
	//add helper functions
	Question.prototype = {
		//return the selected response of the question
		// ** only works on radio responses
		response: function(){
			var result;
			
			switch(this.type){
				case 'radio':
					//go through all elements and find selected answer
					
					break;
				case 'marker':
					//temp - get map marker -- this should be stored in question
					
					break;
				default:
					result = null;
					break;
			};
			
			return result;
		}
	};
	
	var options = this.options = {
		debug: true
	};
	
	var debug = this.debug = function(message){
		if (options.debug) console.log(message);
	};
	
	/*
	var table = this.table = new Tabletop({
		key: '0AjobV6zzoAikdFQ0NnIyRTJBMko3TkJIalozeDhPeXc',
		callback: tableCallback,
		simpleSheet: false,
		parseNumbers: true,
		wanted: sheets(),
		debug: true
	}); /* */
	
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
(function($){
	$.fn.addQuestion = function(question){
		this.append(question.DOM);
	};
})(jQuery);

//this is not needed... but just becuase
(function($) {
	$.fn.hasScrollBar = function() {
		return this.get(0).scrollHeight > this.height();
	}
})(jQuery);