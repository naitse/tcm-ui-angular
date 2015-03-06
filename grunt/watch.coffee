module.exports =
  options:
    livereload: '<%=config.livereloadPort%>'
  styles:
    files: ['src/styles/**/*.less', 'src/views/**/*.less']
    tasks: ['less']
  jade:
    files: 'src/**/*.jade'
    tasks: ['jade']
  assets:
    files: ['src/**/*.*', 'src/**', '!src/styles/**/*.less', '!src/**/*.jade']
    tasks: ['copy']
