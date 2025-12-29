import {useNavigate} from "react-router-dom";
import {Button, Card} from "react-bootstrap";

const AdminMainPage = () => {

    const navigate = useNavigate()

    return (
        <div className="container mt-4">
            <h2>관리자 메인</h2>
            <p className="text-muted">관리자 전용 메뉴입니다.</p>

            <div className="d-flex flex-column gap-3 mt-4">

                <Card>
                    <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                            <Card.Title>회원 관리</Card.Title>
                            <Card.Text className="mb-0">
                                전체 회원 조회 및 권한 변경
                            </Card.Text>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => navigate("/admin/members")}
                        >
                            이동
                        </Button>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                            <Card.Title>포토카드 상품 관리</Card.Title>
                            <Card.Text className="mb-0">
                                포토카드 상품 등록 / 수정 / 삭제
                            </Card.Text>
                        </div>
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate("/admin/photocards")}
                        >
                            이동
                        </Button>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                            <Card.Title>공지사항 관리</Card.Title>
                            <Card.Text className="mb-0">
                                공지사항 작성 / 수정 / 삭제 (추후 구현 예정)
                            </Card.Text>
                        </div>
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate("/admin/notices")}
                        >
                            이동
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default AdminMainPage;