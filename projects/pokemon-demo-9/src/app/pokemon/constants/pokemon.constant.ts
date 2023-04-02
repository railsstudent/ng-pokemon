import { InjectionToken } from '@angular/core';
import { FlattenPokemon } from '../interfaces/pokemon.interface';

export const POKEMON_TOKEN = new InjectionToken<FlattenPokemon>('pokemon_token');
