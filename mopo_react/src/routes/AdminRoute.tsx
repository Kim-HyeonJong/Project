import { Navigate, Outlet } from 'react-router-dom'


export default function AdminRoute() {
    const role = localStorage.getItem('role')
    return role === 'ROLE_ADMIN' ? <Outlet /> : <Navigate to="/" />
}