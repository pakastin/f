
var cp = require('child_process');

exec('npm', 'run', 'build');
exec('npm', 'run', 'build');
exec('chokidar', 'src/**/*.js', '-c', 'npm run build');
exec('chokidar', 'dist/f.js', '-c', 'npm run uglify');

function exec (cmd) {
  var args = new Array(arguments.length - 1);
  for (var i = 0; i < args.length; i++) {
    args[i] = arguments[i + 1];
  }
  var child = cp.spawn(cmd, args)
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}
