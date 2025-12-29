import {Alert, Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import axios from "axios";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

function RegisterPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [nickname, setNickname] = useState("");
    const [gender, setGender] = useState("");
    const [phonePre, setPhonePre] = useState("010");   // 앞 3자리 드롭박스
    const [phoneMiddle, setPhoneMiddle] = useState(""); // 가운데 3~4자리
    const [phoneLast, setPhoneLast] = useState("");     // 마지막 4자리
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // 필수값 체크 (휴대전화 가운데/끝 자리도 필수)
        if (!username || !password || !password2 || !nickname || !phoneMiddle || !phoneLast) {
            setError("모든 필드를 입력해 주세요.");
            return;
        }

        if (password !== password2) {
            setError("비밀번호가 서로 일치하지 않습니다.");
            return;
        }

        // 휴대전화 형식 간단 체크 (숫자만)
        const middleValid = /^\d{3,4}$/.test(phoneMiddle);
        const lastValid = /^\d{4}$/.test(phoneLast);

        if (!middleValid || !lastValid) {
            setError("휴대전화 형식을 확인해 주세요. (예: 010-1234-5678)");
            return;
        }

        const phone = `${phonePre}-${phoneMiddle}-${phoneLast}`;

        const newUser = {
            username,
            password,
            nickname,
            phone,
            gender,
        };

        // 회원 가입
        await axios.post("http://localhost:8080/api/member/register", newUser);

        navigate("/");
    };

    return (
        <div className="min-vh-100 d-flex align-items-center">
            <Container>
                <Row className="justify-content-center">
                    <Col>
                        <Card className="shadow-sm border-0">
                            <Card.Body className="p-4 p-md-5">
                                <h1 className="fw-bold text-center mb-2">회원가입</h1>
                                <p className="text-muted text-center mb-4">
                                    MoPo의 다양한 서비스를 이용해 보세요.
                                </p>

                                {error && (
                                    <Alert variant="danger" className="mb-4">
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="signupUsername">

                                        <Form.Control
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="아이디를 입력하세요"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="signupNickname">

                                        <Form.Control
                                            type="text"
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            placeholder="닉네임을 입력하세요"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="signupPassword">

                                        <Form.Control
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="비밀번호를 입력하세요"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="signupPassword2">

                                        <Form.Control
                                            type="password"
                                            value={password2}
                                            onChange={(e) => setPassword2(e.target.value)}
                                            placeholder="비밀번호를 다시 입력하세요"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="signupGender">

                                        <Form.Select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                        >
                                            <option value="">성별 선택</option>
                                            <option value="M">남성</option>
                                            <option value="F">여성</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="signupPhone">

                                        <div className="d-flex gap-2">
                                            {/* 앞 3자리 드롭박스 */}
                                            <Form.Select
                                                style={{maxWidth: "200px"}}
                                                value={phonePre}
                                                onChange={(e) => setPhonePre(e.target.value)}
                                            >
                                                <option value="010">010</option>
                                                <option value="011">011</option>
                                                <option value="016">016</option>
                                                <option value="017">017</option>
                                                <option value="018">018</option>
                                                <option value="019">019</option>
                                            </Form.Select>

                                            {/* 가운데 3~4자리 */}
                                            <Form.Control
                                                type="text"
                                                maxLength={4}
                                                value={phoneMiddle}
                                                onChange={(e) =>
                                                    setPhoneMiddle(e.target.value.replace(/\D/g, ""))
                                                }
                                                placeholder="1234"
                                            />

                                            {/* 마지막 4자리 */}
                                            <Form.Control
                                                type="text"
                                                maxLength={4}
                                                value={phoneLast}
                                                onChange={(e) =>
                                                    setPhoneLast(e.target.value.replace(/\D/g, ""))
                                                }
                                                placeholder="5678"
                                            />
                                        </div>
                                        <Form.Text className="text-muted">
                                            예: 010-1234-5678
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Check
                                            type="checkbox"
                                            label="MoPo에서 제공하는 소식과 이벤트를 이메일로 받아볼게요."
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Check
                                            type="checkbox"
                                            label="서비스 이용약관과 개인정보 처리방침에 동의합니다."
                                        />
                                    </Form.Group>

                                    <div className="d-grid mb-3">
                                        <Button type="submit" variant="dark" size="lg">
                                            가입하기
                                        </Button>
                                    </div>
                                </Form>

                                <hr className="my-4"/>

                                <p className="text-center text-muted mb-3">
                                    다른 서비스 계정으로 가입
                                </p>
                                <div className="d-grid gap-2 mb-3">
                                    <Button variant="outline-primary" size="lg">
                                        페이스북 계정으로 가입
                                    </Button>
                                    <Button variant="outline-danger" size="lg">
                                        구글 계정으로 가입
                                    </Button>
                                    <Button variant="outline-success" size="lg">
                                        네이버 계정으로 가입
                                    </Button>
                                    <Button variant="outline-secondary" size="lg">
                                        깃허브 계정으로 가입
                                    </Button>
                                </div>

                                <p className="text-center mt-3 mb-0">
                                    이미 가입하셨다면?{" "}
                                    <Link to="/login">로그인</Link>
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default RegisterPage;
