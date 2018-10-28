import { Component, OnInit, Input } from '@angular/core';
import { dish } from '../shared/dish';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishDetailComponent implements OnInit {

    @Input()
  dish: dish;

  constructor() { }

  ngOnInit() {
  }

}
