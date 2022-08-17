import { Component, OnInit } from "@angular/core";
import { SpellCheckService } from "./spell-check.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(private spellCheckService: SpellCheckService) {}
  title = "spell-check-app";

  timeout: any = null;

  ngOnInit(): void {
    // this.callAPI("sdfsdf");
  }

  checkSpelling(text) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      if (text) {
        this.spellCheckService
          .checkSpelling(text)
          .subscribe((res) => console.log(res));
      }
    }, 2000);
  }
}
