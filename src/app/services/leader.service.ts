import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeaders(): Leader[] {
    return Leader[0];
  }

  getLeader(id: string): Leader {
    return LEADERS.filter((leader) => (leader.id === id))[0];
  }

  getFeaturedLeader(): Leader {
    return LEADERS.filter((Leader) => Leader)[0];
  }
}