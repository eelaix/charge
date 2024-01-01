module.exports = {
  pages: {
    chargerbk: {
      entry: 'src/chargerbk.js',
      template: 'public/chargerbk.html',
      filename: 'chargerbk.html',
      title: 'Eddievolt ChargeHub',
      chunks: ['chunk-vendors', 'chunk-common', 'chargerbk']
    },
    index: 'src/chargerbk.js'
  },
  publicPath: '',
  outputDir: 'dist'
}
