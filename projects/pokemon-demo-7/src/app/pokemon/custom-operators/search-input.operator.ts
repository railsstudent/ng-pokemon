import { debounceTime, distinctUntilChanged, filter, map, Observable } from "rxjs"
import { POKEMON_ACTION } from "../enum/pokemon.enum";

export const searchInput = (minPokemonId: number, maxPokemonId: number) => {
  return (source: Observable<any>) => source.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => prev.searchId === curr.searchId),
      filter((form) => form.searchId >= minPokemonId && form.searchId <= maxPokemonId),
      map((form) => form.searchId),
      map((value) => ({
        value,
        action: POKEMON_ACTION.OVERWRITE,
      }))
    );
}
