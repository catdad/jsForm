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
	
	// Question constructor
	// always use keyword 'new' when creating one
	var Question = this.Question = function(options){
		//set up the Question object
		var type = this.type = options.type;
		var answers = this.answers = options.answers;
		var name = this.name = options.name;
		
		//return input DOM elements
		var input = this.input = function(value){
			//create input element
			var el = document.createElement('input');
			el.type = type;
			el.name = name;
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
		DOM.id = this.name;
		DOM.classList.add('question');
		
		//this.answers.forEach(function(value, idx, arr){
		$.each(this.answers, function(idx, value){
			DOM.appendChild( input(value) );
		});
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
					$(this.DOM).find('input').each(function(idx, el){
						if (el.checked) result = el.value;
					});
					break;
				case 'marker':
					//temp - get map marker -- this should be stored in question
					var position = app.map.marker.position;
					result = { lat: position.Ya, lon: position.Za };
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
		
		var url = "https://docs.google.com/spreadsheet/formResponse?formkey=dFQ0NnIyRTJBMko3TkJIalozeDhPeXc6MQ&amp;ifq";
		
		$.ajax({
			type: "POST",
			url: url,
			data: data
		}).done(function(data){
			console.log(arguments);
		});
	};
	
	if (callback) callback();
};

(function($){
	$.fn.addQuestion = function(question){
		this.append(question.DOM);
	};
})(jQuery);

var app = new App(function(){
	var options = {
		center: new google.maps.LatLng(39.3567, -80.4793),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	var map = App.prototype.map = new google.maps.Map($("#map")[0], options);
	map.addListener('click', function(ev){
		if (map.marker){
			map.marker.setPosition(ev.latLng);
			console.log('location: ' + ev.latLng.toString() + ' update');
		}
		else{
			var marker = map.marker = new google.maps.Marker({
				position: ev.latLng,
				draggable: true,
				map: map
			});
			marker.addListener('dragend', function(ev){
				console.log('location: ' + ev.latLng.toString() );
			}); /* */
		}
	});
});

//create questions
var reportType = app.newQuestion({
	type: 'radio',
	name: 'type',
	answers: ['Injury', 'Bar', 'Other']
});
var report = app.newQuestion({
	type: 'radio',
	name: 'report',
	answers: ['Fall', 'Shovel', 'Kick']
});

//add questions to DOM
$('#form').addQuestion(reportType)
$('#form').addQuestion(report);