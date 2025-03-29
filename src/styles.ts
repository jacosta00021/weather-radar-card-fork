import { css } from 'lit';

export const styles = css`
  :host {
    --radar-height: 492px;
    --panel-radar-height: 540px;
    --progress-bar-width: 0;
  }

  .text-container {
    font: 12px/1.5 'Helvetica Neue', Arial, Helvetica, sans-serif;
  }

  .text-container-small {
    font: 10px/1.5 'Helvetica Neue', Arial, Helvetica, sans-serif;
    margin: 0 10px 0 2.5px;
  }

  #timestamp {
    margin: 2px 0;
  }

  #color-bar {
    margin: 0;
    height: 8px;
  }

  .radar-container {
    width: 100%;
    position: relative;
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

  .progress-bar {
    height: 8px;
    width: var(--progress-bar-width);
    background-color: var(--progress-bar-color, #ccf2ff);
  }

  .progress-bar-container {
    height: 8px;
    background-color: var(--progress-bar-bg, white);
  }

  .bottom-container {
    height: 32px;
    background-color: var(--bottom-container-bg, white);
  }

  .bottom-container--dark {
    background-color: #1C1C1C;
    color: #DDDDDD;
  }

  .timestamp-container {
    width: 120px;
    height: 32px;
    float: left;
    position: absolute;
  }

  .attribution-container {
    height: 32px;
    float: right;
  }

  .radar-map {
    width: 100%;
    height: var(--radar-height);
  }

  .panel-mode {
    height: var(--panel-radar-height);
  }

  .square-map {
    height: var(--square-map-height);
  }
`;
