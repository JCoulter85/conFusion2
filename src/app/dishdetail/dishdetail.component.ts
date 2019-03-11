import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { FormControl } from '@angular/forms';
import { ContactType } from '../shared/feedback';
import { Feedback } from "../shared/Feedback";
import { Comment } from '../shared/comment';
import { flyInOut, visibility, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})

export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  feedback: Feedback;
  contactType = ContactType;
  preview: Comment;
  showFeedback: boolean;
  newDate = new Date();
  showComment: string;
  errMess: string;
  dishcopy: Dish;
  comment: Comment;
  visibility = 'shown';

  feedbackForm = this.fb.group({
    author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
    comment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
    rating: ['5'],
  });

  formErrors = {
    'author': '',
    'comment': ''
  };


  validationMessages = {
    'author': {
      'required': 'First name is required.',
      'minlength': 'First name must be at least 2 characters long.',
      'maxlength': 'First name cannot be more than 25 characters long.',
    },
    'comment': {
      'required': 'A comment is required.',
      'minlength': 'The comment section must contain a few words.',
      'maxlength': 'We did not ask for a Doctorate Hypothesis. Please shorten your comment TY.',
    }
  };

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
    this.showFeedback = false;
    this.createForm();
  }


  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params
      .pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
  }

  createForm() {
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }
      this.showFeedback = true
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control.valid == false) {
        this.showFeedback = false
      }
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.showFeedback = false
          if (control.errors.hasOwnProperty(key)) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  }

  onSubmit() {
    let form = this.feedbackForm;
    var date = new Date()
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    let comment = {
      comment: form.get("comment").value,
      rating: form.get("rating").value,
      author: form.get("author").value,
      date: day + ' ' + monthNames[monthIndex] + ' ' + year,
    }

    this.dishcopy.comments.push(comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    console.log(this.feedback);
    this.feedbackForm.reset({
      author: '',
      comment: '',
      rating: '5',
    });
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length]
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length]
  }

  goBack(): void {
    this.location.back();
  }

}