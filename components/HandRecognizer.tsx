
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { useEffect, useRef } from "react";

interface HandResultsProps {
    setHandResults: (result: any) => void;
}

let detectionInterval: any;

const HandRecognizer = ({ setHandResults }: HandResultsProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {

        initVideoAndModle();

        return () => {
            clearInterval(detectionInterval);
        }
    }, [])

    const initVideoAndModle = async () => {
        setHandResults({ isLoading: true })
        const vedioElemet = videoRef.current;
        if (!vedioElemet) {
            return;
        }

        await initVideo(vedioElemet);

        const handLandMarker = await initModel();

        detectionInterval = setInterval(() => {
            const detections = handLandMarker.detectForVideo(vedioElemet, Date.now());
            processDetections(detections, setHandResults)
        }, 1000 / 30)

        setHandResults({ isLoading: false })
    }

    return (
        <section >
            <video className=" border-2 border-stone-800" ref={videoRef}></video>
        </section>
    )
}

export default HandRecognizer

async function initVideo(vedioElemet: HTMLVideoElement) {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });

    vedioElemet.srcObject = stream;
    vedioElemet.addEventListener("loadeddata", () => {
        vedioElemet.play();
    })
}

async function initModel() {
    const wasm = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");

    const handLandmarker = await HandLandmarker.createFromOptions(wasm, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
        },
        numHands: 2,
        runningMode: 'VIDEO'
    });

    return handLandmarker
}


function processDetections(detections: HandLandmarkerResult, setHandResults: (result: any) => void) {
    console.log(detections);
    if (detections && detections.handedness.length > 1) {
        const rightIndex = detections.handedness[0][0].categoryName === "Right" ? 0 : 1;
        const leftIndex = rightIndex === 0 ? 1 : 0;

        const { x: leftX, y: leftY, z: leftZ } = detections.landmarks[leftIndex][6];
        const { x: rightX, y: rightY, z: rightZ } = detections.landmarks[rightIndex][6];

        const tilt = (rightY - leftY) / (rightX - leftX)

        const degrees = (Math.atan(tilt) * 180) / Math.PI;

        setHandResults({
            isDetected: true,
            tilt,
            degrees,
        })
    } else {
        setHandResults({
            isDetected: false,
            tilt: 0,
            degrees: 0
        })
    }
}

