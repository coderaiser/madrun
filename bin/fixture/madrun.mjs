export default {
    test: () => 'tape test/*.js',
    pretest: () => 'echo "hi"',
    posttest: () => 'echo "world"',
}
