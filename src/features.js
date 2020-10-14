export function createDownload(name, player, data) {
    //	Phone
    // let name = this.name + '-' + this.player + '.mp3';
    // let dtask = plus.downloader.createDownload(this.urls, {
    //   method: 'post',
    //   filename: `_downloads/${this.name}`,
    //   retry: 3
    // }, function(d, status){
    //   if(status === 200){
    //     alert("下载成功: " + d.filename);
    //     // _this.showPluginAuto();
    //     plus.runtime.openFile(d.filename);
    //   } else {
    //     alert("下载失败: " + status);
    //   }
    // });
    // //dtask.addEventListener("statechanged", onStateChanged, false);
    // dtask.start();

    //	PC
    let blob = new Blob([data], { type: "audio/mpeg;charset=utf-8" });
    let downloadElement = document.createElement("a");
    let href = window.URL.createObjectURL(blob);
    downloadElement.href = href;
    downloadElement.download = name + "-" + player + ".mp3";
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(href);
}

export function parseLyric(data) {
    let lrc = data.lrc.lyric;
    let tlrc = data.tlyric.lyric;
    let lyrics = lrc.split("\n");
    let tlyrics = tlrc ? tlrc.split("\n") : [];

    let lrcObj = [];
    let lrcMap = new Map();
    let tlrcMap = new Map();
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

    for (let i = 0; i < tlyrics.length; i++) {
        let tlyric = decodeURIComponent(tlyrics[i]);
        let timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        let timeRegExpArr1 = tlyric.match(timeReg);
        if (!timeRegExpArr1) continue;
        let clause1 = tlyric.replace(timeReg, "");

        for (let k = 0, h = timeRegExpArr1.length; k < h; k++) {
            let t = timeRegExpArr1[k];
            let min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*/i)).slice(1));
            let time = min * 60 + sec;
            if (clause1) {
                tlrcMap.set(time, clause1);
            }
        }
    }

    return [lrcObj, lrcMap, tlrcMap, lrcTime];
}

export function parseLyricByQq(data) {
    let { lyric: lyrics } = data;
    let { translate: tlyrics } = data;

    let lrcObj = [];
    let lrcMap = new Map();
    let tlrcMap = new Map();
    let lrcTime = new Map();
    for (let i = 0; i < lyrics.length; i++) {
        let lyric = decodeURIComponent(lyrics[i][1]);
        let t = lyrics[i][0];
        let min = Number(String(t.match(/\d*/i)).slice(0)),
            sec = Number(String(t.match(/\:\d*/i)).slice(1));
        let time = min * 60 + sec;
        if (lyric) {
            lrcTime.set(time, i);
            lrcMap.set(time, lyric);
            lrcObj.push({ time: time, text: lyric });
        }
    }

    for (let i = 0; i < tlyrics.length; i++) {
        let tlyric = decodeURIComponent(tlyrics[i][1]);
        let t = lyrics[i][0];
        let min = Number(String(t.match(/\d*/i)).slice(0)),
            sec = Number(String(t.match(/\:\d*/i)).slice(1));
        let time = min * 60 + sec;
        if (tlyric && tlyric !== "//") {
            tlrcMap.set(time, tlyric);
        }
    }

    return [lrcObj, lrcMap, tlrcMap, lrcTime];
}

export function onLoadAudio(audio) {
    let context = new(window.AudioContext || window.webkitAudioContext)();
    let analyser = context.createAnalyser();
    analyser.fftSize = 512;

    let source = context.createMediaElementSource(document.getElementById("audio"));

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