import { Link, useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // USER | SELLER | ADMIN
    const nickname = localStorage.getItem("nickname"); // 있으면 표시

    const onLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <header style={styles.header}>
            <div style={styles.container}>
                {/* Left - Logo */}
                <Link to="/" style={styles.logo}>
                    MoPo
                </Link>

                {/* Right - Menu */}
                <nav style={styles.nav}>
                    {/*  항상 보임 */}
                    <Link to="/notices" style={styles.link}>
                        공지사항
                    </Link>

                    {/*  로그인 안 된 상태 */}
                    {!token && (
                        <>
                            <Link to="/login" style={styles.link}>
                                Login
                            </Link>
                            <Link to="/signup" style={styles.link}>
                                Sign Up
                            </Link>
                        </>
                    )}

                    {/*  USER */}
                    {token && role === "ROLE_USER" && (
                        <>
                            <Link to="/mypage" style={styles.link}>
                                MyPage
                            </Link>

                            <Link to="/cart" style={styles.link}>
                                Cart
                            </Link>

                            <span style={styles.nickname}>{nickname}님</span>

                            <button onClick={onLogout} style={styles.btn}>
                                Logout
                            </button>
                        </>
                    )}

                    {/*  SELLER */}
                    {token && role === "ROLE_SELLER" && (
                        <>
                            <Link to="/seller/orders" style={styles.link}>
                                Orders
                            </Link>

                            <Link to="/seller/photocards" style={styles.link}>
                                My Cards
                            </Link>

                            <span style={styles.nickname}>Seller</span>

                            <button onClick={onLogout} style={styles.btn}>
                                Logout
                            </button>
                        </>
                    )}

                    {/*  ADMIN */}
                    {token && role === "ROLE_ADMIN" && (
                        <>
                            <Link to="/admin/photocards" style={styles.link}>
                                포토카드 관리
                            </Link>

                            <Link to="/admin/members" style={styles.link}>
                                회원 관리
                            </Link>

                            <span style={styles.nickname}>Admin</span>

                            <button onClick={onLogout} style={styles.btn}>
                                Logout
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    header: {
        height: "60px",
        background: "#fff",
        borderBottom: "1px solid #dee2e6",
        display: "flex",
        alignItems: "center",
    },

    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        padding: "0 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    logo: {
        fontSize: "1.3rem",
        fontWeight: "bold",
        textDecoration: "none",
        color: "#0d6efd",
    },

    nav: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
    },

    link: {
        textDecoration: "none",
        color: "#212529",
        fontSize: "0.95rem",
    },

    btn: {
        background: "#dc3545",
        color: "white",
        border: "none",
        padding: "0.4rem 0.8rem",
        borderRadius: "5px",
        cursor: "pointer",
    },

    nickname: {
        fontSize: "0.85rem",
        color: "#6c757d",
        marginRight: "0.5rem",
    },
};
