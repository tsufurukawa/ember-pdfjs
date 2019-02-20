'use strict';

const path = require('path');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const UnwatchedDir = require('broccoli-source').UnwatchedDir;

module.exports = {
  name: 'ember-pdfjs',

  included (app, parentAddon) {
    this._super.included(...arguments);
    while (app.app) {
      app = app.app;
    }

    const rs = require.resolve('pdfjs-dist');
    let pdfjsPath = path.dirname(path.dirname(rs));
    this.pdfjsNode = new UnwatchedDir(pdfjsPath);
    app.import('vendor/pdfjs-dist/build/pdf.js');
    app.import('vendor/pdfjs-dist/build/pdf.worker.js');
    app.import('vendor/pdfjs-dist/web/pdf_viewer.js');
    app.import('vendor/pdfjs-dist/web/pdf_viewer.css');

    app.import('vendor/ember-pdfjs.css');
  },

  treeForPublic (tree) {
    var trees = [];

    trees.push(new Funnel(tree, {
      srcDir: '/',
      include: ['test.pdf'],
      destDir: '/assets'
    }));
    trees.push(new Funnel(this.pdfjsNode, {
      srcDir: 'build',
      include: ['pdf.js', 'pdf.worker.js'],
      destDir: '/'
    }));
    trees.push(new Funnel(this.pdfjsNode, {
      srcDir: 'web',
      include: ['compatibility.js'],
      destDir: '/assets'
    }));
    trees.push(new Funnel(this.pdfjsNode, {
      srcDir: 'cmaps',
      include: ['**/*.bcmap'],
      destDir: '/assets/web/cmaps'
    }));

    return mergeTrees(trees);
  },

  treeForVendor (tree) {
    let trees = [];

    if (tree) {
      trees.push(tree);
    }
    trees.push(new Funnel(this.pdfjsNode, {
        srcDir: 'build',
        include: ['pdf.js', 'pdf.worker.js'],
        destDir: 'pdfjs-dist/build',
      })
    );

    trees.push(new Funnel(this.pdfjsNode, {
        srcDir: 'web',
        include: ['pdf_viewer.js', 'pdf_viewer.css'],
        destDir: 'pdfjs-dist/web',
      })
    );

    return mergeTrees(trees);
  }
};
