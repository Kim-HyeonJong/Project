import {useNavigate} from "react-router-dom";

interface PhotoCardProps {
    card: any;
}

export default function PhotoCard({card}: PhotoCardProps) {
    const navigate = useNavigate();

    return (
        <div style={styles.card}>
            {/* 이미지 (임시) */}
            <div style={styles.imageBox}>
                {card.imageUrl ? (
                    <img
                        src={`http://localhost:8080${card.imageUrl}`}
                        alt="포토카드 이미지"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                    />
                ) : (
                    <span style={{color: "#777"}}>Photo</span>
                )}
            </div>

            <h3>{card.artistName}</h3>
            <h4>{card.name}</h4>

            <p style={styles.price}>₩ {card.salePrice?.toLocaleString()}</p>

            <p style={styles.subInfo}>👁 {card.viewCount}</p>
            <p style={styles.subInfo}>📦 Stock : {card.stock}</p>

            <div style={styles.btnBox}>
                <button
                    style={styles.detailBtn}
                    onClick={() => navigate(`/card/${card.id}`)}
                >
                    상세보기
                </button>

            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    card: {
        padding: "1rem",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 6px 12px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
    },

    imageBox: {
        width: "100%",
        height: "180px",
        background: "#e9ecef",
        borderRadius: "8px",
        marginBottom: "0.5rem",
    },

    price: {
        fontWeight: "bold",
        color: "#0d6efd",
    },

    subInfo: {
        fontSize: "0.85rem",
        color: "#6c757d",
    },

    btnBox: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "0.5rem",
    },

    detailBtn: {
        background: "#0d6efd",
        color: "#fff",
        border: "none",
        padding: "0.4rem 0.6rem",
        borderRadius: "5px",
        cursor: "pointer",
    },

    cartBtn: {
        background: "#198754",
        color: "#fff",
        border: "none",
        padding: "0.4rem 0.6rem",
        borderRadius: "5px",
        cursor: "pointer",
    },
};
