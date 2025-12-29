import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Form} from "react-bootstrap";

const MyProfileEditPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        nickname: "",
        phone: "",
        gender: ""
    })

    const onChange =
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const {name, value} = e.target;
            setForm(prev => ({
                ...prev,
                [name]: value
            }))
        }

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

                const resp = await axios.get("http://localhost:8080/api/mypage/profile", config)

                const data = resp.data;

                setForm({
                    username: data.username ?? "",
                    nickname: data.nickname ?? "",
                    phone: data.phone ?? "",
                    gender: data.gender ?? ""
                })
            } catch (e) {
                console.error("프로필 조회 실패: ", e);
                alert("프로필 정보를 불러오지 못했습니다.");
            }
        }

        fetchProfile()
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const profileUpdateRequest = {
                username: form.username,
                nickname: form.nickname,
                phone: form.phone,
                gender: form.gender
            };

            const resp = await axios.patch(
                "http://localhost:8080/api/mypage/profile",
                profileUpdateRequest,
                config
            );

            // console.log("프로필 수정 결과:", resp.data);
            alert("프로필이 수정되었습니다.");
            navigate("/mypage");
        } catch (e) {
            console.error("프로필 수정 실패:", e);
            alert("프로필 수정에 실패했습니다.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>프로필 수정</h2>

            <Form className="mt-3" onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>아이디 (수정불가)</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={onChange}
                        readOnly   // 아이디는 보통 수정 불가
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>닉네임</Form.Label>
                    <Form.Control
                        type="text"
                        name="nickname"
                        value={form.nickname}
                        onChange={onChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>연락처</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>성별</Form.Label>
                    <Form.Select
                        name="gender"
                        value={form.gender}
                        onChange={onChange}
                    >
                        <option value="">선택하세요</option>
                        <option value="M">남자</option>
                        <option value="F">여자</option>
                    </Form.Select>
                </Form.Group>


                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        저장하기
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
    );
}

export default MyProfileEditPage