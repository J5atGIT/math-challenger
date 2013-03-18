(function() {
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

	EventTarget.call( this );

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
		timer = new Timer(timeLimit, function() { oMM.end(); });
		timer.start();
	}



	this.close = function() {
		timer.kill();
		setComplete( true );
	};

	this.grade = function( _close ) {
		if ( isComplete() === true ) { return; }

		var numberOfQuestionsCorrect = 0,
			questionsAnswered = 0;
		
		for ( var i = 0; i < questions.length; i++ ) {
			console.log( 'true answer: ' + questions[i].answer + ':userAnswer: ' + questions[i].userAnswer );
			if ( questions[i].answer == questions[i].userAnswer ) {
				++numberOfQuestionsCorrect;
			}
			if ( questions[i].userAnswer ) {
				++questionsAnswered;
			}
		}

		setComplete(true);
		timer.kill();
		
		var answerContainerElement = document.createElement("span");
		answerContainerElement.setAttribute( 'id', 'htmlAnswerDisplayPanel' );
		var answerTextNode = document.createTextNode( "Your score is " + Math.floor(numberOfQuestionsCorrect/numberOfQuestions * 100) + '%.');
		var brNode = document.createElement( 'br' );
		answerContainerElement.appendChild( answerTextNode );
		answerContainerElement.appendChild( brNode );
		answerContainerElement.appendChild( document.createTextNode(  'You got ' + numberOfQuestionsCorrect + ' correct.' ) );

		var testResults = {
			name: name,
			type: type,
			operation: function(chunk, context, bodies) {
				if (type === 'multiplication' || type === 'division') {
					chunk.render( bodies.block, context );
				}
			},
			multiplicator: multiplicator,
			questionsPercent: Math.floor(numberOfQuestionsCorrect/numberOfQuestions * 100) + '%',
			questionsAnswered: questionsAnswered,
			questionsCorrect: numberOfQuestionsCorrect,
			timeSpent: timer.getElapsedTime()
		};
		
		dust.render( 'demo2', testResults, function( err, out ) {
				modal.open( { content: out } );
			}
		);
	};


	this.start = function() {
		this.next();
		this.fire( 'start' );
	}

	this.next = function( _form ) {

		if ( _form && ( _form.answerField.value === null || _form.answerField.value === '' ) ) {
			return false;
		}

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
				textNode = ( currentQuestion + "> " + 
						questions[currentQuestion-1].multiplicator + " x " + 
						questions[currentQuestion-1].multiplicand + " = ");
			}
			else if ( type == 'division' ) {
				textNode = (currentQuestion + "> " + 
						questions[currentQuestion-1].dividend + " / " + 
						questions[currentQuestion-1].divisor + " = ");
			}
			else if ( type == 'addition' ) {
				textNode = (currentQuestion + "> " + 
						questions[currentQuestion-1].augend + " + " + 
						questions[currentQuestion-1].addend + " = ");
			}
			else if ( type == 'subtraction' ) {
				textNode = (currentQuestion + "> " + 
						questions[currentQuestion-1].minuend + " - " + 
						questions[currentQuestion-1].subtrahend + " = ");
			}

			// ui = document.getElementById( "question-display-canvas" );
			// rplElement = document.getElementById( "content-area-span" );

			// var containerElement = document.createElement("span");
			// containerElement.setAttribute( "id", "content-area-span" );

			// var formElement = document.createElement( 'form' );
			// formElement.setAttribute('id', 'htmlFormAnswerPanel');
			// formElement.setAttribute('onSubmit', 'oMM.next( this ); return false;');
			// var inputElement = document.createElement('input');
			// inputElement.setAttribute('type', 'text');
			// inputElement.setAttribute('id', 'answerField');
			// inputElement.setAttribute('name', 'answer');
			// inputElement.setAttribute( 'autocomplete', 'off' );
			// inputElement.setAttribute( 'title', 'Enter a numeric answer.' );
			// inputElement.setAttribute( 'pattern', '[0-9]{1,3}' );
			
			// formElement.appendChild(inputElement);
			// containerElement.appendChild(textNode);
			// containerElement.appendChild(formElement);
			// modal.open({content:containerElement});
			// document.getElementById( 'answerField' ).focus();
			dust.render( 'demo', { text: textNode }, function( err, out ) {
  				modal.open( { content: out } );
			});

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
Test.prototype = new EventTarget();
Test.prototype.constructor = Test;

function Timer( _length, _onEndFunc ) {
	var length = _length;
	var maximumTime = _length;
	var active = false;
	var handle;
	var ui;
	var onEndFunc = _onEndFunc;
	var ownerFunc = this;
	var remainingTime = length;
	var timerCalibrationFIXED = 60;
	var adjustmentFactor = getConversionFactor();
	var increment = getConversionFactor() * 1000;

	function getConversionFactor() {
		return (length / timerCalibrationFIXED);
	}

	this.start = function() {
		if ( isActive() === false ) { 
			setActive(true);
			ui = document.getElementById("timer-display-canvas");
			this.execute();
		}
	};

	this.execute = function() {
		var rightValue;

		remainingTime = (remainingTime - adjustmentFactor);
		scaledValue = (remainingTime * timerCalibrationFIXED) / length;
		console.log( 'in execute of timer... Timer Length: ' + length + " :: remainingTime: " + remainingTime + ' adjustment (rightValue):: ' + scaledValue + ' ::increment::' + increment) ;
		//remainingTime = (remainingTime/adjustmentFactor) - 1;
		rightValue = ( scaledValue * 6 ) + "px";
		ui.style.clip = "rect(0px," + rightValue + ", 40px, 0px)";
		if (remainingTime > 0) {
			handle = setTimeout( ownerFunc.execute.bind( ownerFunc ), increment );	
		}
		else {
			this.stop();
		}
	};

	this.getElapsedTime = function() {
		return length - remainingTime;
	}

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

function ProblemSet(_size, _symbol) {
	this.size = _size || 0;
	this.symbol = _symbol || '###';
	this.aSet = [];

	this.getArraySet = function() {
		return this.aSet;
	};

	this.getSymbol = function() {
		return this.symbol;
	};

	this.setSize = function( _size ) {
		this.size = _size;
	};

	this.getRandomNumber = function( _limit ) {
		return Math.floor( ( Math.random() * _limit) + 1 );
	};

	this.getRandomQuestion = function() {
		return this.aSet[ this.getRandomNumber( this.size ) ];
	};
}

function AdditionProblemSet( _size, _symbol, _range ) {
	ProblemSet.call( this, _size, _symbol );
	var range = _range;

	this.populate = function() {
		var augend, addend;

		for ( var i = 0; i < this.size; i++ ) {
			augend = this.getRandomNumber( range.max );
			addend = this.getRandomNumber( range.max );
			problem = { 'augend': augend,'addend': addend, 'sum': (augend + addend), 'answer': (augend + addend) };
			this.aSet.push( problem );
			console.log( problem );
		}

		return this.aSet;
	};
}
AdditionProblemSet.inherits( ProblemSet );

function SubtractionProblemSet( _range, _size ) {
	var range = _range;
	this.size = _size;
	this.aSet = [];
	this.symbol = '-';

	this.populate = function() {
		var minuend, subtrahend;
		for ( var i = 0; i < this.size; i++ ) {
			minuend = this.getRandomNumber( range.max );
			subtrahend = this.getRandomNumber( minuend );
			problem = { 'minuend': minuend,'subtrahend': subtrahend, 'difference': ( minuend - subtrahend ), 'answer': ( minuend - subtrahend ) };
			this.aSet.push( problem );
		}

		return this.aSet;
	};
}
SubtractionProblemSet.inherits( ProblemSet );

function DivisionProblemSet( _divisor, _range, _size ) {
	var divisor = _divisor;
	var range = _range;
	this.size = _size;
	this.symbol = '/';
	this.aSet = [];

	this.populate = function() {
		var dividend;
		
		for ( var i = 0; i < this.size; i++ ) {
			dividend = this.getRandomNumber( range.max );
			problem = {'type': 'division', 'dividend': dividend,'divisor': divisor, 'quotient': (dividend/divisor), 'answer': (dividend/divisor) };
			this.aSet.push( problem );
			console.log( 'aSet Length: ' + JSON.stringify( this.aSet[i] ) );
		}

		return this.aSet;
	};
}
DivisionProblemSet.inherits( ProblemSet );

function MultiplicationProblemSet( _multiplicator, _range, _size ) {
	var multiplicator = _multiplicator
	var range = _range;
	this.size = _size;
	this.symbol = 'x';
	this.aSet = [];

	this.populate = function() {
		var multiplicand;
		
		for ( var i = 0; i < this.size; i++ ) {
			multiplicand = this.getRandomNumber( range.max );
			problem = { 'type': 'multiplication', 'multiplicand': multiplicand,'multiplicator': multiplicator, 'product': (multiplicator*multiplicand), 'answer': (multiplicator*multiplicand) };
			this.aSet.push( problem );
			console.log( 'aSet: ' + JSON.stringify( this.aSet[i] ) + ' :Length: ' + this.aSet.length );
		}

		return this.aSet;
	};
}
MultiplicationProblemSet.inherits( ProblemSet );

	function TimesTable(_multiplicator, _size, _startIndex) {
		var multiplicator = _multiplicator;
		var size = _size;
		var startIndex = _startIndex || 0;
		var timesTableAsJSON = renderTableAsJSON();
		console.log(timesTableAsJSON);

		function multiply(_number) {
			return multiplicator * _number;
		}

		function renderTableAsJSON() {
			var jsonTable = [];
			for (var i = startIndex; i <= size; i++) {
				jsonTable.push({'multiplicator':multiplicator, 'index':i, 'answer':multiply(i)});
			}

			return jsonTable;
		}

		this.getMultiplicator = function() {
			return multiplicator;
		};

		this.renderTable = function() {
			var fullTableAsText = '';

			for (var i = startIndex; i <= size; i++) {
				fullTableAsText += multiplicator + " x " + i + " = " + multiply(i) + "\n";
			}
		};

		this.getRandomQuestion = function() {
			return timesTableAsJSON[Math.floor(Math.random()*size)]
		};
	}

	function OMChallengerController() {
		var multiplicator = 5;
		var displayId;
		var aTimesTable = [];
		var oTimer;
		var aAnswers
	}

	function MMChallengerController() {
		var modalRef, 
			configPath = '/math-challenger/config/config.json',
			appConfig,
			test;
		var userParams = {
			level: -1,
			operation: null,
			addendum: null,
			testConfig: null
		};

		init();

		function init() {
			fetchAppConfig();
		}

		function fetchAppConfig() {
			var oXMLHttpRequest = new XMLHttpRequest();
			oXMLHttpRequest.open( 'GET', configPath, false ); // asynchronous = false;
			oXMLHttpRequest.onload = function() {
				setConfig( JSON.parse( this.responseText ));
			};
			oXMLHttpRequest.send();
		}

		function setConfig( _data ) {
			appConfig = _data;
		}

		function setEnvironment() {
			if ( userParams.operation == null || userParams.level == -1 ) {
				console.log( "returning... Select and operation and a level" );
				return;
			}

			// Match UserParam settings to appConfig settings.
			var appConfigOperationsRef, appConfigLevelRef;
			// Get Operations Handle
			for ( var key in appConfig.operations ) {
				if ( key == userParams.operation ) {
					appConfigOperationsRef = appConfig.operations[key];
					break;
				}
			}
			if ( appConfigOperationsRef == null ) {
				console.log ( "returning... Operation not found in appConfig." );
				return;
			}
			// Get Level Handle
			for ( var key2 in appConfigOperationsRef.levels ) {
				if ( key2 === userParams.level ) {
					appConfigLevelRef = appConfigOperationsRef.levels[key2];
					userParams.testConfig = appConfigLevelRef;
					break;
				}
			}
			// Render Components
			// Show Instructions
			document.getElementById( 'mmLevelInfoText' ).innerHTML = appConfigLevelRef.text;
			// Check for additional display panels ( 'selectors' )
			if ( appConfigLevelRef.selector != null ) {
				render( appConfigLevelRef.selector  );
				userParams.addendum = -1;
			}
			else {
				userParams.addendum = null;
				if ( document.getElementById( 'mmInfoPanelAddendum' ) != null ) {
					document.getElementById( 'mmInfoPanelAddendum' ).style.display = 'none';
				}
			}
			document.getElementById( 'mmLevelInfoPanel' ).style.display = 'inline-block';
		}
		// Should be replaced with DUST.js
		function render( _data ) {
			var optionValue,
				optionText,
				textNode,
				selectNodeRef, 
				optionNodeRef, 
				pNodeRef = document.createElement( 'p' );
				pNodeRef.setAttribute( 'id', 'mmInfoPanelAddendum' );
			// var documentTextNode = document.createTextNode( _data.text )
			if ( _data.type == 'select' ) {
				selectNodeRef = document.createElement( 'select' );
				selectNodeRef.setAttribute( 'id', 'mmIDAddendumSelect' );
				selectNodeRef.setAttribute( 'class', 'mm-block-style' );
				selectNodeRef.setAttribute( 'onChange', 'oMM.handleInfoPanelAddendumSelect( this )' );

				for ( var i = 0; i < _data.value.length; i++ ) {
					optionValue = ( i == 0 )? "null" : _data.value[i];
					optionText = ( i == 0 )? _data.text : _data.value[i];
					optionNodeRef = document.createElement( 'option' );
					optionNodeRef.setAttribute( 'value', optionValue );
					textNode = document.createTextNode( optionText );
					optionNodeRef.appendChild( textNode );
					selectNodeRef.appendChild( optionNodeRef );
				}
				if ( selectNodeRef !== null ) {
					pNodeRef.appendChild( selectNodeRef );

					var pNodeDOMRef = document.getElementById( 'mmInfoPanelAddendum' );
					if ( pNodeDOMRef ) {
						pNodeDOMRef.parentNode.replaceChild( pNodeRef, pNodeDOMRef );
					}
					else {
						var tempRefNode = document.getElementById( 'mmLevelInfoText' );
						document.getElementById( 'mmLevelInfoPanel' ).insertBefore( pNodeRef,  tempRefNode.nextSibling );
					}
				}
			}
		}

		this.start = function( _oForm ) {
			var playerName = _oForm.mmPlayerHandle.value;
			if ( userParams.addendum == -1 ) {
				console.log( "Set a value for the addendum" );
				return;
			}
			test = new Test( userParams.operation, userParams.addendum, userParams.testConfig.questions, userParams.testConfig.time, userParams.testConfig.range );
			test.addListener( 'start', function() { console.log( 'Test Started!!!' ); } );
			//test.addEventListener( 'complete', function() { console.log( 'completed' ); });
			test.start();

			// listen for when the test is completed get it's status and then act accordingly.
		};

		this.complete = function() {}

		this.next = function( _formRef ) {
			test.next( _formRef );
		};

		this.end = function() {
			test.grade();
		};
		this.reset = function() {
			test.close();
		};

		this.handleLevelSelect = function( _oFormSelect ) {
			if ( !_oFormSelect ) { 
				console.log( "Error: no handle to the LevelSelect Form passed in");
				return;
			} //
			userParams.level = ( _oFormSelect.options[_oFormSelect.selectedIndex].value != "null" )? _oFormSelect.options[_oFormSelect.selectedIndex].value : -1;
			if (userParams.operation !== null) {
				setEnvironment();
			}
		};

		this.handleOperationSelect = function( _oFormSelect ) {
			if ( !_oFormSelect ) { 
				console.log( "Error: no handle to the LevelSelect Form passed in");
				return;
			} //
			userParams.operation = ( _oFormSelect.options[_oFormSelect.selectedIndex].value != "null" )? _oFormSelect.options[_oFormSelect.selectedIndex].value : null;
			if ( userParams.level != -1 ) {
				setEnvironment();
			}
		};

		this.handleInfoPanelAddendumSelect = function ( _oFormSelect ) {
			if ( !_oFormSelect ) { 
				console.log( "Error: no handle to the Select List Form passed in");
				return;
			} //
			userParams.addendum = ( _oFormSelect.options[_oFormSelect.selectedIndex].value != "null" )? parseInt( _oFormSelect.options[_oFormSelect.selectedIndex].value ) : null;
			console.log( userParams.addendum + " : " +  _oFormSelect.options[_oFormSelect.selectedIndex].value );
		};
	}
	window['oMM'] = new MMChallengerController();
})();