const audioContext = new AudioContext()

const renderWaveform = (audioBuffer, width = 600, height = 100) => {
    const channelDataLeft = [...audioBuffer.getChannelData(0)]
    const blockSize = Math.floor(audioBuffer.length / width)
    const range = size => [...new Array(size).keys()]
    const filtered = range(100).map((i) => {
        const start = i * blockSize
        const block = channelDataLeft.slice(start, start + blockSize)
        const blockSum = block.reduce((acc, cur) => acc + cur)
        const blockAvg = blockSum / blockSize
        return blockAvg
    })
    const max = Math.max(...filtered.map(x => Math.abs(x)))
    const normalized = filtered.map(x => x * Math.pow(max, -1))
    const points = normalized.map((val, index) => {
        return `${index}, ${val * (height / 2) + (height / 2)}`
    }).join(' ')

    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg")

    const polyline = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline")

    svg.setAttribute('width', width)
    svg.setAttribute('height', height)

    polyline.setAttribute('points', points)
    polyline.setAttribute('stroke', 'purple')
    polyline.setAttribute('fill', 'none')

    svg.appendChild(polyline)
    document.body.appendChild(svg)
}

fetch('audio.m4a')
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => renderWaveform(audioBuffer, 800, 300))