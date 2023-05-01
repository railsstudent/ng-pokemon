import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { FlattenPokemon } from '../interfaces/pokemon.interface';
import { PokemonAbilitiesComponent } from '../pokemon-abilities/pokemon-abilities.component';
import { PokemonStatsComponent } from '../pokemon-stats/pokemon-stats.component';

@Component({
  selector: 'app-pokemon-tab',
  standalone: true,
  template: `
    <div class="container">
      <div>
        <div>
          <input type="radio" id="all" name="selection" value="all"
            checked (click)="selection = 'ALL'; renderDynamicComponents();">
          <label for="all">All</label>
        </div>
        <div>
          <input type="radio" id="stats" name="selection" value="stats"
            (click)="selection = 'STATISTICS'; renderDynamicComponents();">
          <label for="stats">Stats</label>
        </div>
        <div>
          <input type="radio" id="abilities" name="selection" value="abilities"
            (click)="selection = 'ABILITIES'; renderDynamicComponents();">
          <label for="abilities">Abilities</label>
        </div>
      </div>
      <ng-container #vcr></ng-container>
    </div>
  `,
  styles: [`
    div.container { 
      padding: 0.5rem;

      > div {
        display: flex;

        > div {
          flex-grow: 1;
          flex-shrink: 1;
          flex-basis: calc(100% / 3);

          input[type="radio"] {
            margin-right: 0.25rem;
          }
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonTabComponent implements OnDestroy, OnInit, OnChanges {
  @Input()
  pokemon!: FlattenPokemon;

  @ViewChild('vcr', { static: true, read: ViewContainerRef })
  vcr!: ViewContainerRef;

  selection: 'ALL' | 'STATISTICS' | 'ABILITIES' = 'ALL';
  componentRefs: ComponentRef<PokemonStatsComponent | PokemonAbilitiesComponent>[] = [];

  cdr = inject(ChangeDetectorRef);

  private async getComponenTypes() {
    const { PokemonStatsComponent } = await import('../pokemon-stats/pokemon-stats.component');
    const { PokemonAbilitiesComponent } = await import('../pokemon-abilities/pokemon-abilities.component');

    if (this.selection === 'ALL') {
      return [PokemonStatsComponent, PokemonAbilitiesComponent];
    } else if (this.selection === 'STATISTICS')  {
      return [PokemonStatsComponent];
    }

    return [PokemonAbilitiesComponent];    
  }

  async renderDynamicComponents(currentPokemon?: FlattenPokemon) {
    const componentTypes = await this.getComponenTypes();

    // clear dynamic components shown in the container previously    
    this.vcr.clear();
    for (const componentType of componentTypes) {
      const newComponentRef = this.vcr.createComponent(componentType);
      newComponentRef.instance.pokemon = currentPokemon ? currentPokemon : this.pokemon;
      // store component refs created
      this.componentRefs.push(newComponentRef);
      // run change detection in the component and child components
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    this.renderDynamicComponents();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.renderDynamicComponents(changes['pokemon'].currentValue);
  }

  ngOnDestroy(): void {
    // release component refs to avoid memory leak
    for (const componentRef of this.componentRefs) {
      if (componentRef) {
        componentRef.destroy();
      }
    }
  }
}
