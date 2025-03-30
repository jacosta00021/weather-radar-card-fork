import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, LovelaceCard } from 'custom-card-helpers';
import { classMap } from 'lit/directives/class-map.js';
import './editor';

import { WeatherRadarCardConfig } from './types';
import { CARD_VERSION } from './const';

import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  WEATHER-RADAR-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).customCards = (window as any).customCards || [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).customCards.push({
  type: 'weather-radar-card',
  name: 'Weather Radar Card',
  description: 'A rain radar card using the new tiled images from RainViewer',
});

// TODO Name your custom element
@customElement('weather-radar-card')
export class WeatherRadarCard extends LitElement implements LovelaceCard {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('weather-radar-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  @property({ type: Boolean, reflect: true })
  public isPanel = false;

  // TODO Add any properities that should cause your element to re-render here
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) private _config!: WeatherRadarCardConfig;
  @property({ attribute: false }) public editMode?: boolean;

  public setConfig(config: WeatherRadarCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    /*   if (!config || config.show_error) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }*/

    this._config = config;
  }

  // #####
  // ##### Sets the card size so HA knows how to put in columns
  // #####

  getCardSize(): number {
    return 10;
  }

  protected shouldUpdate(/*changedProps: PropertyValues*/): boolean {
    return true;
    //    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  protected render(): TemplateResult | void {
    if (this._config.show_warning) {
      return this.showWarning(localize('common.show_warning'));
    }
  
    // Calculate dynamic classes
    const classes = {
      'panel-mode': this.isPanel,
      'edit-mode': Boolean(this.editMode), // Convert undefined to false
      'square-map': Boolean(this._config.square_map) // Convert undefined to false
    };
  
    // Calculate radar height using CSS custom properties
    this.updateRadarHeight();
  
    // Generate card title
    const cardTitle = this._config.card_title ? 
      html`<div class="card-title">${this._config.card_title}</div>` : 
      '';
  
    // Generate iframe content
    const doc = this.generateIframeContent();
  
    return html`
      <ha-card class="ha-card ${classMap(classes)}">
        ${cardTitle}
        <div class="root">
          <iframe class="radar-iframe" 
                  srcdoc=${doc} 
                  scrolling="no">
          </iframe>
        </div>
      </ha-card>
    `;
  }
  
  private updateRadarHeight(): void {
    let height = '540px';
    
    if (this.isPanel) {
      height = this.offsetParent
        ? `${this.offsetParent.clientHeight - 2 - (this.editMode ? 59 : 0)}px`
        : '540px';
    } else if (this._config.square_map !== undefined) {
      height = this._config.square_map
        ? `${this.getBoundingClientRect().width}px`
        : '540px';
    }
  
    this.style.setProperty('--radar-height', height);
  }
  
  private generateIframeContent(): string {
    // Move existing iframe HTML generation here
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Weather Radar Card</title>
          <!-- ... rest of your existing iframe content ... -->
        </head>
        <body>
          <!-- ... rest of your existing iframe content ... -->
        </body>
      </html>
    `;
  }

  private showWarning(warning: string): TemplateResult {
    return html`
      <hui-warning>${warning}</hui-warning>
    `;
  }

  private showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card') as LovelaceCard;
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this._config,
    });

    return html`
      ${errorCard}
    `;
  }

  get styles(): CSSResult {
    return css`
      :host {
        --radar-height: 540px;
        --card-padding: 0;
      }
  
      .text-container {
        font: 12px/1.5 'Helvetica Neue', Arial, Helvetica, sans-serif;
      }
  
      .timestamp {
        margin: 2px 0;
      }
  
      .color-bar {
        margin: 0;
      }
  
      .ha-card {
        overflow: hidden;
      }
  
      .root {
        width: 100%;
        position: relative;
        padding-top: var(--radar-height);
      }
  
      .radar-iframe {
        position: absolute;
        border: none;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
  
      .card-title {
        margin: 8px 0 4px 8px;
        font-size: 1.5em;
      }
  
      /* Dynamic states */
      :host(.panel-mode) {
        --radar-height: calc(100vh - 48px - 2px);
      }
  
      :host(.panel-mode.edit-mode) {
        --radar-height: calc(100vh - 48px - 2px - 59px);
      }
  
      :host(.square-map) {
        --radar-height: var(--card-width);
      }
    `;
  }
}
