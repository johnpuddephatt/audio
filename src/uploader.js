/**
 * This class handles uploading audio files and thumbnails.
 */
export default class Uploader {
  /**
   * @param {object} config - user provided tool config.
   */
  constructor({ config }) {
    this.config = config;

    this.errorResponse = {
      success: 0,
      url: null,
    };
  }

  /**
   * upload audio file.
   *
   * @param {object} audioFile - audio file.
   * @returns {object} response.
   */
  async uploadAudio(audioFile) {
    let response;

    if (this.config.audioEndpoint) {
      response = await this.uploadAudioToEndpoint(audioFile);
    } else if (this.config.audioUploader) {
      response = await this.uploadAudioUsingUploader(audioFile);
    }

    return response;
  }

  /**
   * @param {object} file - audio file to be uploaded.
   */
  async uploadAudioToEndpoint(file) {
    const response = await this.uploadToEndpoint(file, this.config.audioEndpoint, this.config.additionalHeaders, this.config.additionalData);

    return response;
  }

  /**
   *
   * @param {object} file - audio file to be uploaded.
   */
  async uploadAudioUsingUploader(file) {
    return this.uploadUsingUploader(file, this.config.audioUploader);
  }

  /**
   * @param {*} file - file to be uploaded.
   * @param {*} endpoint - endpoint at which file is to be uploaded.
   * @param {*} additionalHeaders - additional headers to be provided in the request.
   * @param {*} additionalData - additional data to be provided in the request.
   */
  async uploadToEndpoint(file, endpoint, additionalHeaders, additionalData) {
    try {
      const formData = new FormData();

      formData.append('file', file);

      Object.entries(additionalData).forEach(([key, value]) => {
        formData[key] = value;
      });

      // eslint-disable-next-line no-undef
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: Object.assign({
          contentType: ''
        } ,additionalHeaders),
        body: formData,
      });

      const result = await response.json();

      return result;
    } catch (error) {
      console.error(error);

      return this.errorResponse;
    }
  }

  /**
   *
   * @param {*} file - file to be uploaded.
   * @param {*} uploaderFunction - custome function provided by user for file storage.
   */
  async uploadUsingUploader(file, uploaderFunction) {
    try {
      const response = await uploaderFunction(file);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error(error);

      return this.errorResponse;
    }
  }
}