import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Button, Card, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/notice/";

interface NoticeDto {
    id: number;
    title: string;
    content: string;
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

function NoticeUpdatePage() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [notice, setNotice] = useState<NoticeDto | null>(null);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);

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
                return;
            }

            setNotice(data);
            setTitle(data.title);
            setContent(data.content);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!Id || !notice) {
            setError("잘못된 요청입니다.");
            return;
        }

        if (!title.trim() || !content.trim()) {
            setError("제목과 내용을 모두 입력해 주세요.");
            return;
        }

        try {
            setSubmitting(true);

            const body = {
                id: notice.id,
                title: title.trim(),
                content: content.trim(),
            };

            const resp = await axios.patch<AdminResponse>(
                `${API_BASE_URL}${notice.id}`,
                body,
                getAuthConfig()
            );

            const {result, message} = resp.data;
            console.log(resp.data);

            if (result !== "success") {
                setError(message || "게시글 수정에 실패했습니다.");
                return;
            }

            setSuccess("게시글이 수정되었습니다.");
            navigate(`/notices`);
        } catch (e) {
            console.error(e);
            setError("게시글 수정 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="my-4">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="mb-3">게시글 수정</Card.Title>

                            {loading && (
                                <div className="text-center my-4">
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div>
                            )}

                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            {!loading && notice && (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="boardTitle" className="mb-3">
                                        <Form.Label>제목</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="boardContent" className="mb-3">
                                        <Form.Label>내용</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={10}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    </Form.Group>

                                    <div className="d-flex justify-content-between">
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            onClick={() => navigate(`/notice/${notice.id}`)}
                                            disabled={submitting}
                                        >
                                            취소
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={submitting}
                                        >
                                            {submitting ? "수정 중..." : "수정 완료"}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default NoticeUpdatePage;
