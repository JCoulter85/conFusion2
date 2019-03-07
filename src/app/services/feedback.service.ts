import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Feedback, ContactType } from '../shared/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  HttpClient: any;

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  submitFeedback(feedback: Feedback): Observable<FeedbackService> {
    return this.HttpClient.post('http://localhost:3000/feedback', feedback, {
      headers: new HttpHeaders({
        "_Content-Type": 'application/jason',
        get "Content-Type"() {
          return this["_Content-Type"];
        },
        set "Content-Type"(value) {
          this["_Content-Type"] = value;
        },
      })
    })
      .pipe(catchError(this.handleError));
  }
  handleError(handleError: any): any {
    throw new Error("Method not implemented.");
  }

}

