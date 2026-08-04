import { FaCheck, FaTimes } from 'react-icons/fa'

const Colors = {
    red: "bg-red-200 text-red-800",
    green: "bg-green-200 text-green-800",
} as const
  
const Icons = {
    check: <FaCheck className="text-green-500"/>,
    fail: <FaTimes className="text-red-500"/>
} as const

interface BannerProps {
    value: string
    color: string
    icon?: React.ReactNode
}

interface ColoredBannerProps {
    value: string
}

const Banner = (props: BannerProps) => {
    return (
        <div className={`${props.color} w-full h-8 flex flex-start gap-x-1 items-center px-2 rounded-xs font-semibold`}>
            {props.icon}
            {props.value}
        </div>
    )
}

const ErrorBanner = (props: ColoredBannerProps) => {
    return (
        <Banner
            value={props.value}
            color={Colors.red}
            icon={Icons.fail}
        />
    )
}

const SuccessBanner = (props: ColoredBannerProps) => {
    return (
        <Banner
            value={props.value}
            color={Colors.green}
            icon={Icons.check}
        />
    )
}

export { Banner, ErrorBanner, SuccessBanner }