import { useQuery } from "@tanstack/react-query"
import { createContext, PropsWithChildren, useContext, useEffect } from "react"
import api from "../api/api"
import Loader from "../components/Loader/Loader"
import { AuthenticationContext } from "./Authentication"
import { useNavigate } from "react-router-dom"


export const UserDetailContext = createContext({

})

export default function UserDetail({ children }: PropsWithChildren) {

    const { logout } = useContext(AuthenticationContext)
    const navigate = useNavigate()

    const { data: userInfo, isLoading, isError } = useQuery({
        queryKey: ['userInformation'],
        queryFn: async () => {
            const res = await api.get('user')
            if (res.status !== 200) logout()
            return res.data
        }
    })


    if (isLoading) return (
        <Loader />
    )

    console.log(userInfo)

    return (
        <UserDetailContext.Provider value={userInfo}>
            {children}
        </UserDetailContext.Provider>
    )
}