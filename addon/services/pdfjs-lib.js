/* global PDFJS */
import Ember from 'ember';

const { Service } = Ember;

export default Service.extend({
  pdfLib: undefined,
  init () {
    this._super(...arguments);

    this.PDFJS = PDFJS;

    // hardcoding as reading from env does not pick up
    // fingerprinted version for some reason.
    this.PDFJS.workerSrc = '/pdf.worker.js';
  }
});