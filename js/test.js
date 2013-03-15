function Question( _id, _text, _answer ) {
	var id = _id;
	var text = _text;
	var answer = _answer || -1;

	this.getAnswer = function() {
		return answer;
	};

	this.getText = function() {
		return text;
	};

	this.getId = function() {
		return id;
	};
}

function TestQuestion( _id, _text, _answer, _userAnswer ) { // extends Question.
	var id = _id;
	this.text = _text;
	this.answer = _answer;

	var userAnswer = _userAnswer || -1;

	this.getUserAnswer = function() {
		return userAnswer;
	};
	this.setUserAnswer = function(_answer) {
		userAnswer = _answer;
		return this;
	};
}
TestQuestion.inherits(Question);

function Test( _type, _multiplicator, _numberOfQuestions, _timeLimit, _range ) {
	var type = _type || 'unknown';
	var numberOfQuestions = _numberOfQuestions;
	var questions = [];
	var multiplicator = _multiplicator || 1;
	var timeLimit = _timeLimit || 10; // in seconds
	var range = _range;
	var timer;
	var currentQuestion = 0;
	var ui;
	var completed = false;

	function init() {
		build();
	}

	function build() {
		var problemSet;

		// Multiplication Test:
		if ( type == 'multiplication' ) {
			// problemSet = new TimesTable(multiplicator, numberOfQuestions, 0);
			problemSet = new MultiplicationProblemSet( multiplicator, range, numberOfQuestions );
			questions = problemSet.populate();
			console.log( 'problemset symbol: ' + problemSet.getSymbol() );
		}
		else if ( type == 'division' ) {
			problemSet = new DivisionProblemSet( multiplicator, range, numberOfQuestions );
			questions = problemSet.populate();
			console.log( 'problemset symbol: ' + problemSet.getSymbol() );
		}
		else if ( type == 'subtraction' ) {
			problemSet = new SubtractionProblemSet( range, numberOfQuestions );
			questions = problemSet.populate();
			console.log( 'problemset symbol: ' + problemSet.getSymbol() );
		}
		else if ( type == 'addition' ) {
			problemSet = new AdditionProblemSet( range, numberOfQuestions );
			questions = problemSet.populate();
			console.log( 'problemset symbol: ' + problemSet.getSymbol() );
		}
		else {
			console.log( 'exiting b/c type is not supported: ' + type );
			return;
		}

		// configure timer
		//timer = new Timer(60, function() { oTest.grade(); });
		//window["OMC"]["timer"] = timer;
		//timer.start();

		// get a handle to the UI display
		
	}

	this.grade = function() {
		if ( isComplete() === true ) { return; }

		var numberOfQuestionsCorrect = 0;
		
		for ( var i = 0; i < questions.length; i++ ) {
			console.log( 'true answer: ' + questions[i].answer + ':userAnswer: ' + questions[i].userAnswer );
			if ( questions[i].answer == questions[i].userAnswer ) {
				++numberOfQuestionsCorrect;
			}
		}
		setComplete(true);
		//timer.kill();
		alert(Math.floor(numberOfQuestionsCorrect/numberOfQuestions * 100));
	};

	this.next = function( _form ) {
		// calculate answer
		if ( _form && currentQuestion <= numberOfQuestions ) {
			questions[currentQuestion-1].userAnswer = _form.answerField.value;
			console.log( _form.answerField.value );
			_form.answerField.value = '';

		}

		if (++currentQuestion > numberOfQuestions) {
			this.grade();
		}
		else {
			var textNode;

			if ( type == 'multiplication' ) {
				textNode = document.createTextNode( currentQuestion + "> " + 
						questions[currentQuestion-1].multiplicator + " x " + 
						questions[currentQuestion-1].multiplicand + " = ");
			}
			else if ( type == 'division' ) {
				textNode = document.createTextNode(currentQuestion + "> " + 
						questions[currentQuestion-1].dividend + " / " + 
						questions[currentQuestion-1].divisor + " = ");
			}
			else if ( type == 'addition' ) {
				textNode = document.createTextNode(currentQuestion + "> " + 
						questions[currentQuestion-1].augend + " + " + 
						questions[currentQuestion-1].addend + " = ");
			}
			else if ( type == 'subtraction' ) {
				textNode = document.createTextNode(currentQuestion + "> " + 
						questions[currentQuestion-1].minuend + " - " + 
						questions[currentQuestion-1].subtrahend + " = ");
			}

			ui = document.getElementById( "question-display-canvas" );
			rplElement = document.getElementById( "content-area-span" );

			var containerElement = document.createElement("span");
			containerElement.setAttribute( "id", "content-area-span" );

			var formElement = document.createElement( 'form' );
			formElement.setAttribute('id', 'htmlFormAnswerPanel');
			formElement.setAttribute('onSubmit', 'oMM.next(this); return false;');
			var inputElement = document.createElement('input');
			inputElement.setAttribute('type', 'text');
			inputElement.setAttribute('id', 'answerField');
			inputElement.setAttribute('name', 'answer');
			inputElement.setAttribute( 'autocomplete', 'off' );
			inputElement.setAttribute( 'title', 'Enter a numeric answer.' );
			inputElement.setAttribute( 'pattern', '[0-9]{1,3}' );
			
			formElement.appendChild(inputElement);
			containerElement.appendChild(textNode);
			containerElement.appendChild(formElement);
			modal.open({content:containerElement});
			document.getElementById( 'answerField' ).focus();
		}
	};

	function setComplete(_boolean) {
		completed = _boolean;
	}

	function isComplete() {
		return completed;
	}

	init();
}

function Timer(_length, _onEndFunc) {
	var maximumTime = _length;
	var active = false;
	var count = 0;
	var handle;
	var ui;
	var onEndFunc = _onEndFunc;

	this.start = function() {
		if ( isActive() === false ) { 
			setActive(true);
			ui = document.getElementById("timer-display-canvas");
			this.execute();
		}
	};

	this.execute = function() {
		count = count + 1;
		// topValue = count*6 + "px";
		rightValue = count*6 + "px";
		ui.style.clip = "rect(0px," + rightValue + ", 40px, 0px)";
		
		if (count < maximumTime) {
			handle = setTimeout( function() { OMC.timer.execute(); }, 1000 );	
		}
		else {
			this.stop();
		}
	};

	this.stop = function() {
		clearTimeout(handle);
		setActive(false);
		if (onEndFunc) { onEndFunc(); }
	};

	this.kill = function() {
		clearTimeout(handle);
		setActive(false);
	};

	function setActive(_boolean) {
		active = _boolean; 
	}

	function isActive() {
		return active;
	}
}