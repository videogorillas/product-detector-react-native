
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

export default process