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
  static submitFeedback(submitFeedback: any): any {
    throw new Error("Method not implemented.");
  }
  HttpClient: any;
  feedback: Feedback;

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  submitFeedback(feedback: Feedback): Observable<Feedback> {
    return this.HttpClient.post('http://localhost:3000/feedback', feedback, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  };
}
