var equal = require('deep-equal');
import {framesToMap} from './frames-utils'

var frames = [
        {ymin: 0.00, xmin: 0.00, width: 0.50, height: 0.50, score: 1.00, label: 'one'},
        {ymin: 0.00, xmin: 0.00, width: 1.00, height: 1.00, score: 0.50, label: 'another'},
        {ymin: 0.25, xmin: 0.25, width: 0.25, height: 0.20, score: 0.90, label: 'Miller'},
        {ymin: 0.15, xmin: 0.15, width: 0.55, height: 0.60, score: 0.70, label: 'Miller'},
        {ymin: 0.65, xmin: 0.25, width: 0.55, height: 0.20, score: 0.80, label: 'smetana'},
        {ymin: 0.01, xmin: 0.20, width: 0.50, height: 0.10, score: 0.25, label: 'smetana'},
        {ymin: 0.35, xmin: 0.15, width: 0.25, height: 0.20, score: 0.04, label: 'Miller'},
        ]

let resultMap = framesToMap(frames)
let expectedMap = {
  'one': [
    frames[0]
  ],
  'another': [
    frames[1]
  ],
  'Miller': [
    frames[2],
    frames[3],
    frames[6],
  ],
  'smetana': [
    frames[4],
    frames[5],
  ],
}

if (equal(expectedMap, resultMap)) {
  console.log('--- PASSED')
} else {
  console.log('--- FAILED !!! expected:');
  console.log(expectedMap);
  console.log('actual:');
  console.log(resultMap);
}