import { Component, OnInit } from '@angular/core';
import { TriviaService } from 'src/app/services/trivia.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public triviaService: TriviaService) { }

  ngOnInit(): void {
    this.triviaService.getHighScores().then((res: any) => {
      console.log(res)
      this.scores = res
      this.scores.sort((a, b) => {
        return b.score - a.score
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  scores: Array<any> = []
}
