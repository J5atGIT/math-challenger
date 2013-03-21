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

		this.start = function() {
			status = Test.START;
			this.fire( Test.START );
			return this.next();
		};

		this.answer = function( _answer, _qIdx ) {
			var qIdx = _qIdx || currentQuestion;
			var answer =  _answer || null;
			questions[qIdx].userAnswer = _answer;
		};

		this.next = function() {
			if ( status == Test.COMPLETE ) { return null; }
			if ( ++currentQuestion >= numberOfQuestions ) {
				this.complete();
				return null;
			}
			// Build the Model
			var oQModel = {}, factor1, factor2;
			switch ( type ) {
				case 'multiplication':
					factor1 = questions[currentQuestion].multiplicator;
					factor2 = questions[currentQuestion].multiplicand;
					break;
				case 'division':
					factor1 = questions[currentQuestion].dividend;
					factor2 = questions[currentQuestion].divisor;
					break;
				case 'addition':
					factor1 = questions[currentQuestion].augend;
					factor2 = questions[currentQuestion].addend;
					break;
				case 'subtraction':
					factor1 = questions[currentQuestion].minuend;
					factor2 = questions[currentQuestion].subtrahend;
					break;
				default:
					break;
			}

			return {
				'readableQuestionIdx': currentQuestion + 1,
				'questionIdx': currentQuestion,
				'factor1': factor1,
				'factor2': factor2,
				'operator': questions[currentQuestion].operator
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
	Object.defineProperty (  Test, 'COMPLETE', {
			get: function() { return 'complete'; },
			writeable: false,
			enumerable: false,
			configurable: false
		}
	);
	Object.defineProperty (  Test, 'INITIALIZED', {
			get: function() { return 'iniitialized'; },
			writeable: false,
			enumerable: false,
			configurable: false
		}
	);
	Object.defineProperty (  Test, 'START', {
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

	function MMChallengerController() {
		var modalRef,
			configPath = '/math-challenger/config/config.json',
			appConfig,
			oMMTest,
			oTimer,
			oDashboardView = new MMCDashboardView(),
			oMMCQuestionView = new MMCQuestionView(),
			oMMCResultView = new MMCResultView();

		var userParams = {
				level: -1,
				operation: null,
				addendum: null,
				testConfig: null
			};

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
			if ( userParams.operation === null || userParams.level === -1 ) {
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
			if ( appConfigOperationsRef === null ) {
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
			oDashboardView.render( appConfigLevelRef, userParams );
		}

		this.start = function( _oForm ) {
			var oModel;
			var playerName = ( _oForm.mmPlayerHandle.value == 'Enter Nick Name' )? 'DefaultUser' : _oForm.mmPlayerHandle.value;
			// Configure User Param
			if ( userParams.addendum == -1 ) {
				console.log( "Set a value for the addendum" );
				throw new Error( 2, "No Choices made in the addendum layer.  Choose a refinement parameter." );
			}
			// Start Create Test Object and start.
			oMMTest = new Test( userParams.operation,
							userParams.addendum,
							userParams.testConfig.questions,
							userParams.testConfig.time,
							userParams.testConfig.range
						);
			oMMTest.addListener( 'start', function() { console.log( 'Test Started!!!' ); } );
			oMMTest.addListener( 'complete', this.grade.bind( this ) );
			// configure timer
			oTimer = new Timer( userParams.testConfig.time, this.end.bind( this ) );
			// Start Test
			oModel = oMMTest.start();
			if ( oModel  !== null ) {
				// Show Question
				oMMCQuestionView.render( oModel );
				// Start Timer
				oTimer.start();
			}
		};

		this.next = function( _formRef ) {
			var oModel;
			if ( !_formRef || ( _formRef.answerField.value === null || _formRef.answerField.value === '' ) ) {
				return false;
				// throw new Error(3, 'No form input received.  Enter an answer.' );
			}
			// Evaluate the answer. Expect the oMMTest to know the currentQuestion.
			oMMTest.answer( _formRef.answerField.value );
			oModel = oMMTest.next();
			if ( oModel !== null ) {
				// Show next Question;
				oMMCQuestionView.render( oModel );
			}
		};

		this.end = function() {
			oMMTest.complete();
		};

		this.grade = function() {
			oModel = oMMTest.grade();
			if ( oModel  !== null ) {
				// Show Result Screen
				oMMCResultView.render( oModel );
			}
		};

		this.reset = function() {
			oTimer.kill();
			oMMTest.complete();
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
			userParams.addendum = ( _oFormSelect.options[_oFormSelect.selectedIndex].value != "null" )? parseInt( _oFormSelect.options[_oFormSelect.selectedIndex].value, 10 ) : null;
			console.log( userParams.addendum + " : " +  _oFormSelect.options[_oFormSelect.selectedIndex].value );
		};

		init();
		return this;
	}
	window['oMM'] = new MMChallengerController();
})();