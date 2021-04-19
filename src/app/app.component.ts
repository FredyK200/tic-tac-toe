import { Component, OnInit } from '@angular/core';
import io from "socket.io-client";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private socket: any;
  public name;
  public players = {playerX: false, playerO: false};
  public player = null;
  public turn;
  public connected=true;
  public gameName;


  public board = [
    ["","",""],
    ["","",""],
    ["","",""]
  ];

  public ngOnInit() {
    this.getServerData();
  }

  public getServerData() {
    this.socket = io("https://kaneiscool.herokuapp.com/");
    this.socket.on("board", board => {
      this.board = board;
    });
    this.socket.on("turn", turn => {
      this.turn = turn;
    })
    this.socket.on("clearBoard", player => {
    this.player = null;
      alert(player + " Cleared The Board");
    });
    this.socket.on("players", players => {
      this.players = players;
    });
    this.socket.on("winner", winner => {
      if (winner != "") {
        alert(winner + " Wins!");
      }
    });
    this.socket.on("message", text => {
      const el = document.createElement('li');
      el.innerHTML = text;
      document.querySelector('ul');
    });
  }

  public setName(event: Event) {
    this.name = (event.target as HTMLInputElement).value;
  }

  public move(selection) {
    if (this.player == this.turn){
      this.socket.emit("move",[selection, this.player, this.name]);
    }
  }

  public clearBoard() {
    console.log(this.player);
    this.socket.emit("clearBoard", this.name);
  }

  public selectPlayer(selection) {
    console.log(this.player);
    if (this.player == null) {
      this.player = selection;
      this.socket.emit("selection", selection);
    }
  }

  public sendMessage() {
    const text = (<HTMLInputElement>document.getElementById("messageField")).value;

    this.socket.emit("message", [this.player, text]);
  }
}
