const TestSequencer = require('@jest/test-sequencer').default;
const dirPath = '/home/dauletbatayev/Desktop/UCL/Year 2/Systems Engineering/application/server/test/';

class CustomSequencer extends TestSequencer {
  sort(tests) {
    const orderPath = [
      dirPath + 'jwtAuth.test.js',
      dirPath + 'getFeeds.test.js',
      dirPath + 'authorize.test.js',
      dirPath + 'validInfo.test.js',
      dirPath + 'myPatients.test.js',
      dirPath + 'patientInfo.test.js'
    ];
    return tests.sort((testA, testB) => {
      const indexA = orderPath.indexOf(testA.path);
      const indexB = orderPath.indexOf(testB.path);

      if (indexA === indexB) return -1;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA < indexB ? -1 : 1;
    })
  }
}

module.exports = CustomSequencer;