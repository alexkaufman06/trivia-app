/*
Preloading: https://blog.uptrends.com/web-performance/improving-web-performance-with-browser-hints-and-preload/

	THINGS TO ADD: Colored checkmark for choice (or just bold edges of chosen field)
								   -Use guessCorrect in quiz controller
								 Add noise (on and off)
								   -correct answers/incorrect answers
								 If low score no social sharing option?
								 Try again should be tiny (or not there?)
								 Randomize questions and order
                 Shaking animation to signify wrong answer
                 Hide progress indicator at the end
*/

/*
	NEW QUIZ IDEA: (Have groups of quizes or all quizes)
		-National Parks
		-Divine Comedy (Dantes Inferno - 9 circles of hell)
		-Solar System (planets in order?)
		-Monuments with pictures (Great Pyramid of Giza)
		-What is name of the lead character in the book, "The Hobbit"? (Bilbo Baggins)
		-Margaret Thatcher (Chemistry, Downing Street, Conservative, Iron Lady)
		-Angela Merkel
		-Bzantibe generals problem
		-Words and definitions on phone
		-Hans Island between greenland (danish) and canada - disputed territory 
		-Images from iceland landmarks (church, sun voyager, flag)
*/

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function detectmobile() { 
  if ( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
 		|| navigator.userAgent.match(/iPad/i)
 		|| navigator.userAgent.match(/iPod/i)
 		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)) {
    	return true;
  } else {
    return false;
  }
}

function populate() {
	if(quiz.isEnded()) {
		showScores();
	} else {
		renderQuestion();
		renderChoices();
		renderExplanation();
		showProgress();
	}
};

function renderExplanation() {
	if (quiz.showAnswer) {
		var element = document.getElementById("explanation");
		element.innerHTML += quiz.getQuestionIndex().explanation;
	}
}

function renderQuestion() {
	if (document.getElementById("next")) {
		document.getElementById("next").remove();
	}
	var element = document.getElementById("question");
	element.className += "fadeInUp";
	if (quiz.showAnswer) {
		if (quiz.questionIndex != questions.length - 1) {
			renderGuessResults();
			document.getElementsByClassName("buttons")[0].innerHTML += "<button id='next' class='hover fadeInUp'>Next</button>";
		} else {
			renderGuessResults();
			document.getElementsByClassName("buttons")[0].innerHTML += "<button id='next' class='hover fadeInUp'>Results</button>";
		}
	} else {
		element.innerHTML = "";
		//Fix for weird iPhone glitch?^
		element.innerHTML = quiz.getQuestionIndex().text;
	}
}

function renderChoices() {
	var choices = quiz.getQuestionIndex().choices;
	for (var i=0; i < choices.length; i++) {
		var element = document.getElementById("choice" + i);
		if (choices[i] == quiz.getQuestionIndex().answer) {
			if (!quiz.showAnswer) {
				element.className += "fadeInUp";
				guess("btn" + i, choices[i]);
				if (detectmobile() === false) {
					document.getElementById("btn" + i).className = "hover";
				} else {
					document.getElementById("btn" + i).className = "";
				}
			} else {
				document.getElementById("btn" + i).className = "";
				element.className = "";
			}
			element.innerHTML = choices[i];
		} else if (quiz.showAnswer) {
			document.getElementById("btn" + i).className = "answer";
			element.className = "";
		} else {
			element.innerHTML = choices[i]
			element.className += "fadeInUp";
			if (detectmobile() === false) {
				document.getElementById("btn" + i).className = "hover";
			} else {
				document.getElementById("btn" + i).className = "";
			}
			guess("btn" + i, choices[i]);
		}
	}
}

function renderGuessResults() {
	if (quiz.guessCorrect) {
		document.getElementsByClassName("buttons")[0].innerHTML += "<p id='answer' class='true fadeInUp'><strong><span>C</span><span>O</span><span>R</span><span>R</span><span>E</span><span>C</span><span>T</span><br></strong></p><p id='explanation' class='fadeInUp'></p>";
	} else {
		document.getElementsByClassName("buttons")[0].innerHTML += "<p id='answer' class='false fadeInUp'><strong>False<br></strong></p><p id='explanation' class='fadeInUp'></p>";
	}
}

function guess(id, guess) {
	var button = document.getElementById(id);
	button.onclick = function() {
		quiz.guess(guess);
		quiz.toggleAnswer();
		populate();
		next();
		var element = document.getElementById("question");
		element.className = "";
	}
};

function next() {
	var button = document.getElementById("next");
	button.onclick = function() {
		quiz.next();
		quiz.toggleAnswer();
		if (document.getElementById('answer')) {
			document.getElementById('answer').remove();
			document.getElementById('explanation').remove();
		}
		populate();
	}
}

function showProgress() {
	var currentQuestionNumber = quiz.questionIndex + 1;
	var element = document.getElementById("progress");
	element.innerHTML = currentQuestionNumber + "/" + quiz.questions.length;
};

function showScores() {
  document.getElementById('question').remove();
	var gameOverHtml = "<div id='gameOver'><h1>Results</h1>";
	if (quiz.score/quiz.questions.length == 1) {
		gameOverHtml += "<h2 id='score'>Congrats! You got a perfect score!</h2>";
	} else if (quiz.score/quiz.questions.length >= 0.7) {
		gameOverHtml += "<h2 id='score'>Not too shabby!</h2>";
	} else {
		gameOverHtml += "<h2 id='score'>Looks like you've got more to learn, but that's OK!</h2>";
	}
  gameOverHtml += "<h2 id='score'> Your Score: " + quiz.score + "/" + quiz.questions.length + "</h2>";
  gameOverHtml += "<p><a href='#' onclick='window.location.reload(true);'>Try Again?</p></div>";
  var element = document.getElementById("quiz");
  element.innerHTML = gameOverHtml;
};

var questions = [
	new Question("What is the capital of Iceland?",
							  [
							  	"K&oacute;pavogur",
							  	"Vik",
							  	"Reykjanesb&aelig;r",
							  	"Reykjav&iacute;k"
							  ],
							  "Reykjav&iacute;k",
							  "The striking concrete Hallgrimskirkja church sits on the highest point of the city."),
	new Question("How many sharps are in the key of E major?",
							  [
							  	"1",
							  	"2",
							  	"3",
							  	"4"
							  ],
							  "4",
							  "There are 4 sharps (F#, C#, G#, D#) in the key of E major."),
	new Question("What country is this?<br><img class='img-fluid' src='images/Bosnia_and_Herzegovina.svg' style='width: 230px;'>",
							  [
							  	"Jamaica",
							  	"Solomon Islands",
							  	"Georgia",
							  	"Bosnia and Herzegovina"
							  ],
							  "Bosnia and Herzegovina",
							  "Bosnia and Herzegovina is a country on the Balkan Peninsula in southeastern Europe."),
	new Question("What country is this?<br><img class='img-fluid' src='images/Costa_Rica.svg' style='width: 215px'>",
							  [
							  	"Netherlands",
							  	"Trinidad and Tobago",
							  	"Burundi",
							  	"Costa Rica"
							  ],
							  "Costa Rica",
							  "Costa Rica is a rugged, rainforested Central American country with coastlines on the Caribbean and Pacific."),
	new Question("Who played the character Stuart Smalley in SNL?",
							  [
							  	"Phil Hartman",
							  	"Dana Carvey",
							  	"Al Franken",
							  	"Kevin Nealon"
							  ],
							  "Al Franken",
							  "Stuart Smalley is a fictional character invented and performed by comedian and satirist Al Franken."),
	new Question("What does DNS stand for?",
							  [
							  	"Distributed Network System",
							  	"Domain Name Security",
							  	"Domain Name System",
							  	"Distributed Network Security"
							  ],
							  "Domain Name System",
							  "DNS is a hierarchical and decentralized naming system for computers, services, or other resources connected to the Internet or a private network."),
	new Question("What does TCP stand for?",
							  [
							  	"Transmission Control Protection",
							  	"Transitor Custom Protocol",
							  	"Transitor Custom Protection",
							  	"Transmission Control Protocol"
							  ],
							  "Transmission Control Protocol",
							  "TCP is a standard that defines how to establish and maintain a network conversation via which application programs can exchange data."),
	new Question("What does TLD stand for?",
							  [
							  	"Top Level Domain",
							  	"Tiered Level Domain",
							  	"Top Linked Domain",
							  	"Tiered Linked Domain"
							  ],
							  "Top Level Domain",
							  "TLD is one of the domains at the highest level in the hierarchical Domain Name System of the Internet."),
	new Question("What famous building would you find located at 1600 Pennsylvania Avenue?",
							  [
							  	"Empire State Building",
							  	"Taj Mahal",
							  	"Chrysler Building",
							  	"The White House"
							  ],
							  "The White House",
							  "The White House is located at 1600 Pennsylvania Avenue NW in Washington, D.C. (formally the District of Columbia)."),
	new Question("Who is a Mexican artist known for self-portraits, pain and passion, and bold, vibrant colors?",
							  [
							  	"Georgia O'Keeffe",
							  	"Frida Kahlo",
							  	"Mary Cassatt",
							  	"Joan Mitchell"
							  ],
							  "Frida Kahlo",
							  "Frida exlpored questions of identity, postcolonialism, gender, calss and race in Mexican society."),
	new Question("What is an adjective used to describe a person or thing that's impulsive and unpredictable.",
							  [
							  	"Capricious",
							  	"Nonchalant",
							  	"Evanescent",
							  	"Recondite"
							  ],
							  "Capricious",
							  "A bride who leaves her groom standing at the wedding altar could be considered capricious."),
	// new Question("",
	// 						  [
	// 						  	"",
	// 						  	"",
	// 						  	"",
	// 						  	""
	// 						  ],
	// 						  "",
	// 						  ""),
	// new Question("What is regression testing?",
	// 						  [
	// 						  	"Testing of the external behaviour of the program, also known as black box testing.",
	// 						  	"A technique used to test whether the flow of an application right from start to finish is behaving as expected.",
	// 						  	"The process of testing changes to computer programs to make sure that the older programming still works with the new changes.",
	// 						  	"A type of software testing whereby the system is tested against the functional requirements/specifications."
	// 						  ],
	// 						  "The process of testing changes to computer programs to make sure that the older programming still works with the new changes.",
	// 						  "Regression testing is a normal part of the program development process and, in larger companies, is done by code testing specialists."),
	// new Question("What is end-to-end testing?",
	// 						  [
	// 						  	"The process of testing changes to computer programs to make sure that the older programming still works with the new changes.",
	// 						  	"A technique used to test whether the flow of an application right from start to finish is behaving as expected.",
	// 						  	"Testing of the external behaviour of the program, also known as black box testing.",
	// 						  	"A type of software testing whereby the system is tested against the functional requirements/specifications."
	// 						  ],
	// 						  "A technique used to test whether the flow of an application right from start to finish is behaving as expected.",
	// 						  "The purpose of performing end-to-end testing is to identify system dependencies and to ensure that the data integrity is maintained between various system components and systems."),
	new Question("What is the capital of Scotland?",
							  [
							  	"London",
							  	"Edinburgh",
							  	"Birmingham",
							  	"Aberdeen"
							  ],
							  "Edinburgh",
							  "Edinburgh is Scotland's compact, hilly capital. Looming over the city is Edinburgh Castle, home to Scotland's crown jewels and the Stone of Destiny, used in the coronation of Scottish rulers."),
	new Question("What is a school of Hellenistic philosophy founded by Zeno of Citium in Athens in the early 3rd century BC?",
							  [
							  	"Agnosticism",
							  	"Stoicism",
							  	"Emotivism",
							  	"Regalism"
							  ],
							  "Stoicism",
							  "While Stoic physics are largely drawn from the teachings of the philosopher Heraclitus, they are heavily influenced by certain teachings of Socrates."),
	new Question("Where is this monument?<br><img class='img-fluid' src='images/Celsus.jpg' style='width: 180px;'>",
							  [
							  	"Italy",
							  	"Jerusalem",
							  	"Turkey",
							  	"France"
							  ],
							  "Turkey",
							  "The Library of Celsus is an ancient Roman building in Ephesus, Anatolia, now part of Selçuk, Turkey."),
	new Question("Who became Labour Party Prime Minister of the U.K. with a landslide victory in 1997?",
							  [
							  	"Margaret Thatcher",
							  	"John Major",
							  	"Tony Blair",
							  	"Gordon Brown"
							  ],
							  "Tony Blair",
							  "Anthony Charles Lynton Blair is a British politician who served as Prime Minister of the United Kingdom from 1997 to 2007."),
	new Question("What is the largest living structure on Earth?",
							  [
							  	"Great Barrier Reef",
							  	"Belize Barrier Reef",
							  	"Hawaiian Reef",
							  	"Red Sea Reef"
							  ],
							  "Great Barrier Reef",
							  "The Great Barrier Reef, off the coast of Queensland in northeastern Australia, is the largest living thing on Earth, and even visible from outer space."),
	new Question("Which is a famous public sculpture by Indian-born British artist Sir Anish Kapoor?",
							  [
							  	"Tilted Arc",
							  	"Cloud Gate",
							  	"Mount Rushmore",
							  	"Monument to Balzac"
							  ],
							  "Cloud Gate",
							  "`The Bean` is the centerpiece of AT&T Plaza at Millennium Park in the Loop community area of Chicago, Illinois."),
	new Question("Politician who in 2005 became the first female chancellor of Germany.",
							  [
							  	"Margaret Thatcher",
							  	"Jacinda Ardern",
							  	"Dilma Rousseff",
							  	"Angela Merkel"
							  ],
							  "Angela Merkel",
							  "She obtained a doctorate in quantum chemistry in 1986 and worked as a research scientist until 1989."),
	new Question("Who did South Africa release in 1990 after over 27 years of imprisonment?",
						  [
						  	"Rosa Parks",
						  	"Nelson Mandela",
						  	"Martin Luther King",
						  	"Harriet Tubman"
						  ],
						  "Nelson Mandela",
						  "Nelson Rolihlahla Mandela was a South African anti-apartheid revolutionary, political leader, and philanthropist who served as President of South Africa from 1994 to 1999."),
	new Question("Alopecia describes a person with a lack of what?",
							  [
							  	"Teeth",
							  	"Hair",
							  	"Red blood cells",
							  	"Memory"
							  ],
							  "Hair",
							  "Alopecia areata, also known as spot baldness, is a condition in which hair is lost from some or all areas of the body."),
	new Question("Which of these is a name of a fish?",
							  [
							  	"Seymour",
							  	"Boleyn",
							  	"Parr",
							  	"Aragon"
							  ],
							  "Parr",
							  "The six stages of salmon are: egg, alevin, fry, <u>parr</u>, smolt, and adult."),
	new Question("On a computer what is the CPU?",
						  [
						  	"Central Power Unit",
						  	"Central Production Unit",
						  	"Central Printing Unit",
						  	"Central Processing Unit"
						  ],
						  "Central Processing Unit",
						  "The CPU performs the basic arithmetic, logic, controlling, and input/output (I/O) operations."),
	new Question("`What kind of man would defy a king` was the movie poster tag line for which film?",
						  [
						  	"Robin Hood: Prince of Thieves",
						  	"300",
						  	"Braveheart",
						  	"The Mummy"
						  ],
						  "Braveheart",
						  "William Wallace is the medieval Scottish patriot who is spurred into revolt against the English when the love of his life is slaughtered."),
	new Question("What fishing method used to catch salmon and kingfish, invloves drawing one or more fishing lines, baited with lures or bait fish, through the water?",
						  [
						  	"Trawling",
						  	"Casting",
						  	"Drawing",
						  	"Trolling"
						  ],
						  "Trolling",
						  "Trolling is used to catch pelagic fish such as salmon, mackerel and kingfish."),
	new Question("The `Ring of Fire` is an area of seismic activity around which ocean?",
						  [
						  	"Atlantic",
						  	"Pacific",
						  	"Arctic",
						  	"Indian"
						  ],
						  "Pacific",
						  "The Ring of Fire is a major area in the basin of the Pacific Ocean where many earthquakes and volcanic eruptions occur."),
	new Question("Which mountain range forms part of China's natural border with India?",
						  [
						  	"Pyrenees",
						  	"Himalayas",
						  	"Alps",
						  	"Rockies"
						  ],
						  "Himalayas",
						  "The Himalayas form a mountain range in Asia, separating the plains of the Indian subcontinent from the Tibetan Plateau. The tallest point is Mount Everest."),	
	new Question("What is the name of Harry Potter's godfather, who dies in 'Harry Potter and the Order of the Phoenix'?",
							  [
							  	"Albus Dumbledore",
							  	"Sirius Black",
							  	"Severus Snape",
							  	"Hagrid"
							  ],
							  "Sirius Black",
							  "Sirius Black is nicknamed Padfoot because his Animagus form takes the shape of a dog."),
	new Question("Which option contains a band that <u>didn't</u> contriubte to the development of Monty Python?", 
							  [
							  	"Elton John & Led Zeppelin",
							  	"Billy Joel & Pink Floyd",
							  	"Pink Floyd & Genesis",
							  	"Genesis & Led Zeppelin"
							  ], 
							  "Billy Joel & Pink Floyd", 
							  "Pink Floyd, Led Zeppelin, Genesis and Elton John all contributed as it was a 'good tax write-off'."),
	new Question("What is the lowest point of elevation in the US?", 
							  [
							  	"The Potomac River",
							  	"Badwater Basin",
							  	"The Ouachita River",
							  	"New Orleans"
							  ], 
							  "Badwater Basin", 
							  "Death Valley's Badwater Basin is the point of the lowest elevation in North America, at 282 feet (86 m) below sea level."),
	new Question("What is the highest point of elevation in the US?", 
							  [
							  	"Mt. Whitney",
							  	"El Capitan",
							  	"Humphreys Peak",
							  	"Mt. McKinley"
							  ], 
							  "Mt. McKinley", 
							  "Mt. McKinley (Denali) of Alaska is the highest point of elevation in the US at 20,310 feet."),
	// new Question("What is the Scoville scale?", 
	// 						  [
	// 						  	"The measure of a person's position on some dimension.",
	// 						  	"A measure for the piquancy of various peppers, indicating the level of capsaicin.",
	// 						  	"The likeliness of a person to develop the Scoville disorder.",
	// 						  	"The likeliness of a molecule to react with another molecule."
	// 						  ], 
	// 						  "A measure for the piquancy of various peppers, indicating the level of capsaicin.", 
	// 						  "The Scoville scale is a measurement of the pungency (spiciness or 'heat') of chili peppers and other spicy foods, as recorded in Scoville Heat Units (SHU)."),	
	new Question("What country is this?<br><img class='img-fluid' src='images/Vietnam.svg.png' style='width: 230px;'>", 
							  [
							  	"Laos",
							  	"Cambodia.",
							  	"Thailand",
							  	"Vietnam"
							  ], 
							  "Vietnam", 
							  "Vietnam is a Southeast Asian country on the South China Sea known for its beaches, rivers, Buddhist pagodas and bustling cities."),
	new Question("How many flats are in the key of F major?",
								[
									"1",
									"2",
									"3",
									"4"
								],
								"1",
								"There is only one flat (Bb) in F major.")
];

var quiz = new Quiz(questions);

populate();
