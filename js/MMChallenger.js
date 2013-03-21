(function() {
	function ProblemSet( _size, _symbol ) {
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

		return this;
	}

	function AdditionProblemSet( _size, _range ) {
		ProblemSet.call( this, _size, '+' );
		var range = _range;

		this.populate = function() {
			var augend, addend;

			for ( var i = 0; i < this.size; i++ ) {
				augend = this.getRandomNumber( range.max );
				addend = this.getRandomNumber( range.max );
				problem = { 'type': 'additon', 'operator': this.symbol, 'augend': augend, 'addend': addend, 'sum': (augend + addend), 'answer': (augend + addend) };
				this.aSet.push( problem );
			}
			return this.aSet;
		};

		return this;
	}
	AdditionProblemSet.inherits( ProblemSet );

	function SubtractionProblemSet( _size, _range ) {
		ProblemSet.call( this, _size, '-' );
		var range = _range;

		this.populate = function() {
			var minuend, subtrahend;
			for ( var i = 0; i < this.size; i++ ) {
				minuend = this.getRandomNumber( range.max );
				subtrahend = this.getRandomNumber( minuend );
				problem = { 'type': 'subtraction', 'operator': this.symbol, 'minuend': minuend, 'subtrahend': subtrahend, 'difference': ( minuend - subtrahend ), 'answer': ( minuend - subtrahend ) };
				this.aSet.push( problem );
			}

			return this.aSet;
		};

		return this;
	}
	SubtractionProblemSet.inherits( ProblemSet );

	function DivisionProblemSet( _size, _range, _divisor ) {
		ProblemSet.call( this, _size, '/' );
		var divisor = _divisor;
		var range = _range;

		this.populate = function() {
			var dividend;

			for ( var i = 0; i < this.size; i++ ) {
				dividend = this.getRandomNumber( range.max );
				problem = {'type': 'division', 'operator': this.symbol, 'dividend': dividend,'divisor': divisor, 'quotient': (dividend/divisor), 'answer': (dividend/divisor) };
				this.aSet.push( problem );
				console.log( 'aSet Length: ' + JSON.stringify( this.aSet[i] ) );
			}

			return this.aSet;
		};

		return this;
	}
	DivisionProblemSet.inherits( ProblemSet );

	function MultiplicationProblemSet( _size, _range, _multiplicator ) {
		ProblemSet.call( this, _size, 'x' );
		var multiplicator = _multiplicator;
		var range = _range;

		this.populate = function() {
			var multiplicand;

			for ( var i = 0; i < this.size; i++ ) {
				multiplicand = this.getRandomNumber( range.max );
				problem = { 'type': 'multiplication', 'operator': this.symbol, 'multiplicand': multiplicand,'multiplicator': multiplicator, 'product': (multiplicator*multiplicand), 'answer': (multiplicator*multiplicand) };
				this.aSet.push( problem );
				console.log( 'aSet: ' + JSON.stringify( this.aSet[i] ) + ' :Length: ' + this.aSet.length );
			}

			return this.aSet;
		};
	}
	MultiplicationProblemSet.inherits( ProblemSet );

	function Question( _id, _text, _answer ) {
		this.id = _id;
		this.text = _text;
		this.answer = _answer || -1;

		this.getAnswer = function() {
			return this.answer;
		};

		this.getText = function() {
			return this.text;
		};

		this.getId = function() {
			return this.id;
		};

		return this;
	}

	function TestQuestion( _id, _text, _answer, _userAnswer ) { // extends Question.
		Question.call( this, _id, _text, _answer );
		this.userAnswer = _userAnswer || -1;

		this.getUserAnswer = function() {
			return this.userAnswer;
		};

		this.setUserAnswer = function( _answer ) {
			this.userAnswer = _answer;
			return this;
		};

		return this;
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
		var status = Test.INITIALIZED;
		var that = this;

		EventTarget.call( this );

		function init() {
			build();
		}

		function build() {
			var problemSet;

			// Multiplication Test:
			if ( type == 'multiplication' ) {
				problemSet = new MultiplicationProblemSet( numberOfQuestions, range, multiplicator );
				questions = problemSet.populate();
			}
			else if ( type == 'division' ) {
				problemSet = new DivisionProblemSet( numberOfQuestions, range, multiplicator );
				questions = problemSet.populate();
			}
			else if ( type == 'subtraction' ) {
				problemSet = new SubtractionProblemSet( numberOfQuestions, range );
				questions = problemSet.populate();
			}
			else if ( type == 'addition' ) {
				problemSet = new AdditionProblemSet( numberOfQuestions, range );
				questions = problemSet.populate();
			}
			else {
				console.log( 'exiting b/c type is not supported: ' + type );
				return;
			}
		}

		this.getType = function() {
			return type;
		};

		this.getQuestions = function() {
			return questions;
		};

		this.close = function() {};

		this.grade = function( _close ) {
			var oModel_, numberOfQuestionsCorrect = 0, questionsAnswered = 0;
			// Tally User Score
			for ( var i = 0; i < questions.length; i++ ) {
				if ( questions[i].answer == questions[i].userAnswer ) {
					++numberOfQuestionsCorrect;
				}

				if ( questions[i].userAnswer ) {
					++questionsAnswered;
				}
			}
			return {
				'name': 'name',
				'type': type,
				'operation': function(chunk, context, bodies) {
					if ( type === 'multiplication' || type === 'division' ) {
						chunk.render( bodies.block, context );
					}
				},
				'multiplicator': multiplicator,
				'questionsPercent': Math.floor( numberOfQuestionsCorrect/numberOfQuestions * 100 ) + '%',
				'questionsAnswered': questionsAnswered,
				'questionsCorrect': numberOfQuestionsCorrect,
				'timeSpent': '0' //timer.getElapsedTime()
			};
		};

		this.start = function( _qIdx ) {
			status = Test.START;
			this.fire( Test.START );
			return this.next( _qIdx );
		};

		this.answer = function( _answer, _qIdx ) {
			var qIdx = _qIdx || currentQuestion;
			var answer =  _answer || null;
			questions[qIdx].userAnswer = _answer;
		};

		this.next = function( _qIdx ) {
			if ( status == Test.COMPLETE ) { return null; }
			if ( _qIdx >= numberOfQuestions ) {
				this.complete();
				return null;
			}
			// Build the Model
			var oQModel = {}, factor1, factor2;
			switch ( type ) {
				case 'multiplication':
					factor1 = questions[_qIdx].multiplicator;
					factor2 = questions[_qIdx].multiplicand;
					break;
				case 'division':
					factor1 = questions[_qIdx].dividend;
					factor2 = questions[_qIdx].divisor;
					break;
				case 'addition':
					factor1 = questions[_qIdx].augend;
					factor2 = questions[_qIdx].addend;
					break;
				case 'subtraction':
					factor1 = questions[_qIdx].minuend;
					factor2 = questions[_qIdx].subtrahend;
					break;
				default:
					break;
			}

			return {
				'readableQuestionIdx': _qIdx + 1,
				'questionIdx': _qIdx,
				'factor1': factor1,
				'factor2': factor2,
				'operator': questions[_qIdx].operator
			};
		};

		this.status = function() {
			return status;
		};

		this.complete = function() {
			if ( status != Test.COMPLETE ) {
				status = Test.COMPLETE;
				this.fire( Test.COMPLETE );
			}
		};

		init();
		return this;
	}
	Test.prototype = new EventTarget();
	Test.prototype.constructor = Test;
	Object.defineProperty( Test, 'COMPLETE', {
			get: function() { return 'complete'; },
			writeable: false,
			enumerable: false,
			configurable: false
		}
	);
	Object.defineProperty( Test, 'INITIALIZED', {
			get: function() { return 'iniitialized'; },
			writeable: false,
			enumerable: false,
			configurable: false
		}
	);
	Object.defineProperty( Test, 'START', {
			get: function() { return 'start'; },
			writeable: false,
			enumerable: false,
			configurable: false
		}
	);

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
			//console.log( 'in execute of timer... Timer Length: ' + length + " :: remainingTime: " + remainingTime + ' adjustment (rightValue):: ' + scaledValue + ' ::increment::' + increment) ;
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

	function MMCDashboardView() {
		var oHTMLRefLevelInfoText = document.getElementById( 'mmLevelInfoText' ),
			oHTMLRefInfoPanelAddendum = document.getElementById( 'mmInfoPanelAddendum' ),
			oHTMLRefLevelInfoPanel = document.getElementById( 'mmLevelInfoPanel' );

		this.render = function( _levelConfig, _userParamsRef ) {
			oHTMLRefLevelInfoText.innerHTML =  _levelConfig.text;
			// Check for additional display panels ( 'selectors' )
			if ( _levelConfig.selector !== null ) {
				renderAddendum( _levelConfig.selector );
				_userParamsRef.addendum = -1;
				oHTMLRefInfoPanelAddendum.style.display = 'block';
			}
			else {
				_userParamsRef.addendum = null;
				if ( oHTMLRefInfoPanelAddendum !== null ) {
					oHTMLRefInfoPanelAddendum.style.display = 'none';
				}
			}
			// Show the info panel
			oHTMLRefLevelInfoPanel.style.display = 'inline-block';
		};
		// Handled with DUST.js
		function renderAddendum( _data ) {
			if ( _data.type == 'select' ) {
				dust.render( 'demo3', _data,
					function( _err, _out ) {
						if ( _err ) {
							throw new Error( 1, 'Cannot show Addendum Select List ' + JSON.stringify( _err ) );
						}
						// Show info Panel
						if ( oHTMLRefInfoPanelAddendum ) {
							oHTMLRefInfoPanelAddendum.innerHTML = _out;
						}
					}
				); // close dust render
			}

			return this;
		}
	}

	function MMCQuestionView() {
		this.render = function( _oModel ) {
			dust.render( 'QuestionView', _oModel, function( _err, _out ) {
				if ( _err ) {
					console.log( 'error in question model' );
					return;
				}
				modal.open( { content: _out } );
			});
			// Put focus on answerField - Has issue with Mobile Browsers onLoad fire focus event.
			document.getElementById( 'answerField' ).focus();
		};
		return this;
	}

	function MMCResultView() {
		this.render = function( _oModel ) {
			dust.render( 'ResultView', _oModel, function( _err, _out ) {
					modal.open( { content: _out } );
				}
			);
		};
	}

	function User( _id ) {
		var id = new Date().getTime(),
			name,
			oExam,
			__Answers = [],
			currentQuestionIdx = -1,
			oTimer;

		this.parameters = {
			level: -1,
			operation: null,
			addendum: null,
			testConfig: null
		};

		this.start = function() {
			// Configure User Param
			if ( this.parameters.addendum == -1 ) {
				console.log( "Set a value for the addendum" );
				throw new Error( 2, "No Choices made in the addendum layer.  Choose a refinement parameter." );
			}
			// Start Create Test Object and start.
			oExam = new Test(
							this.parameters.operation,
							this.parameters.addendum,
							this.parameters.testConfig.questions,
							this.parameters.testConfig.time,
							this.parameters.testConfig.range
						);
			oExam.addListener( 'start', function() { console.log( 'Test Started!!!' ); } );
			oExam.addListener( 'complete', this.callController.bind( this ) );
			// configure timer
			oTimer = new Timer( 10, this.end.bind( this ) );
			// Start Timer
			oTimer.start();
			// Start Test
			return oExam.start( ++currentQuestionIdx );
		};

		this.callController = function() {
			oMM.handleTestCompletedFromUser( this );
		};

		this.setName = function( _name ) {
			name = _name;
		};

		this.answer = function( _answer ) {
			__Answers[currentQuestionIdx] = _answer;
		};

		this.next = function() {
			return oExam.next( ++currentQuestionIdx );
		};

		this.end = function() {
			oExam.complete();
		};

		this.reset = function() {
			oTimer.kill();
			oExam.complete();
		};

		this.grade = function() {
			var oModel_,
				numberOfQuestionsCorrect = 0,
				questionsAnswered = 0,
				__ExamQuestionsRef = oExam.getQuestions();

			// Tally User Score
			for ( var i = 0, numberOfQuestions = __ExamQuestionsRef.length; i < numberOfQuestions; i++ ) {
				if ( __ExamQuestionsRef[i].answer == __Answers[i] ) { ++numberOfQuestionsCorrect; }
				if ( __Answers[i] ) { ++questionsAnswered; }
			}

			var type = oExam.getType();
			return {
				'name': name,
				'type': oExam.getType(),
				'operation': function(chunk, context, bodies) {
					if ( type === 'multiplication' || type === 'division' ) {
						chunk.render( bodies.block, context );
					}
				},
				'multiplicator': this.parameters.addendum,
				'questionsPercent': Math.floor( numberOfQuestionsCorrect/numberOfQuestions * 100 ) + '%',
				'questionsAnswered': questionsAnswered,
				'questionsCorrect': numberOfQuestionsCorrect,
				'timeSpent': 0 //oTimer.getElapsedTime()
			};
		};
	}

	function MMChallengerController() {
		var modalRef,
			configPath = '/math-challenger/config/config.json',
			appConfig,
			oMMTest,
			oTimer,
			__Users = [],
			currentUserIdx,
			oDashboardView = new MMCDashboardView(),
			oMMCQuestionView = new MMCQuestionView(),
			oMMCResultView = new MMCResultView();

		function init() {
			__Users.push( new User() );
			currentUserIdx = __Users.length - 1;
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
			if ( __Users[currentUserIdx].parameters.operation === null || __Users[currentUserIdx].parameters.level === -1 ) {
				console.log( "returning... Select and operation and a level" );
				return;
			}

			// Match UserParam settings to appConfig settings.
			var appConfigOperationsRef, appConfigLevelRef;
			// Get Operations Handle
			for ( var key in appConfig.operations ) {
				if ( key == __Users[currentUserIdx].parameters.operation ) {
					appConfigOperationsRef = appConfig.operations[key];
					break;
				}
			}
			if ( appConfigOperationsRef === null ) {
				console.log ( "returning... Operation not found in appConfig." );
				return;
			}
			// Get Level Handle
			for ( var key2 in appConfigOperationsRef.levels ) {
				if ( key2 === __Users[currentUserIdx].parameters.level ) {
					appConfigLevelRef = appConfigOperationsRef.levels[key2];
					__Users[currentUserIdx].parameters.testConfig = appConfigLevelRef;
					break;
				}
			}
			// Render Components
			// Show Instructions
			oDashboardView.render( appConfigLevelRef, __Users[currentUserIdx].parameters );
		}

		this.start = function( _oForm ) {
			var oModel;
			var playerName = ( _oForm.mmPlayerHandle.value == 'Enter Nick Name' )? 'DefaultUser' : _oForm.mmPlayerHandle.value;
			__Users[currentUserIdx].setName( playerName );
			oModel = __Users[currentUserIdx].start();
			if ( oModel  !== null ) {
				// Show Question
				oMMCQuestionView.render( oModel );
			}
		};

		this.next = function( _formRef ) {
			var oModel;
			if ( !_formRef || ( _formRef.answerField.value === null || _formRef.answerField.value === '' ) ) {
				return false;
			}
			// Evaluate the answer. Expect the oMMTest to know the currentQuestion.
			__Users[currentUserIdx].answer( _formRef.answerField.value );
			// Show next question
			oModel = __Users[currentUserIdx].next();
			if ( oModel !== null ) {
				// Show next Question;
				oMMCQuestionView.render( oModel );
			}
		};

		this.end = function() {
			__Users[currentUserIdx].end();
		};

		this.grade = function() {
			console.log('MMChallengerController.grade()')
			oModel = __Users[currentUserIdx].grade();
			if ( oModel  !== null ) {
				// Show Result Screen
				oMMCResultView.render( oModel );
			}
		};

		this.reset = function() {
			__Users[currentUserIdx].reset();
		};

		this.handleLevelSelect = function( _oFormSelect ) {
			if ( !_oFormSelect ) {
				console.log( "Error: no handle to the LevelSelect Form passed in");
				return;
			} //
			__Users[currentUserIdx].parameters.level = ( _oFormSelect.options[_oFormSelect.selectedIndex].value != "null" )? _oFormSelect.options[_oFormSelect.selectedIndex].value : -1;
			if (__Users[currentUserIdx].parameters.operation !== null) {
				setEnvironment();
			}
		};

		this.handleOperationSelect = function( _oFormSelect ) {
			if ( !_oFormSelect ) {
				console.log( "Error: no handle to the LevelSelect Form passed in");
				return;
			} //
			__Users[currentUserIdx].parameters.operation = ( _oFormSelect.options[_oFormSelect.selectedIndex].value != "null" )? _oFormSelect.options[_oFormSelect.selectedIndex].value : null;
			if ( __Users[currentUserIdx].parameters.level != -1 ) {
				setEnvironment();
			}
		};

		this.handleInfoPanelAddendumSelect = function ( _oFormSelect ) {
			if ( !_oFormSelect ) {
				console.log( "Error: no handle to the Select List Form passed in");
				return;
			} //
			__Users[currentUserIdx].parameters.addendum = ( _oFormSelect.options[_oFormSelect.selectedIndex].value != "null" )? parseInt( _oFormSelect.options[_oFormSelect.selectedIndex].value, 10 ) : null;
			console.log( __Users[currentUserIdx].parameters.addendum + " : " +  _oFormSelect.options[_oFormSelect.selectedIndex].value );
		};

		this.handleTestCompletedFromUser = function( _user ) {
			var oResultsModel = _user.grade();
			if ( oResultsModel !== null ) {
				// Show Result Screen
				oMMCResultView.render( oResultsModel );
			}
		};

		init();
		return this;
	}
	window['oMM'] = new MMChallengerController();
})();