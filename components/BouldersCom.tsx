import { useEffect, useState } from "react"
import Image from "next/image";

interface MoovingProps {
    isMooving?: boolean
}

const BouldersCom = ({ isMooving }: MoovingProps) => {
    const [xState, setXState] = useState(0);
    const [yState, setYState] = useState(0);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        setXState(Math.random() * (window.innerWidth - 80));
        setYState(- Math.random() * 100 - 100)
        setRotation(Math.random() * 360)
    }, [])
    return (
        <section
            className="boulder-shodow"
            style={{
                position: 'absolute',
                left: xState,
                top: yState,
                animation: 'moveDown 10s linear forwards',
                animationPlayState: isMooving ? 'running' : 'paused'
            }}>
            <Image src={'/stones.webp'} width={80} height={80} alt="" style={{
                rotate: `${rotation}deg`
            }} />
        </section>
    )
}

export default BouldersCom