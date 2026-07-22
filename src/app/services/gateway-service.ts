import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@envs/environment";

@Injectable({
  providedIn: "root",
})
export class GatewayService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getWeatherforecast(): Observable<any> {

    return this.http.get<any>(`${this.baseUrl}/weatherforecast`);
  }
}
