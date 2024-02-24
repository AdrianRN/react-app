import React from 'react'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoutes = () => {
    const [isAuthenticated] = React.useState<string | undefined>(localStorage.getItem('userEmail') ?? undefined)

    if (!isAuthenticated) {
        return <Navigate to="/" />
    }

    return (
        <>
            <Outlet />
        </>
    )
}

export default ProtectedRoutes