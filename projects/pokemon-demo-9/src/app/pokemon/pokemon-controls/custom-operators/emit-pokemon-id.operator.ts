import { Observable, scan, shareReplay, startWith } from "rxjs"
import { POKEMON_ACTION } from "../enum/pokemon.enum";

export const emitPokemonId = (minPokemonId = 1, maxPokemonId = 100) => {
  return (source: Observable<any>) => {
    return source.pipe(
      scan((acc, { value, action }) => {
        if (action === POKEMON_ACTION.OVERWRITE) {
          return value;
        } else if (action === POKEMON_ACTION.ADD) {
          const potentialValue = acc + value;
          return Math.min(maxPokemonId, Math.max(minPokemonId, potentialValue));
        }

        return acc;
      }, 1),
      startWith(1),
      shareReplay(1),
    )
  }
}
