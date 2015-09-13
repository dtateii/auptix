var src =   './src',
  dest =  './web/assets',
  base =  './web';

module.exports = {
  main: {
    src: src,
    dest: dest,
    base: base
  },
  browserify: {
    bundleConfigs: [{
      entry: src + '/js/app.js',
      outputName: 'main.js',
      dest: dest + '/js'
    }],
  },
  sass: {
    entry: src + '/scss/style.scss',
    dest: dest + '/css',
    style: 'expanded' // 'compressed'
  },
};