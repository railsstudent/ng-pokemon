import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { map } from "rxjs";
import { Pokemon } from "../interfaces/pokemon.interface";
import { PokemonService } from "../services/pokemon.service";

export const retrievePokemonFn = () => {
  const httpClient = inject(HttpClient);
  return (id: number) => httpClient.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .pipe(
      map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        back_shiny: pokemon.sprites.back_shiny,
        front_shiny: pokemon.sprites.front_shiny,
        abilities: pokemon.abilities.map((ability) => ({
          name: ability.ability.name,
          is_hidden: ability.is_hidden
        })),
        stats: pokemon.stats.map((stat) => ({
          name: stat.stat.name,
          effort: stat.effort,
          base_stat: stat.base_stat,
        })),
      }))
    );
}

export const getPokemonId = () => inject(PokemonService).pokemonId$;
