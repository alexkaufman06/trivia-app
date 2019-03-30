function Question(text, choices, answer, explanation) {
	this.text = text;
	this.choices = choices;
	this.answer = answer;
	this.explanation = explanation;
}

Question.prototype.correctAnswer = function(choice) {
	return choice === this.answer;
}