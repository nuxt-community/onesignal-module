module.exports = {
  testEnvironment: 'node',
  preset: '@nuxt/test-utils',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**',
    '!src/runtime/**'
  ]
}
