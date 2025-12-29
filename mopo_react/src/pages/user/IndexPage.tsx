// IndexPage.tsx - 메인 로그인 페이지 UI/UX 개선 버전
import React, {useState} from "react";
import {Alert, Button, Card, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const IndexPage: React.FC = () => {
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const {username, password} = inputs;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const onLogIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("아이디와 비밀번호를 모두 입력해 주세요.");
            return;
        }

        try {
            setLoading(true);

            const formData = {
                username: username.trim(),
                password: password.trim(),
            };

            const resp = await axios.post("http://localhost:8080/api/member/login", formData);
            const data = resp.data;

            if (!data || !data.loginResponse || !data.loginResponse.token) {
                setError("아이디 또는 비밀번호를 다시 확인해 주세요.");
                return;
            }

            localStorage.setItem("token", data.loginResponse.token);
            localStorage.setItem("nickname", data.loginResponse.nickname);
            localStorage.setItem("role", data.loginResponse.role);

            // 로그인 성공 후 메인(포토카드 목록)으로 이동
            navigate("/");
        } catch (err) {
            console.error("로그인 실패:", err);
            setError("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center">
            <Container>
                <Row className="justify-content-center">
                    <Col sm={10} md={8} lg={5}>
                        <Card className="shadow-sm border-0">
                            <Card.Body className="p-4 p-md-5">
                                {/* 상단 타이틀 영역 */}
                                <h1 className="fw-bold text-center mb-2">MoPo 로그인</h1>
                                <p className="text-muted text-center mb-4">
                                    포토카드 쇼핑몰 MoPo에 오신 것을 환영합니다.
                                </p>

                                {/* 에러 메시지 */}
                                {error && (
                                    <Alert variant="danger" className="mb-4">
                                        {error}
                                    </Alert>
                                )}

                                {/* 로그인 폼 */}
                                <Form onSubmit={onLogIn}>
                                    <Form.Group className="mb-3" controlId="loginUsername">
                                        <Form.Label className="fw-semibold small text-muted">
                                            아이디
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            value={username}
                                            onChange={onChange}
                                            placeholder="아이디를 입력하세요"
                                            autoComplete="username"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="loginPassword">
                                        <Form.Label className="fw-semibold small text-muted">
                                            비밀번호
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={onChange}
                                            placeholder="비밀번호를 입력하세요"
                                            autoComplete="current-password"
                                        />
                                    </Form.Group>

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="로그인 상태 유지"
                                            className="small text-muted"
                                        />
                                    </div>

                                    {/* 로그인 버튼 */}
                                    <div className="d-grid mb-3">
                                        <Button
                                            type="submit"
                                            variant="dark"
                                            size="lg"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        className="me-2"
                                                    />
                                                    로그인 중...
                                                </>
                                            ) : (
                                                "로그인"
                                            )}
                                        </Button>
                                    </div>
                                </Form>

                                {/* 구분선 */}
                                <hr className="my-4"/>

                                {/* 회원가입 영역 */}
                                <p className="text-center text-muted mb-3">
                                    아직 회원이 아니신가요?
                                </p>
                                <div className="d-grid">
                                    <Button
                                        variant="outline-secondary"
                                        size="lg"
                                        onClick={() => navigate("/signup")}
                                    >
                                        회원가입 하러가기
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default IndexPage;
