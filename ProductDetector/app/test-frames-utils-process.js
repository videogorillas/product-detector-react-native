import processFrames from './frames-utils'

var frames0 = [
        {ymin: 0.00, xmin: 0.00, width: 0.50, height: 0.50, score: 1.00, label: 'one'},
        {ymin: 0.00, xmin: 0.00, width: 1.00, height: 1.00, score: 0.50, label: 'another'},
        {ymin: 0.25, xmin: 0.25, width: 0.25, height: 0.20, score: 0.90, label: 'Miller'},
        {ymin: 0.65, xmin: 0.25, width: 0.55, height: 0.20, score: 0.80, label: 'smetana'},
        {ymin: 0.01, xmin: 0.20, width: 0.50, height: 0.10, score: 0.01, label: 'smetana'},
        ]

processFrames(frames0)