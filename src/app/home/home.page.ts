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
  pokemonId: number = 1;
  totalPokemons: number = 1010;

  paginas: { label: string, value: string }[] = [];
  paginaAtual: { label: string, value: string } | null = null;
  indicePaginaAtual: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getTotalPokemons();
    this.getPokemon(this.pokemonId);
  }

  getPokemon(idOuNome: number | string) {
    const url = `https://pokeapi.co/api/v2/pokemon/${idOuNome}`;
    this.http.get(url).subscribe((data: any) => {
      this.pokemonId = data.id;

      const tipos = data.types.map((t:any) => t.type.name);

      this.pokemon = {
        name: data.name,
        image: data.sprites.front_default,
        tipo1: this.traduzirTipo(tipos[0] || ''),
        tipo2: this.traduzirTipo(tipos[1] || '')
      };

      const traduzirStatus = (nome: string): string => {
        const mapa: { [key: string]: string } = {
          hp: 'HP',
          attack: 'Ataque',
          defense: 'Defesa',
          'special-attack': 'Esp.Ataque',
          'special-defense': 'Esp.Defesa',
          speed: 'Velocidade'
        };
        return mapa[nome] || nome;
      };

      this.paginas = [
        {label: 'Nome', value: data.name },
        {label: 'Altura', value: `${data.height / 10}m` },
        {label: 'Peso', value: `${data.weight / 10}kg` },
        {label: 'Habilidades', value: data.abilities.map((a: any) => a.ability.name).join(', ') },
        {label: 'Status', 
          value: data.stats.map((s: any) => ({
          nome: traduzirStatus(s.stat.name), 
          valor: s.base_stat
          }))
        }
      ];

      this.definirPagina(0);

    });
  }

  definirPagina(indice: number) {
    if (indice >= 0 && indice <= 2) {
      this.indicePaginaAtual = indice;
      this.paginaAtual = this.paginas[indice];
    }
  }

  proxima() {
    if (this.indicePaginaAtual < 2)
      this.definirPagina(this.indicePaginaAtual + 1);
  }

  anterior() {
    if (this.indicePaginaAtual > 0) {
      this.definirPagina(this.indicePaginaAtual - 1);
    }
  }

  traduzirTipo(tipo: string): string {
  const traducoes: { [key: string]: string } = {
    normal: 'Normal',
    fire: 'Fogo',
    water: 'Água',
    electric: 'Elétrico',
    grass: 'Grama',
    ice: 'Gelo',
    fighting: 'Lutador',
    poison: 'Veneno',
    ground: 'Terra',
    flying: 'Voador',
    psychic: 'Psíquico',
    bug: 'Inseto',
    rock: 'Pedra',
    ghost: 'Fantasma',
    dragon: 'Dragão',
    dark: 'Sombrio',
    steel: 'Aço',
    fairy: 'Fada',
    };
    return traducoes[tipo] || tipo;
  }

  isStatusArray(value: any): value is { nome: string; valor: number }[] {
    return Array.isArray(value);
  }

  proximoPokemon() {
    if (this.pokemonId < this.totalPokemons) {
      this.getPokemon(this.pokemonId + 1)
    }
  }

  pokemonAnterior() {
    if (this.pokemonId > 1) {
      this.getPokemon(this.pokemonId - 1);
    }
  }

  getTotalPokemons() {
    this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=1')
      .subscribe(data => {
        this.totalPokemons = data.count;
      });
  }
}