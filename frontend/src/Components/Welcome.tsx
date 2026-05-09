import { useAuth } from '../auth/AuthContext'


const Welcome = () => {
    const { logout } = useAuth()
    return(
        <>
            <h1>Welcome to the Resume Builder!!</h1>
            <button onClick={() => void logout()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500 w-30">Logout</button>
        </>
    )
}

export { Welcome }