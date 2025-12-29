import {useEffect, useState} from "react";
import axios from "axios";
import PhotoCard from "../../components/photocard/Photocard";
import CardSearchBar from "../../components/photocard/CardSearchBar";
import Pagination from "../../components/common/Pagination";

export default function CardList() {
    const [cards, setCards] = useState<any[]>([]);
    const [page, setPage] = useState(1);

    const [sort, setSort] = useState("id");
    const [dir, setDir] = useState("desc");
    const [searchType, setSearchType] = useState("name");
    const [keyword, setKeyword] = useState("");

    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        startPage: 1,
        endPage: 1,
        totalPage: 1,
    });


    useEffect(() => {
        fetchCards(page);
    }, [page, sort, dir]);

    const fetchCards = async (pageNo: number) => {
        const token = localStorage.getItem("token");
        try {
            const resp = await axios.get(
                `http://localhost:8080/api/photocard/showAll/${pageNo}`,
                {
                    params: {
                        sort,
                        dir,
                        searchType: keyword ? searchType : "",
                        searchKeyword: keyword,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = resp.data;

            setCards(data.items);
            setPageInfo({
                currentPage: data.currentPage,
                startPage: data.startPage,
                endPage: data.endPage,
                totalPage: data.totalPage,
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchCards(1);
    };

    return (
        <div>
            <CardSearchBar
                searchType={searchType}
                setSearchType={setSearchType}
                keyword={keyword}
                setKeyword={setKeyword}
                sort={sort}
                setSort={setSort}
                dir={dir}
                setDir={setDir}
                onSearch={handleSearch}
            />

            {/* 카드 영역 */}
            <div style={styles.grid}>
                {cards.map((card) => (
                    <PhotoCard key={card.id} card={card}/>
                ))}
            </div>

            {/* 페이지네이션 */}
            <Pagination
                currentPage={pageInfo.currentPage}
                startPage={pageInfo.startPage}
                endPage={pageInfo.endPage}
                totalPage={pageInfo.totalPage}
                onPageChange={setPage}
            />
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "1.5rem",
    },
};
