import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TriviaService {

  constructor(
    private http: HttpClient
  ) { }

  public questionsData: Array<any> = []

  public userName = ""

  public getQuestions() {
    return new Promise<any>((resolve, reject) => {
      this.http.get('https://opentdb.com/api.php?amount=20&category=18&difficulty=hard&type=multiple').subscribe(
        (res) => {
          resolve(res)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }

  updateScore(score: any) {
    this.http.get('http://localhost:3000/leaderboard?username=' + this.userName).subscribe(
      (res: any) => {
        // check if return response return nothing
        if (res.length == 0) {
          this.http.post('http://localhost:3000/leaderboard?username=', { username: this.userName, score: score }).subscribe(
            (resp) => {
              console.log("RESP from POST:", resp)
            },
            (error) => {
              console.log("Error from POST:", error)
            }
          )
        } else {
          console.log("If leaderboard array not less than 0", res)
          if (res[0].score < score) {
            // update the highest score of the user
            res[0].score = score
            this.http.put('http://localhost:3000/leaderboard/' + res[0].id, res[0]).subscribe(
              (uRes) => {
                console.log(uRes)
              },
              (uErr) => {
                console.log(uErr)
              })
          }
        }

      },
      (err) => {
        console.log(err)
      })
  }

  public getHighScores() {

    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/leaderboard').subscribe(
        (res) => {
          resolve(res)
        },
        (err) => {
          reject(err)
        }
      )
    })

  }
}

