import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand, visibility } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand(),
    visibility()
  ]
})

export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;

  @ViewChild('fform') feedbackFormDirective;


  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'First name is required.',
      'minlength': 'First name must be at least 2 characters long.',
      'maxlength': 'First name cannot be more than 25 characters long.',
    },
    'lastname': {
      'required': 'Last name is required.',
      'minlength': 'Last name must be at least 2 characters long.',
      'maxlength': 'Last name cannot be more than 25 characters long.',
    },
    'telnum': {
      'required': 'Tel. number is required.',
      'pattern': 'Tel. number must contain only numbers.',
    },
    'email': {
      'required': 'email is required.',
      'email': 'Email not in valid format.',
    }
  };
  http: any;
  processHTTPMsgService: any;
  submitFeedback: any;
  isSubmitting: boolean;
  hideForm: boolean;


  constructor(private feedbackService: FeedbackService,
    private fb: FormBuilder, ) {
    this.createForm();
  }

  ngOnInit() {
    this.isSubmitting = false;
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(() => this.onValueChanged());

    this.onValueChanged();
  }

  onValueChanged() {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    let form = this.feedbackForm;

    this.isSubmitting = true;
    this.hideForm = true;

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

    let feedback = {
      firstname: form.get("firstname").value,
      lastname: form.get("lastname").value,
      telnum: form.get("telnum").value,
      email: form.get("email").value,
      agree: form.get("agree").value,
      contacttype: form.get("contacttype").value,
      message: form.get("message").value,
      date: day + ' ' + monthNames[monthIndex] + ' ' + year,
    };


    this.feedbackService.submitFeedback(feedback)
      .subscribe(feedback => {
        this.feedback = feedback;
        console.log(this.feedback);
        this.isSubmitting = false;

        setTimeout(() => {
          this.feedback = null;
          this.feedbackForm.reset();
          this.hideForm = false;
        }, 5000);
      },
        errmess => {
          this.feedback = null;
        });



  }
}
