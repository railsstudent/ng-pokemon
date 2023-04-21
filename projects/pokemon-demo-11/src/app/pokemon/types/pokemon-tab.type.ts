import { PokemonAbilitiesComponent } from '../pokemon-abilities/pokemon-abilities.component';
import { PokemonStatsComponent } from '../pokemon-stats/pokemon-stats.component';

export type DynamicComponents = (typeof PokemonAbilitiesComponent | typeof PokemonStatsComponent)[];