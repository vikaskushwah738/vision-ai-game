import { RocketIcon } from "lucide-react"
interface DegreesProps {
    degrees: number;
}

const RocketComponets = ({ degrees }: DegreesProps) => {
    return (
        <section className="rocket-shodow">
            <RocketIcon className="fill-red-600" size={32} style={{
                transform: `rotate(${-45 - degrees / 3}deg)`,
                transition: 'all',
                animationDirection: "10ms"
            }} />
        </section>
    )
}

export default RocketComponets