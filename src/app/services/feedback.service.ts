import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  addfeedback (feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(this.feedbackUrl, feedback, httpOptions)
      .pipe(catchError(this.handleError('addfeedback', feedback)));
  }

}

