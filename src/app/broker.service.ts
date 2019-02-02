import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class BrokerService {
  apiURL: string = "https://faa-crm.me";

  constructor(private http: HttpClient) {}

  registerLead(data) {
    return this.http.post(`${this.apiURL}/api/leads/anonymous`, data);
  }

  autologin(id) {
    return this.http.get(`${this.apiURL}/api/leads/autologin/${id}`);
  }
}
