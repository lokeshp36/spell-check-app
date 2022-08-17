import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SpellCheckService {
  constructor(private http: HttpClient) {}

  APIKey = "6io06zFDX34pUq7t";

  checkSpelling(text = "I is a engineer") {
    return this.http.get(
      "https://api.textgears.com/spelling?key=" +
        this.APIKey +
        "&text=" +
        text +
        "&language=en-GB"
    );
  }
}
