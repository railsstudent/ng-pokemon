import { Injector, inject } from '@angular/core';
import { POKEMON_TOKEN } from '../../constants/pokemon.constant';
import { FlattenPokemon } from '../../interfaces/pokemon.interface';

export const createPokemonInjectorFn = () => {
    const injector = inject(Injector);
    return (pokemon: FlattenPokemon) => 
        Injector.create({
            providers: [{ provide: POKEMON_TOKEN, useValue: pokemon }],
            parent: injector
        });
}