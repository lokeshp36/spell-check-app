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
  suggestions = [];
  errors = [];

  timeout: any = null;

  ngOnInit(): void {
    document.addEventListener('click', (event) => {
      console.log(event);
      let menu = document.getElementById("custom-menu");
      menu.style.display = "none";
      this.suggestions = [];
   });
  }

  checkSpelling(element) {
    this.oneWithColors.nativeElement.innerHTML = this.oneWithText.nativeElement.innerHTML;
    // console.log(element);
    let text = this.oneWithText.nativeElement.textContent;
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      if (text) {
        this.spellCheckService.checkSpelling(text).subscribe((res: any) => {
          console.log(res.response.errors[0]);
          if (res.response.errors.length) {
            this.highlightText(res.response.errors);
            this.errors = res.response.errors;
          }
        });
      }
    }, 700);
  }

  highlightText(errors) {
    console.log(this.oneWithText);
    errors.forEach((error) => {
      let replacementString = "<span class='error'>" + error.bad + "</span>";
      this.oneWithColors.nativeElement.innerHTML = this.oneWithColors.nativeElement.innerHTML.replace(new RegExp("\\b"+error.bad+"\\b"), replacementString);
    });
  }

  onRightClick(event) {
    event.preventDefault();
    // console.log(window.getSelection());
    // console.log(window.event);
    
    let menu = document.getElementById("custom-menu");
    menu.style.display = "block";
    menu.style.left = (event.pageX-200)+"px";
    menu.style.top = (event.pageY)+"px";
    
    let str1 = this.getClickedWord();
    console.log(str1);

    let errorItem = this.errors.find(e => e.bad === str1);
    this.suggestions = errorItem['better'].length > 0 ? errorItem['better'] : [];
  }

  getClickedWord() {
    let s = window.getSelection();
    let range = s.getRangeAt(0);
    let node = s.anchorNode;
    
    // Find starting point
    while(range.toString().indexOf(' ') != 0) {                 
      range.setStart(node,(range.startOffset -1));
    }
    range.setStart(node, range.startOffset +1);
    
    // Find ending point
    do {
      range.setEnd(node,range.endOffset + 1);
    } while(range.toString().indexOf(' ') == -1 && range.toString().trim() != '');
  
    // Alert result
    var str = range.toString().trim();
    return str;
  }

  replaceSelectedText(replacementText) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText + ' '));
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.text = replacementText + ' ';
    }

    this.checkSpelling(this.oneWithText);
  }
}
