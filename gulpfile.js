// ��ȡ����
var gulp = require('gulp'),
    childProcess = require('child_process'),
    electron = require('electron-prebuilt');

// ���� gulp ����
gulp.task('run', function () {
    childProcess.spawn(electron, ['--debug=5858','.'], {stdio:'inherit'});
});