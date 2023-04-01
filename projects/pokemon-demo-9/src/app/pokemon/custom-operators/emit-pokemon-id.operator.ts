import { Observable, scan, shareReplay, startWith } from "rxjs"
import { POKEMON_ACTION } from "../enum/pokemon.enum";

export const emitPokemonId = (minPokemonId: number, maxPokemonId: number) => {
  return (source: Observable<any>) => {
    return source.pipe(
      scan((acc, { value, action }) => {
        if (action === POKEMON_ACTION.OVERWRITE) {
          return value;
        } else if (action === POKEMON_ACTION.ADD) {
          const potentialValue = acc + value;
          if (potentialValue >= minPokemonId && potentialValue <= maxPokemonId) {
            return potentialValue;
          } else if (potentialValue < minPokemonId) {
            return minPokemonId;
          }

          return maxPokemonId;
        }

        return acc;
      }, 1),
      startWith(1),
      shareReplay(1),
    )
  }
}
