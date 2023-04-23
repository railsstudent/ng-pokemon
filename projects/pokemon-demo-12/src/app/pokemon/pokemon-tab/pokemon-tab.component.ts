import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewContainerRef, inject, TemplateRef, EmbeddedViewRef } from '@angular/core';
import { FlattenPokemon } from '../interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-tab',
  standalone: true,
  imports: [NgFor],
  template: `
    <div style="padding: 0.5rem;" class="container">
      <div>
        <div>
          <input type="radio" id="all" name="selection" value="all"
            checked (click)="selection = 'ALL'; renderDyanmicTemplates();">
          <label for="all">All</label>
        </div>
        <div>
          <input type="radio" id="stats" name="selection" value="stats"
            (click)="selection = 'STATISTICS'; renderDyanmicTemplates();">
          <label for="stats">Stats</label>
        </div>
        <div>
          <input type="radio" id="abilities" name="selection" value="abilities"
            (click)="selection = 'ABILITIES'; renderDyanmicTemplates();">
          <label for="abilities">Abilities</label>
        </div>
      </div>
      <ng-container #vcr></ng-container>
    </div>

    <ng-template #stats let-pokemon>
      <div>
        <p>Stats</p>
        <div *ngFor="let stat of pokemon.stats" class="flex-container">
          <label>
            <span style="font-weight: bold; color: #aaa">Name: </span>
            <span>{{ stat.name }}</span>
          </label>
          <label>
            <span style="font-weight: bold; color: #aaa">Base Stat: </span>
            <span>{{ stat.base_stat }}</span>
          </label>
          <label>
            <span style="font-weight: bold; color: #aaa">Effort: </span>
            <span>{{ stat.effort }}</span>
          </label>
        </div>
      </div>
    </ng-template>

    <ng-template #abilities let-pokemon>
      <div>
        <p>Abilities</p>
        <div *ngFor="let ability of pokemon.abilities" class="flex-container">
          <label>
            <span style="font-weight: bold; color: #aaa">Name: </span>
            <span>{{ ability.name }}</span>
          </label>
          <label>
            <span style="font-weight: bold; color: #aaa">Is hidden? </span>
            <span>{{ ability.is_hidden ? 'Yes' : 'No' }}</span>
          </label>
          <label>&nbsp;</label>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
    }

    div.container > div:first-child {
      display: flex;
    } 

    div.container > div:first-child > div {
      flex-grow: 1;
      flex-shrink: 1;
      flex-basis: calc(100% / 3);
    }

    input[type="radio"] {
      margin-right: 0.25rem;
    }

    .flex-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .flex-container > * {
      flex-grow: 1;
      flex-basis: calc(100% / 3);
    }

    div.container > div:nth-child(n+2) {
      display: block;
      padding: 0.5rem; 
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonTabComponent implements OnDestroy, OnInit, OnChanges {
  @Input()
  pokemon!: FlattenPokemon;

  // obtain reference to ng-container element
  @ViewChild('vcr', { static: true, read: ViewContainerRef })
  vcr!: ViewContainerRef;

  // obtain reference ngTemplate named stats
  @ViewChild('stats', { static: true, read: TemplateRef })
  statsRef!: TemplateRef<any>;

  // obtain reference ngTemplate named abilities
  @ViewChild('abilities', { static: true, read: TemplateRef })
  abilitiesRef!: TemplateRef<any>;

  selection: 'ALL' | 'STATISTICS' | 'ABILITIES' = 'ALL';
  embeddedViewRefs: EmbeddedViewRef<any>[] = [];

  cdr = inject(ChangeDetectorRef);

  private getTemplateRefs() {
    if (this.selection === 'ALL') {
      return [this.statsRef, this.abilitiesRef];
    } else if (this.selection === 'STATISTICS') {
      return [this.statsRef];
    }

    return [this.abilitiesRef];
  }

  renderDyanmicTemplates(currentPokemon?: FlattenPokemon) {
    const templateRefs = this.getTemplateRefs();
    const pokemon = currentPokemon ? currentPokemon : this.pokemon;

    this.vcr.clear();
    for (const templateRef of templateRefs) {
      const embeddedViewRef = this.vcr.createEmbeddedView(templateRef, { $implicit: pokemon });
      this.embeddedViewRefs.push(embeddedViewRef);
      // after appending each embeddedViewRef to conta iner, I trigger change detection cycle
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    this.renderDyanmicTemplates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // when pokemon input changes, I update the pokemon in ngTemplates
    this.renderDyanmicTemplates(changes['pokemon'].currentValue);
  }

  ngOnDestroy() {
    // destroy embeddedViewRefs to avoid memory leak
    for (const viewRef of this.embeddedViewRefs) {
      if (viewRef) {
        viewRef.destroy();
      }
    }
  }
}