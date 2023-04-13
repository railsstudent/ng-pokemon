export interface Resource {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    back_shiny: string;
    front_shiny: string;
  },
  stats: {
    base_stat: number;
    effort: number;
    stat: Resource;
  } [],
  abilities: {
    ability: Resource;
    slot: number;
    is_hidden: boolean;
  }[]
}

export type FlattenPokemon = Omit<Pokemon, 'sprites'| 'stats' | 'abilities'> & {
  back_shiny: string;
  front_shiny: string;
  stats: {
    name: string;
    base_stat: number;
    effort: number;
  }[];
  abilities: {
    name: string;
    is_hidden: boolean;
  }[];
}
