var equal = require('deep-equal');
import {intersect} from './frames-utils'

let testData = [
  [
    {xmin: 0.00, ymin: 0.00, width: 0.50, height: 0.50, score: 1.00, label: 'Miller'},
    {xmin: 0.00, ymin: 0.00, width: 1.00, height: 1.00, score: 0.50, label: 'Miller'},
    {xmin: 0.00, ymin: 0.00, width: 0.50, height: 0.50, score: 1.00, label: 'Miller'}
  ],
  [
    {xmin: 0.00, ymin: 0.00, width: 0.50, height: 0.50, score: 1.00, label: 'other'},
    {xmin: 0.00, ymin: 0.00, width: 1.00, height: 1.00, score: 0.50, label: 'Miller'},
    null
  ],
  [
    {xmin: 0.10, ymin: 0.10, width: 0.80, height: 0.80, score: 1.00, label: 'Miller'},
    {xmin: 0.30, ymin: 0.30, width: 0.20, height: 0.20, score: 0.50, label: 'Miller'},
    {xmin: 0.30, ymin: 0.30, width: 0.20, height: 0.20, score: 1.00, label: 'Miller'},
  ],
  [
    {xmin: 0.10, ymin: 0.10, width: 0.10, height: 0.10, score: 1.00, label: 'Miller'},
    {xmin: 0.30, ymin: 0.30, width: 0.20, height: 0.20, score: 0.50, label: 'Miller'},
    null
  ]
]

function testIntersect(frameA, frameB, frameE) {
    let frameI = intersect(frameA, frameB);
//     console.log(frameA);
//     console.log(frameB);
//     console.log('Intersection:');
//     console.log(frameI);
    if (equal(frameE, frameI)) {
      console.log('--- PASSED')
    }
    else {
      console.log('--- FAILED !!! expected:');
      console.log(frameE);
      console.log('actual:');
      console.log(frameI);
    }
}

testData.forEach((bundle, i, arr) => {
  testIntersect(bundle[0], bundle[1], bundle[2]);
});
