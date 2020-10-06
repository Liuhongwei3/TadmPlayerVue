export function parseLyric(lrc) {
    let lyrics = lrc.split("\n");
    let lrcObj = [];
    let lrcMap = new Map();
    let lrcTime = new Map();
    let j = 0;
    for (let i = 0; i < lyrics.length; i++) {
        let lyric = decodeURIComponent(lyrics[i]);
        let timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        let timeRegExpArr = lyric.match(timeReg);
        if (!timeRegExpArr) continue;
        let clause = lyric.replace(timeReg, "");
        for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
            let t = timeRegExpArr[k];
            let min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*/i)).slice(1));
            let time = min * 60 + sec;
            if (clause) {
                lrcTime.set(time, j++);
                lrcMap.set(time, clause);
                lrcObj.push({ time: time, text: clause });
            }
        }
    }

    return [lrcObj, lrcMap, lrcTime];
}

export function onLoadAudio(audio, MEDIA_ELEMENT_NODES) {
    let context = new(window.AudioContext || window.webkitAudioContext)();
    let analyser = context.createAnalyser();
    analyser.fftSize = 512;

    // let source;
    // if (MEDIA_ELEMENT_NODES.has(audio)) {
    //     source = MEDIA_ELEMENT_NODES.get(audio);
    // } else {
    //     source = context.createMediaElementSource(audio);
    //     MEDIA_ELEMENT_NODES.set(audio, source);
    // }
    let source = context.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(context.destination);

    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    let canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let ctx = canvas.getContext("2d");
    let WIDTH = canvas.width;
    let HEIGHT = canvas.height;

    let barWidth = (WIDTH / bufferLength) * 1.5;
    let barHeight;

    function renderFrame() {
        requestAnimationFrame(renderFrame);

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0, x = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            let r = barHeight + 25 * (i / bufferLength);
            // let r = Math.round(Math.random()*255);

            let g = 250 * (i / bufferLength);
            // let g = Math.round(Math.random()*255);

            let b = 50;
            // let b = Math.round(Math.random()*255);

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            // ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
            ctx.arc(x, HEIGHT, 50, 2 * Math.PI, false);

            x += barWidth + 2;
        }
    }

    renderFrame();
    // setInterval(renderFrame, 44);
}