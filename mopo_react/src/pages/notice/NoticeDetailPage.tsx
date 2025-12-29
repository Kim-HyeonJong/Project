import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Button, Card, Col, Container, Row, Spinner} from "react-bootstrap";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/notice/";

interface NoticeDto {
    id: number;
    adminId?: number;
    title: string;
    content: string;
    pinnedFlag?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface AdminResponse<T = any> {
    result: string;
    message: string;
    data: T;
}

function getAuthConfig() {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

function NoticeDetailPage() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [notice, setNotice] = useState<NoticeDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [actionError, setActionError] = useState<string>("");

    const Id = Number(id);

    const fetchBoard = async () => {
        if (!Id) {
            setError("잘못된 게시글 번호입니다.");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const resp = await axios.get<AdminResponse<NoticeDto>>(
                `${API_BASE_URL}showOne/${Id}`,
                getAuthConfig()
            );
            const {result, message, data} = resp.data;
            if (result !== "success" || !data) {
                setError(message || "게시글을 불러오지 못했습니다.");
                setNotice(null);
                return;
            }
            setNotice(data);
        } catch (e) {
            console.error(e);
            setError("게시글을 불러오는 도중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleDelete = async () => {
        if (!notice) return;
        const ok = window.confirm("정말 이 게시글을 삭제하시겠습니까?");
        if (!ok) return;

        try {
            setActionError("");
            await axios.delete(`${API_BASE_URL}${notice.id}`, getAuthConfig());
            alert("삭제되었습니다.");
            navigate("/notices"); // 여기 고침!(20251209)
        } catch (e) {
            console.error(e);
            setActionError("게시글 삭제 중 오류가 발생했습니다.");
        }
    };

    const handlePinToggle = async () => {
        if (!notice) return;

        try {
            setActionError("");
            const isPinned = notice.pinnedFlag === "Y";
            const url = isPinned
                ? `${API_BASE_URL}unpin/${notice.id}`
                : `${API_BASE_URL}pin/${notice.id}`;

            await axios.patch(url, null, getAuthConfig());

            await fetchBoard(); // 다시 로딩해서 상태 업데이트
        } catch (e) {
            console.error(e);
            setActionError("게시글 상단 고정/해제 중 오류가 발생했습니다.");
        }
    };

    const formatDate = (value?: string) =>
        value ? new Date(value).toLocaleString() : "-";

    return (
        <Container className="my-4">
            <Row className="justify-content-center">
                <Col lg={10}>
                    {loading && (
                        <div className="text-center my-4">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    )}

                    {error && <Alert variant="danger">{error}</Alert>}
                    {actionError && <Alert variant="danger">{actionError}</Alert>}

                    {!loading && !error && notice && (
                        <Card className="shadow-sm">
                            <Card.Body>
                                {/* 상단 제목 영역 */}
                                <div className="mb-3">
                                    <h4 className="fw-bold mb-0">
                                        {notice.title}
                                    </h4>
                                </div>

                                {/* 상단 정보 테이블 – 2번째 이미지 스타일 */}
                                <table className="table table-bordered mb-4">
                                    <tbody>
                                    <tr>
                                        <th className="bg-light" style={{width: "120px"}}>
                                            제목
                                        </th>
                                        <td colSpan={3}>{notice.title}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light">등록일</th>
                                        <td>{formatDate(notice.createdAt)}</td>
                                        <th className="bg-light" style={{width: "120px"}}>
                                            수정일
                                        </th>
                                        <td>{formatDate(notice.updatedAt)}</td>
                                    </tr>
                                    </tbody>
                                </table>

                                {/* 본문 – 박스 안에 내용 출력 */}
                                <div
                                    className="border rounded p-4 mb-4"
                                    style={{minHeight: "200px", whiteSpace: "pre-wrap"}}
                                >
                                    {notice.content}
                                </div>

                                {/* 하단 버튼 묶음 */}
                                <div className="d-flex justify-content-end gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => navigate("/notices")}
                                    >
                                        목록
                                    </Button>
                                    {localStorage.getItem("role") === "ROLE_ADMIN" && (
                                        <>
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                onClick={() => navigate(`/admin/notice/${id}/edit`)}
                                            >
                                                수정
                                            </Button>
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={async () => {
                                                    await handlePinToggle();
                                                    navigate("/notices");
                                                }}
                                            >
                                                상단 고정/해제
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={handleDelete}
                                            >
                                                삭제
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default NoticeDetailPage;
