import { debounceTime, distinctUntilChanged, filter, map, Observable } from "rxjs"
import { POKEMON_ACTION } from "../enum/pokemon.enum";

export const searchInput = (minPokemonId = 1, maxPokemonId = 100) => {
  return (source: Observable<number>) => source.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((form) => form >= minPokemonId && form <= maxPokemonId),
      map((form) => Math.floor(form)),
      map((value) => ({
        value,
        action: POKEMON_ACTION.OVERWRITE,
      }))
    );
}
