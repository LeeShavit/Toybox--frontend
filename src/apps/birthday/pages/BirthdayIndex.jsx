import { useEffect, useRef, useState } from "react";
import { makeId } from "../../../services/util.service";



export function BirthdayIndex() {

    const [candles, setCandles] = useState([])
    const [candlesLit, setCandlesLit] = useState(true)
    const [cake, setCake] = useState(null)
    const cakeRef = useRef(null)
    const [isListening, setIsListening] = useState(false)
    const audioContext = useRef(null)
    const analyzer = useRef(null)
    const mediaStream = useRef(null)

    useEffect(() => {
        getCakePos()
        window.addEventListener('resize', getCakePos)
        return () => {
            window.removeEventListener('resize', getCakePos)
            stopAudio()
        }
    }, [])

    useEffect(() => {
        if (isListening && analyzer.current) {
            detectBlow()
        }
    }, [isListening])


    function getCakePos() {
        if (!cakeRef.current) return

        const imgRect = cakeRef.current.getBoundingClientRect()
        const cakeOffsetX = (0.040 * imgRect.width)
        const cake = {
            x: {
                start: imgRect.left + cakeOffsetX,
                end: imgRect.right - cakeOffsetX,
            },
            y: {
                start: imgRect.top + (0.0328 * imgRect.height) + 100,
                end: imgRect.bottom - (0.32 * imgRect.height),
            }
        }
        setCake(cake)
    }

    function onClickedOnPage({ clientX, clientY }) {
        const pos = { x: clientX, y: clientY }
        if (isCakeClicked(pos)) addCandle(pos)
    }

    function isCakeClicked(pos) {
        const relativeX = (pos.x - cake.x.start) / (cake.x.end - cake.x.start)
        const curveHeight = 0.2

        const curveAdjustment = curveHeight * Math.abs(0.5 - relativeX) * 2


        const adjustedYStart = cake.y.start + ((cake.y.end - cake.y.start) * curveAdjustment)
        const adjustedYEnd = cake.y.end - ((cake.y.end - cake.y.start) * curveAdjustment)

        return (
            pos.x > cake.x.start &&
            pos.x < cake.x.end &&
            pos.y > adjustedYStart &&
            pos.y < adjustedYEnd)
    }

    function addCandle(pos) {
        const candle = { id: makeId(), pos }
        setCandles(prevCandles => [...prevCandles, candle])
    }

    function onBlowCandles() {
        toggleMicrophone()
    }
    function blowCandles() {
        setCandlesLit(false)
    }

    async function initAudio() {
        try {
            console.log('Initializing audio...');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStream.current = stream;
    
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext.current = new AudioContext();
            
            const source = audioContext.current.createMediaStreamSource(stream);
            analyzer.current = audioContext.current.createAnalyser();
    
            analyzer.current.fftSize = 2048;
            source.connect(analyzer.current);
    
            setIsListening(true);
            console.log('Audio initialized');
            // Remove the detectBlow call from here since useEffect will handle it
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setIsListening(false);
        }
    }
    
    function detectBlow() {
        if (!analyzer.current) {
            console.log('No analyzer found')
            return;
        }
    
        const bufferLength = analyzer.current.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        let blowCounter = 0  // Count consecutive frames of blow-like sound
    
        function checkAudio() {
            if (!isListening || !analyzer.current) return
    
            analyzer.current.getByteFrequencyData(dataArray)
    
            const lowFreq = dataArray.slice(2, 6)  // Very low frequencies (~40-100 Hz)
            const highFreq = dataArray.slice(20, 30)  // Higher frequencies (~400-600 Hz)
    
            const lowAvg = lowFreq.reduce((a, b) => a + b) / lowFreq.length
            const highAvg = highFreq.reduce((a, b) => a + b) / highFreq.length
    
            // Blow characteristics:
            // 1. Strong low frequencies
            // 2. Relatively weak high frequencies
            // 3. Sustained for a few frames
            const isBlowFrame = lowAvg > 160 && highAvg < 100
    
            if (isBlowFrame) {
                blowCounter++
                console.log('Potential blow detected', { lowAvg, highAvg, counter: blowCounter })
                
                // Need 3 consecutive frames of blow detection to trigger
                if (blowCounter >= 3) {
                    console.log('Blow confirmed!')
                    blowOutCandles()
                    blowCounter = 0
                }
            } else {
                blowCounter = Math.max(0, blowCounter - 1)
            }
    
            if (isListening) {
                requestAnimationFrame(checkAudio)
            }
        }
    
        checkAudio()
    }

    function blowOutCandles() {
        blowCandles()
    }

    async function toggleMicrophone() {
        if (isListening) {
            stopAudio()
        } else {
            await initAudio()
        }
    }

    function stopAudio() {
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop())
            if (audioContext.current) {
                audioContext.current.close()
                audioContext.current = null
            }
            analyzer.current = null
            setIsListening(false)
        }
    }

    function resetCake(){
        setCandles([])
        stopAudio()
        setCandlesLit(true)
    }

    return (
        <div className={`birthday ${candlesLit ? '' : 'off'}`} onClick={onClickedOnPage}>
            <h1>Happy Birthay Michali! you are {candles.length} years old!</h1>
            <img className="cake" ref={cakeRef} src="../src/assets/img/cake.png"></img>
            {candles.map(candle =>
                <div key={candle.id} className='holder' style={{ left: candle.pos.x + 'px', top: candle.pos.y + 'px', zIndex: candle.pos.y }}>
                    <div className="candle">
                        <div className="blinking-glow"></div>
                        <div className="thread"></div>
                        <div className="glow"></div>
                        <div className="flame"></div>
                    </div>
                </div>)}
            {(candles.length === 2) && <button className="blow" onClick={onBlowCandles}>Blow!!!</button>}
            <button className="clear" onClick={resetCake}>Clear candles</button>
        </div>
    )
}