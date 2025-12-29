import {useEffect, useState} from "react";
import axios from "axios";
import type {PhotoCard} from "../../types/photocard";
import {Button, Table, Badge, Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export default function SellerPhotocardManage() {
    const [cards, setCards] = useState<PhotoCard[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const resp = await axios.get(
                "http://localhost:8080/api/photocard/showAllBySeller",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            setCards(resp.data.data);
        } catch (e) {
            console.error(e);
            alert("등록된 포토카드를 불러오지 못했습니다.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axios.patch(
                `http://localhost:8080/api/photocard/${id}/delete`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            setCards(prev => prev.filter(card => card.id !== id));

        } catch (e) {
            console.error(e);
            alert("삭제 실패");
        }
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>내 포토카드 관리</h2>

                <Button
                    variant="dark"
                    onClick={() => navigate("/seller/photocard/new")}
                >
                    + 포토카드 등록
                </Button>
            </div>

            {cards.length === 0 ? (
                <p>등록된 포토카드가 없습니다.</p>
            ) : (
                <Table bordered hover responsive>
                    <thead>
                    <tr>
                        <th>이름</th>
                        <th>가격</th>
                        <th>재고</th>
                        <th>상태</th>
                        <th>한정</th>
                        <th>조회수</th>
                        <th>등록일</th>
                        <th>관리</th>
                    </tr>
                    </thead>

                    <tbody>
                    {cards.map(card => (
                        <tr key={card.id}>
                            <td>{card.name}</td>
                            <td>{card.salePrice.toLocaleString()}원</td>
                            <td>
                                {card.stock === 0
                                    ? <Badge bg="danger">품절</Badge>
                                    : card.stock}
                            </td>
                            <td>
                                <Badge bg={
                                    card.status === "판매중" ? "success" :
                                        card.status === "품절" ? "secondary" : "warning"
                                }>
                                    {card.status}
                                </Badge>
                            </td>
                            <td>
                                {card.limitedFlag === "Y"
                                    ? <Badge bg="warning">한정</Badge>
                                    : "-"}
                            </td>
                            <td>{card.viewCount}</td>
                            <td>{new Date(card.createdAt).toLocaleDateString()}</td>
                            <td>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => navigate(`/seller/photocard/edit/${card.id}`)}
                                >
                                    수정
                                </Button>

                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(card.id)}
                                >
                                    삭제
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </Container>
    )
}
