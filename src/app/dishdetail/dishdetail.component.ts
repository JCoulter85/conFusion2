import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { FormControl } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']

})

export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  feedback: Feedback;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;
  preview: Comment;


  feedbackForm = new FormGroup({
    author: new FormControl(''),
    comment: new FormControl(''),
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
    private fb: FormBuilder) {
    this.createForm();
  }


  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      comment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { // Do we have a form? No, we have nothing to validate
     return;
    }

    // We are going to use the form a lot, lets make referencing it shorter
    const form = this.feedbackForm;

    // Track if form validates successfully
    let isFormValid = true    

    // Loop through fields
    for (const field in this.formErrors) {
        if (!this.formErrors.hasOwnProperty(field)) {
            continue; // No error for field, next
        }

        // clear previous error message (if any)
        this.formErrors[field] = '';

        // Get reference to field/control
        const control = form.get(field);

        // Is form isn't valid then we need to update error
        if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];

            // Look through controls errors add to error message
            for (const key in control.errors) {
                // We have an error, don't show preview
                isFormValid = false
                
                if (control.errors.hasOwnProperty(key)) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }
}

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
      author: '',
      comment: '',
    });
    this.feedbackFormDirective.resetForm();
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