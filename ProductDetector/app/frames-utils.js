
function toString(frames) {
//     return frames.reduce((s0, frame, i) => {return s0 + '\n' + i + ': ' + frame.label + ' ' + frame.score + (frame.id ? ' /'+frame.id : '')}, 'length ' + frames.length);
    return frames.reduce((s0, frame, i) => {return s0 + '\n' + JSON.stringify(frame)}, 'length ' + frames.length);
}

function filterByScore(frames) {
    return frames.filter((f) => {return f.score >= 0.2});
}

function sortByScore(frames) {
    frames.sort((a, b) => {return a.score - b.score});
    return frames;
}

function addId(frames) {
    frames.forEach((item, i, arr) => { item.id = i });
    return frames;
}

function intersect(frameA, frameB) {
    // ymin: 0.00, xmin: 0.00, width: 0.50, height: 0.50
    if (frameA.label != frameB.label) return null;
    let xmin = Math.max(frameA.xmin, frameB.xmin);
    let ymin = Math.max(frameA.ymin, frameB.ymin);
    let width = Math.min(frameA.xmin + frameA.width, frameB.xmin + frameB.width) - xmin;
    let height = Math.min(frameA.ymin + frameA.height, frameB.ymin + frameB.height) - ymin;
    let score = Math.max(frameA.score, frameB.score);
    if (width > 0 && height > 0)
      return {label: frameA.label, xmin: xmin, ymin: ymin, width: width, height: height, score: score}
    else
      return null;
}

function process(frames) {
    console.log('\n>> frames received | ' + toString(frames));
  
    frames = filterByScore(frames);
    console.log('\n>> filtered | ' + toString(frames));

    frames = sortByScore(frames)
    console.log('\n>> sorted | ' + toString(frames));
    
    frames = addId(frames);
    console.log('\n>> with id | ' + toString(frames));
    
    return frames;
}

export {process as default, intersect as intersect}