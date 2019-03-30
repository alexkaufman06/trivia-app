function Quiz(questions) {
	this.score = 0;
	this.questions = questions;
	this.questionIndex = 0;
	this.showAnswer = false;
	this.guessCorrect = false;
}

Quiz.prototype.getQuestionIndex = function() {
	return this.questions[this.questionIndex];
}

Quiz.prototype.isEnded = function() {
	return this.questions.length === this.questionIndex;
}

Quiz.prototype.toggleAnswer = function() {
	return this.showAnswer = !this.showAnswer;
}

Quiz.prototype.guess = function(answer) {
	if(this.getQuestionIndex().correctAnswer(answer)) {
		this.guessCorrect = true;
		this.score++;
	} else {
		this.guessCorrect = false;
	}
}

Quiz.prototype.next = function() {
	this.questionIndex++;
}