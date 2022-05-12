import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

export interface userModel {
  name: string,
  city: string,
  status: boolean
}

export interface paylaodModel {
  columns: string[],
  search: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'Stop Redundant APIs';
  showSearchBar: boolean = false;
  searchValue: FormControl = new FormControl();
  loading: boolean = false;
  users: userModel[];
  allUsers: userModel[] = [
    {
      name: 'Jone',
      city: 'Alabama',
      status: true
    },
    {
      name: 'Cena',
      city: 'Alabama',
      status: false
    },
    {
      name: 'Drake',
      city: 'Paris',
      status: false
    },
    {
      name: 'Tom',
      city: 'Madrid',
      status: true
    },
    {
      name: 'Jerry',
      city: 'London',
      status: true
    }
  ]

  constructor() {

    this.users = this.allUsers;
    this.searchValue.valueChanges
      .pipe (
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {

        const slug = 'api/get_patients';
        const paylaod: paylaodModel = {
          columns: ['name', 'city', 'avaliablity_status'],
          search: value
        }

        this.callApi(slug, paylaod);
      });
  }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
    if (!!this.searchValue.value)
      this.searchValue.setValue(null);
  }

  callApi(slug: string, paylaod: paylaodModel) {
    console.log('Calling API', slug, " with payload", paylaod);
    
    this.loading = true;
    setTimeout(() => {
      if (!paylaod.search) {
        this.users = this.allUsers;
        if (this.loading) this.loading = false;
        return;
      }

      this.users = [];
      this.allUsers.map(user => {
        if (user.name.toLowerCase().includes(paylaod.search.toLowerCase())) {
          this.users.push(user);
        }
      });

      if (this.loading) this.loading = false;
    }, 4000);
    return;
  }
}
