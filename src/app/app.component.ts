import { Component, OnInit, ViewChild } from "@angular/core";
import { SpellCheckService } from "./spell-check.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(private spellCheckService: SpellCheckService) {}
  @ViewChild("oneWithText", null) oneWithText;
  @ViewChild("oneWithColors", null) oneWithColors;
  title = "spell-check-app";

  timeout: any = null;

  ngOnInit(): void {}

  checkSpelling(element) {
    this.oneWithColors.nativeElement.innerHTML = this.oneWithText.nativeElement.innerHTML;
    console.log(element);
    let text = element.textContent;
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      if (text) {
        this.spellCheckService.checkSpelling(text).subscribe((res: any) => {
          console.log(res.response.errors[0]);
          if (res.response.errors.length) {
            this.highlightText(res.response.errors);
          }
        });
      }
    }, 2000);
  }

  highlightText(errors) {
    console.log(this.oneWithText);
    errors.forEach((error) => {
      let replacementString = "<span class='error'>" + error.bad + "</span>";
      this.oneWithColors.nativeElement.innerHTML = this.oneWithColors.nativeElement.innerHTML.replace(new RegExp("\\b"+error.bad+"\\b"), replacementString);
    });
  }
}
