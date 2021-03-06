import './index.css';
import AudioIcon from './assets/audio-icon.svg';

import Ui from './ui.js';

/**
 * Audio tool interface class.
 */
export default class Audio {
  /**
   * @param {object} tool - tool properties got from editor.js
   * @param {object} tool.data - editor.js data.
   * @param {object} tool.config - user provided config for the tool.
   */
  constructor({ data, config }) {
    this.data = data;

    this.config = {
      additionalData: config.additionalData || {},
      additionalHeaders: config.additionalHeaders || {},
      audioEndpoint: config.audioEndpoint || undefined,
      audioUploader: config.audioUploader || undefined,
    };

    this.ui = new Ui({
      config: this.config,
    });

    this.block = this.ui.render();

    this.audioURL = 'test';
  }

  /**
   * toolbox
   *
   * @returns {object} toolbox - config related to showing the tool in toolbox such as name and icon.
   */
  static get toolbox() {
    return {
      icon: AudioIcon,
      title: 'Audio',
    };
  }

  /**
   * Renders tool UI
   *
   * @returns {object} - main tool wrapper.
   */
  render() {
    try {
      return this.block;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * outputs data.
   *
   * @param {object} blockContent - block content wrapper.
   * @returns {object} output - output data.
   */
  save(blockContent) {
    return {
      audioURL: this.audioURL,
    };
  }
}