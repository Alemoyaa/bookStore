import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { bookInterface } from './../models/book';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataApiService {

  constructor(private afs: AngularFirestore) {}
  private booksCollection: AngularFirestoreCollection<bookInterface>;
  private books: Observable<bookInterface[]>;
  private bookDoc: AngularFirestoreDocument<bookInterface>;
  private book: Observable<bookInterface>;

  public selectedBook: bookInterface = {
    id: null
  };

  getAllBooks() {
    
    this.booksCollection = this.afs.collection<bookInterface>('books');
    return this.books = this.booksCollection.snapshotChanges()
    // snapshotChanges Devuelve un observable de datos
    .pipe(map(changes =>{
      // .pipe permiten unir multiples funciones en una sola
      return changes.map( action => {
        // map nos permite recibir un valor de entrada y devolver un vcalor diferente al recibido
        const data = action.payload.doc.data() as bookInterface;
        // El operador "as" se usa para castear se incluyo en tsp ya que el casteo
        // con <Circle> trae conflictos con la sintaxis de JSX
        data.id = action.payload.doc.id;
        return data;
      });
    }));
  }

  getAllBooksOffers(){
    this.booksCollection = this.afs.collection('books', ref => ref.where('oferta', '==', '1')); // Llamamos a una funcion que atravez de una query nos trae lo que le especificamos
    return this.books = this.booksCollection.snapshotChanges()
    .pipe(map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as bookInterface;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
  }

  getOneBook(idBook: string){
    this.bookDoc = this.afs.doc<bookInterface>(`books/${idBook}`); // Esto va a la coleccion de libros y busca la id que le pasamos
    return this.book = this.bookDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      }  else {
        const data = action.payload.data() as bookInterface;
        data.id = action.payload.id;
        return data;
      }
    }));
  }

  addBook(book: bookInterface): void {
    this.booksCollection.add(book);
  }

  updateBook(book: bookInterface): void  {
    let idBook = book.id;
    this.bookDoc = this.afs.doc<bookInterface>(`books/${idBook}`); // Le paso el id y luego filtramos para encotrar el libro
    this.bookDoc.update(book);  // Despues se actualiza
  }

  deleteBook(idBook: string): void  { 
    this.bookDoc = this.afs.doc<bookInterface>(`books/${idBook}`); 
    this.bookDoc.delete();
  }

}
