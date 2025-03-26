'use client'
import BouldersCom from "@/components/BouldersCom";
import HandRecognizer from "@/components/HandRecognizer";
import RocketComponets from "@/components/RocketComponets";
import { useEffect, useRef, useState } from "react";

let generationInterval: any;
let removerInterval: any;

export default function Home() {
  const [rocketLeft, setRocketLeft] = useState(0);
  const [isDetected, setIsDetected] = useState(false);
  const [degrees, setDegrees] = useState(0);
  const [boulders, setBulders] = useState<any[]>([]);

  const [rocket, setRocket] = useState<any>();
  const rocketRef = useRef(null);

  useEffect(() => {
    setRocketLeft(window.innerWidth / 2)
  }, [])

  useEffect(() => {
    if (isDetected) {

      generationInterval = setInterval(() => {
        setBulders(prevArr => {
          let retArr = [...prevArr];
          for (let i = 0; i < 4; i++) {
            const now = Date.now();
            retArr = [...retArr, {
              timeStamp: now,
              key: `${now} - ${Math.random()}`
            }]
          }
          return retArr
        })
      }, 1000);

      removerInterval = setInterval(() => {
        const now = Date.now();
        setBulders(prevArr => {
          return prevArr.filter((b, idx) => {
            return (now - b.timeStamp) < 5000
          })
        })
      }, 5000)
    }

    return () => {
      clearInterval(generationInterval);
      removerInterval(removerInterval);
    }
  }, [isDetected])


  const setHandResults = (result: any) => {

    setIsDetected(result.isDetected);
    setDegrees(result.degrees);

    // if (result.degrees && result.degrees !== 0)
    if (typeof result.degrees === "number" && result.degrees !== 0) {
      setRocketLeft(prev => {
        const ret = prev - result.degrees / 6;

        if (ret < 20) {
          return prev;
        }

        if (ret > window.innerWidth - 52) {
          return prev;
        }

        return ret;
      })
    }
    setRocket(((rocketRef.current as any).getBoundingClientReact()));
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 ">
      <div className="absolute left-3 top-3 z-30 w-24">
        <HandRecognizer setHandResults={setHandResults} />
      </div>
      <div
        ref={rocketRef}
        id='rocket-container'
        style={{
          position: 'absolute',
          left: rocketLeft,
          transition: 'all',
          animationDuration: '10ms',
          marginTop: '350px'
        }}>
        <RocketComponets degrees={degrees} />
      </div>

      <div className="absolute z-10 h-screen w-screen overflow-hidden">
        {boulders.map((b, index) => {
          return <BouldersCom key={b.key} isMooving={isDetected} />
        })}
      </div>
    </main>
  );
}
