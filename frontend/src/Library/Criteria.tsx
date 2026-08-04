import { FaCheck, FaTimes } from 'react-icons/fa'

interface CriteriaProps {
    condition: boolean
    value: string
}

const Criteria = (props: CriteriaProps) => {
    return (
        <div className="flex flex-start gap-x-1 items-center">
            { 
                props.condition ? 
                <FaCheck className="text-blue-300"/> : 
                <FaTimes className="text-red-500"/>
            }
            <p className={`text-xs my-0.5 ${props.condition ? "text-blue-300" : "text-red-500"}`}>
                {props.value}
            </p>
        </div>
    )
}

export { Criteria }