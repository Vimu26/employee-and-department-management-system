import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchQueryService {
  private searchQuerySource = new BehaviorSubject<any>({});
  searchQuery$ = this.searchQuerySource.asObservable();

  //   constructor() {}

  // Update the search query
  setSearchQuery(query: any) {
    this.searchQuerySource.next(query);
  }
}
