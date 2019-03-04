import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  HttpClient: any;

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  save(feedback: Feedback): Observable<FeedbackService> {
    return this.HttpClient.post('http://localhost:3000/contactus', feedback, {
      headers: new HttpHeaders({
        'Content-Type': 'application/jason'
      })
    })
      .pipe(catchError(this.handleError));
  }
  handleError(handleError: any): any {
    throw new Error("Method not implemented.");
  }

}

