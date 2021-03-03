import HeadphonesIcon from './assets/headphones-icon.svg';
import PauseIcon from './assets/pause-icon.svg';
import PlayIcon from './assets/play-icon.svg';

import Uploader from './uploader.js';

/**
 * class for UI of the tool.
 */
export default class Ui {
  /**
   *
   * @param {object} config - user provided config for tool.
   */
  constructor({ config }) {
    this.config = config;

    this.uploader = new Uploader({
      config,
    });
  }

  /**
   * render the UI of the tool and return its container.
   *
   * @returns {object} - main block wrapper.
   */
  render() {
    return this.createMainBlock();
  }

  /**
   * creates and returns main block.
   *
   * @returns {object} - main block wrapper.
   */
  createMainBlock() {
    const mainBlock = document.createElement('div');

    mainBlock.id = 'main-block';
    mainBlock.classList.add('cdx-block');

    const audioUploadForm = this.createAudioUploadForm();

    mainBlock.appendChild(audioUploadForm);

    return mainBlock;
  }

  /**
   * creates and returns form for uploading audio file.
   *
   * @returns {object} - audio upload form.
   */
  createAudioUploadForm() {
    const audioForm = document.createElement('form');

    audioForm.id = 'audio-form';
    audioForm.enctype = 'multipart/form-data';

    const audioInput = document.createElement('input');

    audioInput.id = 'audio-input';
    audioInput.name = 'audio';
    audioInput.type = 'file';
    audioInput.accept = 'audio/*';
    audioInput.style.display = 'none';

    const audioLabel = document.createElement('label');

    audioLabel.classList.add('cdx-button');
    audioLabel.id = 'audio-uploader-label';
    audioLabel.htmlFor = 'audio-input';

    const headphonesIcon = document.createElement('span');

    headphonesIcon.id = 'headphones-icon';
    headphonesIcon.innerHTML = HeadphonesIcon;

    const audioLabelText = document.createElement('span');

    audioLabelText.id = 'audio-label-text';
    audioLabelText.classList.add('dark-color');
    audioLabelText.textContent = 'Upload Audio';

    audioLabel.appendChild(headphonesIcon);
    audioLabel.appendChild(audioLabelText);

    const uiObj = this;

    audioInput.addEventListener('change', async function () {
      try {
        if (this.files && this.files[0]) {
          const mainBlock = document.getElementById('main-block');

          mainBlock.innerHTML = '';

          const response = await uiObj.uploader.uploadAudio(this.files[0]);

          if (response && response.success == 1) {
            const audioBlock = await uiObj.createAudioBlock(response.file.url);

            mainBlock.appendChild(audioBlock);
          } else {
            throw new Error('Error uploading audio file');
          }
        }
      } catch (error) {
        console.log(error);
      }
    });

    audioForm.appendChild(audioInput);
    audioForm.appendChild(audioLabel);

    return audioForm;
  }

  /**
   * creates and returns the actual audio block after the audio file is uplaoded successfully.
   *
   * @param {string} audioFileURL - URL to the audio file.
   */
  async createAudioBlock(audioFileURL) {
    // eslint-disable-next-line no-undef
    const response = await fetch(audioFileURL);
    let blob = await response.blob();

    // console.log('response:', response);

    // const result = await response.json();

    // console.log('result:', result);

    const audioBlock = document.createElement('div');

    audioBlock.id = 'audio-block';

    const audioController = this.createAudioController(blob);

    audioBlock.appendChild(audioController);

    return audioBlock;
  }

  /**
   * creates sand returns UI for playing and stopping the audio.
   *
   * @param {string} audioFileURL - URL to the audio file.
   * @returns {object} - audio controller wrapper.
   */
  createAudioController(audioBlob) {
    const audioController = document.createElement('div');

    audioController.id = 'audio-controller';

    const playBtn = document.createElement('button');

    playBtn.id = 'audio-play-btn';
    playBtn.classList.add('dark-color');
    playBtn.classList.add('cdx-button');

    const playBtnIcon = document.createElement('span');

    playBtnIcon.id = 'play-btn-icon';
    playBtnIcon.innerHTML = PlayIcon;

    const playBtnText = document.createElement('span');

    playBtnText.id = 'play-btn-text';
    playBtnText.textContent = 'Play';

    playBtn.appendChild(playBtnIcon);
    playBtn.appendChild(playBtnText);

    const pauseBtn = document.createElement('button');

    pauseBtn.id = 'audio-pause-btn';
    pauseBtn.classList.add('dark-color');
    pauseBtn.classList.add('cdx-button');
    pauseBtn.style.display = 'none';

    const pauseBtnIcon = document.createElement('span');

    pauseBtnIcon.id = 'pause-btn-icon';
    pauseBtnIcon.innerHTML = PauseIcon;

    const pauseBtnText = document.createElement('span');

    pauseBtnText.id = 'pause-btn-text';
    pauseBtnText.textContent = 'Pause';

    pauseBtn.appendChild(pauseBtnIcon);
    pauseBtn.appendChild(pauseBtnText);

    audioController.appendChild(playBtn);
    audioController.appendChild(pauseBtn);

    const reader = new FileReader();
    let audio;

    reader.onload = function (event) {
      // eslint-disable-next-line no-undef
      audio = new Audio(event.target.result);
    };

    reader.readAsDataURL(audioBlob);

    playBtn.addEventListener('click', function () {
      this.style.display = 'none';
      pauseBtn.style.display = 'initial';
      audio.play();
    });

    pauseBtn.addEventListener('click', function () {
      this.style.display = 'none';
      playBtn.style.display = 'initial';
      audio.pause();
    });

    return audioController;
  }
}