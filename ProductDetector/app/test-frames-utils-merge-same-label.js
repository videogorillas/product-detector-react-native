var equal = require('deep-equal');
import {mergeSameLabel} from './frames-utils'

var testData = [
  {
    frames: [
          {xmin: 0.00, ymin: 0.00, width: 1.00, height: 1.00, score: 0.90, label: 'Miller'},
          {xmin: 0.10, ymin: 0.10, width: 0.80, height: 0.80, score: 0.70, label: 'Miller'},
          ],
    merged: [
          {xmin: 0.05, ymin: 0.05, width: 0.90, height: 0.90, score: 0.90, label: 'Miller'},
          ]
  },
  {
    frames: [
          {xmin: 0.00, ymin: 0.00, width: 1.00, height: 1.00, score: 0.90, label: 'Miller'},
          {xmin: 0.20, ymin: 0.20, width: 0.60, height: 0.60, score: 0.75, label: 'Miller'},
          {xmin: 0.10, ymin: 0.10, width: 0.80, height: 0.80, score: 0.50, label: 'Miller'},
          {xmin: 0.30, ymin: 0.30, width: 0.40, height: 0.40, score: 0.80, label: 'Miller'},
          {xmin: 0.40, ymin: 0.40, width: 0.20, height: 0.20, score: 0.70, label: 'Miller'},
          ],
    merged: [
          {xmin: 0.30000000000000004, ymin: 0.30000000000000004, width: 0.40, height: 0.40, score: 0.90, label: 'Miller'},
          ]
  },
  {
    frames: [
          {xmin: 0.00, ymin: 0.00, width: 0.10, height: 0.10, score: 0.75, label: 'Miller'},
          {xmin: 0.10, ymin: 0.10, width: 0.80, height: 0.80, score: 0.90, label: 'Miller'},
          {xmin: 0.10, ymin: 0.20, width: 0.80, height: 0.80, score: 0.70, label: 'Miller'},
          {xmin: 0.90, ymin: 0.90, width: 0.10, height: 0.10, score: 0.80, label: 'Miller'},
          ],
    merged: [
          {xmin: 0.00, ymin: 0.00, width: 0.10, height: 0.10, score: 0.75, label: 'Miller'},
          {xmin: 0.10, ymin: 0.15000000000000002, width: 0.80, height: 0.80, score: 0.90, label: 'Miller'},
          {xmin: 0.90, ymin: 0.90, width: 0.10, height: 0.10, score: 0.80, label: 'Miller'},
          ]
  }
]


testData.forEach((bundle, i, arr) => {
  let merged = mergeSameLabel(bundle.frames);
  if (equal(bundle.merged, merged)) {
      console.log('--- PASSED')
  } else {
      console.log('--- FAILED !!! expected:');
      console.log(bundle.merged);
      console.log('actual:');
      console.log(merged);
  }
})