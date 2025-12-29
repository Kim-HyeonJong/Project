import { Button, Table } from "react-bootstrap";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const AdminPhotocardListPage = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [startPage, setStartPage] = useState<number>(1);
    const [endPage, setEndPage] = useState<number>(1);

    const fetchPhotocards = async (pageNo: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("관리자 로그인이 필요합니다.");
                navigate("/");
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };


            const resp = await axios.get(
                `http://localhost:8080/api/photocard/showAll/${pageNo}`,
                config
                // ============================================================================
            );

            const data = resp.data; // PhotocardResponse

            setItems(data.items ?? []);
            setCurrentPage(data.currentPage ?? pageNo);
            setTotalPage(data.totalPage ?? 1);
            setStartPage(data.startPage ?? 1);
            setEndPage(data.endPage ?? 1);
        } catch (e) {
            console.error("포토카드 목록 조회 실패:", e);
            alert("포토카드 목록을 불러오지 못했습니다.");
        }
    };

    useEffect(() => {
        fetchPhotocards(1);
    }, []);

    const changePage = (pageNo: number) => {
        if (pageNo < 1 || pageNo > totalPage) return;
        fetchPhotocards(pageNo);
    };

    const onSoftDelete = async (id: number) => {
        if (!window.confirm("해당 포토카드를 삭제 처리(소프트 삭제) 하시겠습니까?")) return;

        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.patch(
                `http://localhost:8080/api/photocard/${id}/delete`,
                null,
                config
            );

            alert("삭제 처리 완료되었습니다.");
            fetchPhotocards(currentPage);
        } catch (e) {
            console.error("소프트 삭제 실패:", e);
            alert("삭제 처리에 실패했습니다.");
        }
    };

    const onRestore = async (id: number) => {
        if (!window.confirm("해당 포토카드를 복구하시겠습니까?")) return;

        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.patch(
                `http://localhost:8080/api/photocard/${id}/restore`,
                null,
                config
            );

            alert("복구 처리 완료되었습니다.");
            fetchPhotocards(currentPage);
        } catch (e) {
            console.error("복구 실패:", e);
            alert("복구 처리에 실패했습니다.");
        }
    };

    const onHardDelete = async (id: number) => {
        if (!window.confirm("정말로 완전 삭제 하시겠습니까? 되돌릴 수 없습니다.")) return;

        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.delete(
                `http://localhost:8080/api/photocard/${id}`,
                config
            );

            alert("완전 삭제 완료되었습니다.");
            fetchPhotocards(currentPage);
        } catch (e) {
            console.error("하드 삭제 실패:", e);
            alert("완전 삭제에 실패했습니다.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>관리자 - 포토카드 상품 관리</h2>

            <Table striped bordered hover size="sm" className="mt-3">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>아티스트</th>
                    <th>포토카드명</th>
                    <th>판매가</th>
                    <th>재고</th>
                    <th>상태</th>
                    <th>삭제여부</th>
                    <th>관리</th>
                </tr>
                </thead>
                <tbody>
                {items.map((card: any) => (
                    <tr key={card.id}>
                        <td>{card.id}</td>
                        <td>{card.artistName}</td>
                        <td>{card.name}</td>
                        <td>{card.salePrice?.toLocaleString()}원</td>
                        <td>{card.stock}</td>
                        <td>{card.status}</td>
                        <td>{card.deletedFlag}</td>
                        <td className="d-flex gap-1">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => navigate(`/admin/photocard/${card.id}`)}
                            >
                                상세
                            </Button>

                            {card.deletedFlag === "Y" ? (
                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => onRestore(card.id)}
                                >
                                    복구
                                </Button>
                            ) : (
                                <Button
                                    variant="outline-warning"
                                    size="sm"
                                    onClick={() => onSoftDelete(card.id)}
                                >
                                    삭제
                                </Button>
                            )}

                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => onHardDelete(card.id)}
                            >
                                완전삭제
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    이전
                </Button>

                {Array.from(
                    { length: endPage - startPage + 1 },
                    (_, idx) => startPage + idx
                ).map(page => (
                    <Button
                        key={page}
                        variant={page === currentPage ? "primary" : "outline-primary"}
                        size="sm"
                        onClick={() => changePage(page)}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage >= totalPage}
                >
                    다음
                </Button>
            </div>

            {/*<div className="mt-3">
                <Button variant="secondary" onClick={() => navigate("/admin")}>
                    관리자 메인으로
                </Button>
            </div>*/}
        </div>
    );
};

export default AdminPhotocardListPage;