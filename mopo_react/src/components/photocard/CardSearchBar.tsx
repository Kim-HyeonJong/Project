interface Props {
    searchType: string;
    setSearchType: (v: string) => void;
    keyword: string;
    setKeyword: (v: string) => void;
    sort: string;
    setSort: (v: string) => void;
    dir: string;
    setDir: (v: string) => void;
    onSearch: () => void;
}

export default function CardSearchBar({
                                          searchType,
                                          setSearchType,
                                          keyword,
                                          setKeyword,
                                          sort,
                                          setSort,
                                          dir,
                                          setDir,
                                          onSearch,
                                      }: Props) {
    return (
        <div style={styles.bar}>
            {/* 검색 */}
            <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
            >
                <option value="name">포토카드 이름</option>
                <option value="artist_name">아티스트 이름</option>
                <option value="artist_type">아티스트 타입</option>
            </select>

            <input
                placeholder="검색어 입력"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            <button onClick={onSearch}>Search</button>

            {/* 정렬 */}
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="id">ID</option>
                <option value="name">이름</option>
                <option value="sale_price">가격</option>
                <option value="view_count">조회수</option>
            </select>

            <button onClick={() => setDir(dir === "asc" ? "desc" : "asc")}>
                {dir === "asc" ? "⬆ ASC" : "⬇ DESC"}
            </button>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    bar: {
        display: "flex",
        gap: "0.5rem",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
    },
};
