import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TriviaService } from 'src/app/services/trivia.service';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.css']
})
export class TriviaComponent implements OnInit {

  constructor(
    public triviaService: TriviaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.triviaService.getQuestions()
      .then((res) => {
        console.log(res)
        this.triviaService.questionsData = res.results;

        // incorrect answers is an array, push the correct answer to it and randomise it below
        this.triviaService.questionsData[this.questionIndex].incorrect_answers.push(this.triviaService.questionsData[this.questionIndex].correct_answer)
        // shuffle
        this.triviaService.questionsData[this.questionIndex].incorrect_answers.sort(() => 0.5 - Math.random())

        let timer = setInterval(() => {
          // when answer selected, it equate to empty string, then it stops 
          // need to countdown if it is not equal to 0, so ti stop at 0
          if (this.userAnswer == "" && this.countdown != 0) {
            this.countdown--
          }
          if (this.countdown == 0) {
            clearInterval(timer)
            this.triviaService.updateScore(this.score)

            setTimeout(() => {
              this.router.navigate(['/home'])
            }, 4000)
          }

        }, 1000)
      }).catch((err) => {
        console.log(err)
      })
  }
  // Props
  questionIndex = 0;
  userAnswer = ""
  score = 0
  countdown = 15;

  selectAnswer(userOption: string) {

    this.userAnswer = userOption

    if (this.triviaService.questionsData[this.questionIndex].correct_answer == userOption) {
      // when correct option chosen, wait for 2 seconds to next question (highlight correct answer)
      this.score += 5

      setTimeout(() => {
        // if correct go to next answer
        this.userAnswer = ""
        this.questionIndex++
        // incorrect answers is an array, push the correct answer to it and randomise it below
        this.triviaService.questionsData[this.questionIndex].incorrect_answers.push(this.triviaService.questionsData[this.questionIndex].correct_answer)
        // shuffle the options
        this.triviaService.questionsData[this.questionIndex].incorrect_answers.sort(() => 0.5 - Math.random())
        this.countdown = 15
      }, 2000)
    }
    else {
      setTimeout(() => {
        this.triviaService.updateScore(this.score)

        // wrong option chosen, redirect to home page
        this.router.navigate(['/home'])
      }, 4000)
    }
  }
}
