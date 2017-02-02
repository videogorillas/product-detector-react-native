
const common_area_percentage = 0.8;

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
    if (frameA.label != frameB.label) return null;
    let xmin = Math.max(frameA.xmin, frameB.xmin);
    let ymin = Math.max(frameA.ymin, frameB.ymin);
    let width = Math.min(frameA.xmin + frameA.width, frameB.xmin + frameB.width) - xmin;
    let height = Math.min(frameA.ymin + frameA.height, frameB.ymin + frameB.height) - ymin;
    let score = Math.max(frameA.score, frameB.score);
    if (width > 0 && height > 0)
      return {xmin: xmin, ymin: ymin, width: width, height: height, score: score, label: frameA.label}
    else
      return null;
}

function area(frame) {
    return frame.width * frame.height;
}

function avg(frameA, frameB) {
    if (frameA.label != frameB.label) return null;
    let xmin = (frameA.xmin + frameB.xmin) / 2;
    let ymin = (frameA.ymin + frameB.ymin) / 2;
    let width = (frameA.width + frameB.width) / 2;
    let height = (frameA.height + frameB.height) / 2;
    let score = Math.max(frameA.score, frameB.score);
    return {xmin: xmin, ymin: ymin, width: width, height: height, score: score, label: frameA.label}
}

function mergeTwo(frameA, frameB) {
    if (frameA.label != frameB.label) return null;
    let frameC = intersect(frameA, frameB);
    if (frameC == null)
      return null;
    let areaA = area(frameA);
    let areaB = area(frameB);
    let areaC = area(frameC);
    console.log(`areaA=${areaA} (${areaA * common_area_percentage})`);
    console.log(`areaB=${areaB} (${areaB * common_area_percentage})`);
    console.log(`areaC=${areaC}`);
    if ((areaC >= areaA * common_area_percentage) || (areaC >= areaB * common_area_percentage)) {
      console.log('merged these two');
      return avg(frameA, frameB);
    } else {
      return null;
    }
}

function framesToMap(frames) {
    return frames.reduce((map, frame, index) => {
      let ff = map[frame.label];
      if (!ff) {
        map[frame.label] = []
      }
      map[frame.label].push(frame);
      return map;
    }, {});
}

function mergeSameLabel(frames) {
//     let removed = [];
    console.log(`\nmergeSameLabel(${toString(frames)})`);
    if (!frames || frames.length < 2) return frames;
    let i;
    for (i = 0; i < frames.length; i++) {
//       let frame = frames[i];
      console.log(`i=${i} frames[${i}]=${JSON.stringify(frames[i])}`);
      let k;
      let merged = false;
      for (k = i + 1; k < frames.length; k++) {
        console.log(`k=${k} frames[${k}]=${JSON.stringify(frames[k])}`);
        let frameM = mergeTwo(frames[i], frames[k]);
        if (frameM) {
          console.log(`merged==frames[${i}]=${JSON.stringify(frameM)}`);
//           removed.push(frames[i]);
          frames[i] = frameM;
          let rm = frames.splice(k, 1);
          console.log(`frames[${k}] deleted. frames: ${toString(frames)}`);
          k--;
//           removed.push(rm[0]);
          merged = true;
        }
      }
      if (merged) i--;
    }
    return frames;
}

function merge(frames) {
    let map = framesToMap(frames);
    let result = [];
    for (var label in map) {
      if (map.hasOwnProperty(label)) {
          let ff = map[label];
          ff = mergeSameLabel(ff);
          result = result.concat(ff);
      }
    }
    return result;
}

function process(frames) {
    console.log('\n>> frames received | ' + toString(frames));
  
    frames = filterByScore(frames);
    console.log('\n>> filtered | ' + toString(frames));
  
    frames = merge(frames);
    console.log('\n>> merged | ' + toString(frames));

//     frames = sortByScore(frames)
//     console.log('\n>> sorted | ' + toString(frames));
    
    frames = addId(frames);
    console.log('\n>> with id | ' + toString(frames));
    
    return frames;
}

export {process as default, intersect as intersect, framesToMap as framesToMap, mergeSameLabel as mergeSameLabel}