import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import {Form} from "react-bootstrap";

const MyPasswordEditPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        newPasswordCheck: ""
    })

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.newPassword !== form.newPasswordCheck) {
            alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

            const passwordUpdateRequest = {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            }

            const resp = await axios.patch(
                "http://localhost:8080/api/mypage/profile/password",
                passwordUpdateRequest,
                config
            )

            // console.log("비밀번호 변경 결과:", resp.data)
            alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.")
            localStorage.removeItem("token")
            navigate("/"); // 로그인 페이지로
        } catch (e) {
            console.error("비밀번호 변경 실패:", e);
            alert("비밀번호 변경에 실패했습니다.")
        }
    }

    return (
        <div className="container mt-4">
            <h2>비밀번호 변경</h2>

            <Form className="mt-3" onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>현재 비밀번호</Form.Label>
                    <Form.Control
                        type="password"
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={onChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>새 비밀번호</Form.Label>
                    <Form.Control
                        type="password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={onChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>새 비밀번호 확인</Form.Label>
                    <Form.Control
                        type="password"
                        name="newPasswordCheck"
                        value={form.newPasswordCheck}
                        onChange={onChange}
                    />
                </Form.Group>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        변경하기
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/mypage")}
                    >
                        취소
                    </button>
                </div>
            </Form>
        </div>
    )
}

export default MyPasswordEditPage;