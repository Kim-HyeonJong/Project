import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Button, Table, Form} from "react-bootstrap";

const AdminMemberListPage = () => {
    const navigate = useNavigate();

    // 🔹 members를 any 배열로 둠 (인터페이스 없이)
    const [members, setMembers] = useState<any[]>([]);

    // 회원 목록 불러오기
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("관리자 로그인이 필요합니다.");
                    navigate("/"); // 로그인 페이지 경로에 맞게 수정
                    //==============================================
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const resp = await axios.get(
                    "http://localhost:8080/api/admin/members/",
                    config
                );

                const membersData = resp.data.members ?? resp.data;

                setMembers(membersData);
            } catch (e) {
                console.error("회원 목록 조회 실패:", e);
            }
        };

        fetchMembers();
    }, [navigate]);

    // 🔹 드롭다운에서 role 바뀔 때 → 프론트 state만 먼저 바꿈
    const onChangeRole = (id: number, newRole: string) => {
        setMembers(prev =>
            prev.map(m =>
                m.id === id ? { ...m, role: newRole } : m
            )
        )
    }

    const onUpdateRole = async (member: any) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("관리자 로그인이 필요합니다.");
                navigate("/");
                //==============================================

                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const body = { role: member.role };

            await axios.patch(
                `http://localhost:8080/api/admin/members/${member.id}/role`,
                body,
                config
            );

            alert("권한이 변경되었습니다.");
        } catch (e) {
            console.error("권한 변경 실패:", e);
            alert("권한 변경에 실패했습니다.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>관리자 - 회원 관리</h2>

            <Table striped bordered hover size="sm" className="mt-3">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>아이디(username)</th>
                    <th>닉네임(nickname)</th>
                    <th>전화번호(phone)</th>
                    <th>성별(gender)</th>
                    <th>권한(role)</th>
                    <th>변경</th>
                </tr>
                </thead>
                <tbody>
                {members.map((member) => (
                    <tr key={member.id}>
                        <td>{member.id}</td>
                        <td>{member.username}</td>
                        <td>{member.nickname}</td>
                        <td>{member.phone}</td>
                        <td>{member.gender}</td>
                        <td>
                            <Form.Select
                                value={member.role}
                                onChange={(e) =>
                                    onChangeRole(member.id, e.target.value)
                                }
                            >
                                <option value="ROLE_USER">ROLE_USER</option>
                                <option value="ROLE_SELLER">ROLE_SELLER</option>
                                <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                            </Form.Select>
                        </td>
                        <td>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => onUpdateRole(member)}
                            >
                                권한 적용
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/*<Button
                variant="secondary"
                onClick={() => navigate("/")}
            >
                메인으로
            </Button>*/}
        </div>
    );
};

export default AdminMemberListPage;