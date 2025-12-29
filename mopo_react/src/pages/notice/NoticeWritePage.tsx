import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert, Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/notice/";

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

function NoticeWritePage() {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!title.trim() || !content.trim()) {
            setError("제목과 내용을 모두 입력해 주세요.");
            return;
        }

        try {
            setSubmitting(true);

            const body = {
                title: title.trim(),
                content: content.trim(),
            };

            const resp = await axios.post<AdminResponse>(
                `${API_BASE_URL}write`,
                body,
                getAuthConfig()
            );

            const {result, message} = resp.data;

            if (result !== "success") {
                setError(message || "게시글 등록에 실패했습니다.");
                return;
            }

            setSuccess("게시글이 등록되었습니다.");
            navigate("/notices");
        } catch (e) {
            console.error(e);
            setError("게시글 등록 중 오류가 발생했습니다.");
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
                            <Card.Title className="mb-3">게시글 작성</Card.Title>
                            <Card.Subtitle className="mb-3 text-muted">
                                관리자 권한이 있어야 등록할 수 있습니다.
                            </Card.Subtitle>

                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="boardTitle" className="mb-3">
                                    <Form.Label>제목</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="게시글 제목을 입력해 주세요"
                                    />
                                </Form.Group>

                                <Form.Group controlId="boardContent" className="mb-3">
                                    <Form.Label>내용</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={10}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="게시글 내용을 입력해 주세요"
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-between">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={() => navigate("/notices")}
                                        disabled={submitting}
                                    >
                                        목록으로
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={submitting}
                                    >
                                        {submitting ? "등록 중..." : "등록"}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default NoticeWritePage;
