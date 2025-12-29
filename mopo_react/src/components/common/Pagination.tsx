interface Props {
    currentPage: number;
    startPage: number;
    endPage: number;
    totalPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
                                       currentPage,
                                       startPage,
                                       endPage,
                                       totalPage,
                                       onPageChange,
                                   }: Props) {
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div style={styles.wrap}>
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                ◀
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    style={{
                        ...styles.pageBtn,
                        background: currentPage === p ? "#0d6efd" : "#fff",
                        color: currentPage === p ? "#fff" : "#212529",
                    }}
                    onClick={() => onPageChange(p)}
                >
                    {p}
                </button>
            ))}

            <button
                disabled={currentPage === totalPage}
                onClick={() => onPageChange(currentPage + 1)}
            >
                ▶
            </button>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    wrap: {
        display: "flex",
        justifyContent: "center",
        gap: "0.4rem",
        marginTop: "2rem",
    },

    pageBtn: {
        padding: "0.3rem 0.6rem",
        border: "1px solid #dee2e6",
        borderRadius: "4px",
        cursor: "pointer",
    },
};
