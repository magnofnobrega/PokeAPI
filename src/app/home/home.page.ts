import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CommonModule],
  standalone: true
})
export class HomePage implements OnInit {
  pokemon: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getPokemon('mewtwo');
  }

  getPokemon(name: string) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    this.http.get(url).subscribe((data: any) => {
      this.pokemon = {
        name: data.name,
        image: data.sprites.front_default,
      };
    });
  }
}