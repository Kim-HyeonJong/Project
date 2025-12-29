import { useNavigate } from "react-router-dom"

export const useAuthGuard = () => {
    const navigate = useNavigate()

    const requireLogin = (action?: () => void) => {
        const token = localStorage.getItem("token")

        if (!token) {
            alert("로그인이 필요한 기능입니다")
            navigate("/login")
            return
        }

        if (action) action()
    }

    return { requireLogin }
}
