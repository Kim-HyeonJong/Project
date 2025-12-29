import { Navigate, Outlet } from 'react-router-dom'


export default function SellerRoute() {
    const role = localStorage.getItem('role')
    return role === 'ROLE_SELLER' ? <Outlet /> : <Navigate to="/" />
}