import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, Table} from "react-bootstrap";

const AdminPhotocardDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // URL에서 /admin/photocards/:id 의 id

    const [card, setCard] = useState<any | null>(null);

    const fetchDetail = async () => {
        try {
            if (!id) {
                alert("잘못된 접근입니다.");
                navigate("/admin/photocards");
                return;
            }

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
                `http://localhost:8080/api/photocard/showOne/${id}`,
                config
            );

            setCard(resp.data);
        } catch (e) {
            console.error("포토카드 상세 조회 실패:", e);
            alert("포토카드 상세 정보를 불러오지 못했습니다.");
            navigate("/admin/photocards");
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const onSoftDelete = async () => {
        if (!id) return;
        if (!window.confirm("이 포토카드를 삭제 처리(소프트 삭제) 하시겠습니까?")) return;

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
            fetchDetail();
        } catch (e) {
            console.error("소프트 삭제 실패:", e);
            alert("삭제 처리에 실패했습니다.");
        }
    };

    const onRestore = async () => {
        if (!id) return;
        if (!window.confirm("이 포토카드를 복구하시겠습니까?")) return;

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
            fetchDetail();
        } catch (e) {
            console.error("복구 실패:", e);
            alert("복구 처리에 실패했습니다.");
        }
    };

    const onHardDelete = async () => {
        if (!id) return;
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
            navigate("/admin/photocards");
        } catch (e) {
            console.error("하드 삭제 실패:", e);
            alert("완전 삭제에 실패했습니다.");
        }
    };

    if (!card) {
        return (
            <div className="container mt-4">
                <h2>관리자 - 포토카드 상세</h2>
                <p>로딩 중...</p>
            </div>
        )
    }
    // 비동기 요청 전에 card가 null일 수 있으니까 null 체크는 꼭 필요하다
    // 라고 하는데 솔직히 잘 모르겠네요

    const display = (value: any) => {
        if (value === null || value === undefined || value === ""){
            return "-";
        }
        return value;
    }

    return (
        <div className="container mt-4">
            <h2>관리자 - 포토카드 상세</h2>

            <Card className="mt-3">
                <Card.Body>
                    <h5 className="mb-3">
                        [{card.id}] {card.artistName} - {card.name}
                    </h5>

                    <Table bordered size="sm">
                        <tbody>
                        <tr>
                            <th style={{ width: "200px" }}>ID</th>
                            <td>{display(card.id)}</td>
                        </tr>
                        <tr>
                            <th>아티스트명 (artistName)</th>
                            <td>{display(card.artistName)}</td>
                        </tr>
                        <tr>
                            <th>아티스트 타입 (artistType)</th>
                            <td>{display(card.artistType)}</td>
                        </tr>
                        <tr>
                            <th>판매자 ID (sellerId)</th>
                            <td>{display(card.sellerId)}</td>
                        </tr>
                        <tr>
                            <th>포토카드명 (name)</th>
                            <td>{display(card.name)}</td>
                        </tr>
                        <tr>
                            <th>한정 여부 (limitedFlag)</th>
                            <td>{display(card.limitedFlag)}</td>
                        </tr>
                        <tr>
                            <th>photoType / signType</th>
                            <td>
                                {display(card.photoType)} / {display(card.signType)}
                            </td>
                        </tr>
                        <tr>
                            <th>메시지 여부 (messageFlag)</th>
                            <td>{display(card.messageFlag)}</td>
                        </tr>
                        <tr>
                            <th>effect / coating / sizeType</th>
                            <td>
                                {display(card.effectType)} /
                                {display(card.coatingType)} /
                                {display(card.sizeType)}
                            </td>
                        </tr>
                        <tr>
                            <th>사이즈 (width x height x thickness)</th>
                            <td>
                                {display(card.widthMm)} x {display(card.heightMm)} x {display(card.thicknessMm)} mm
                            </td>
                        </tr>
                        <tr>
                            <th>재질 (material / coatingMaterial)</th>
                            <td>
                                {display(card.material)} / {display(card.coatingMaterial)}
                            </td>
                        </tr>
                        <tr>
                            <th>컨디션 등급 (conditionGrade)</th>
                            <td>{display(card.conditionGrade)}</td>
                        </tr>
                        <tr>
                            <th>인쇄 품질 (printQuality)</th>
                            <td>{display(card.printQuality)}</td>
                        </tr>
                        <tr>
                            <th>가격 (basePrice / salePrice)</th>
                            <td>
                                {display(card.basePrice)?.toLocaleString?.() ?? "-"} /
                                {display(card.salePrice)?.toLocaleString?.() ?? "-"} 원
                            </td>
                        </tr>
                        <tr>
                            <th>재고 (stock)</th>
                            <td>{display(card.stock)}</td>
                        </tr>
                        <tr>
                            <th>상태 (status)</th>
                            <td>{display(card.status)}</td>
                        </tr>
                        <tr>
                            <th>삭제 여부 (deletedFlag)</th>
                            <td>{display(card.deletedFlag)}</td>
                        </tr>
                        <tr>
                            <th>조회수 (viewCount)</th>
                            <td>{display(card.viewCount)}</td>
                        </tr>
                        <tr>
                            <th>생성일 (createdAt)</th>
                            <td>{display(card.createdAt)}</td>
                        </tr>
                        <tr>
                            <th>수정일 (updatedAt)</th>
                            <td>{display(card.updatedAt)}</td>
                        </tr>
                        </tbody>
                    </Table>


                    <div className="d-flex gap-2 mt-3">
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/admin/photocards")}
                        >
                            목록으로
                        </Button>

                        {card.deletedFlag === "Y" ? (
                            <Button variant="success" onClick={onRestore}>
                                복구
                            </Button>
                        ) : (
                            <Button variant="warning" onClick={onSoftDelete}>
                                삭제(소프트)
                            </Button>
                        )}

                        <Button variant="danger" onClick={onHardDelete}>
                            완전 삭제(하드)
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AdminPhotocardDetailPage;