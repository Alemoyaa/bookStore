import { bookInterface } from 'src/app/models/book';
import { DataApiService } from './../../services/data-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  constructor(private dataApi: DataApiService) { }
  books: bookInterface[];
  ngOnInit() {
    this.getOffers();
    console.log('Ofertas', this.books);
  }

  getOffers(){
    this.dataApi.getAllBooksOffers().subscribe(offers => this.books = offers);
  }
}
