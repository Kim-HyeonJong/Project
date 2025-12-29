import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert, Badge, Button, Card, Col, Container, Pagination, Row, Spinner, Table} from "react-bootstrap";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/notice/";

interface NoticeDto {
    id: number;
    adminId: number;
    title: string;
    content: string;
    pinnedFlag: string; // 'Y' / 'N'
    createdAt: string;
    updatedAt: string;
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

function NoticeListPage() {
    const [notices, setNotices] = useState<NoticeDto[]>([]);
    const [pageNo, setPageNo] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    const fetchBoards = async (page: number) => {
        try {
            setLoading(true);
            setError("");

            const resp = await axios.get<AdminResponse>(
                `${API_BASE_URL}showAll/${page}`,
                getAuthConfig()
            );

            // console.log("notice list api resp:", resp.data);

            const {result, message, data} = resp.data;

            if (result != "success") {
                setError(message || "게시글 목록을 불러오지 못했습니다.");
                setNotices([]);
                return;
            }

            const dt: any = data || {};


            const list: NoticeDto[] =
                dt.items ||
                dt.totalCount ||
                dt.totalPage ||
                dt.currentPage ||
                dt.startPage ||
                dt.endPage ||

                [];

            const tp: number =
                dt.totalPages ||
                dt.totalPage ||
                dt.total_pages ||
                (dt.page && dt.page.totalPages) ||
                1;

            const tc: number =
                dt.totalCount ||
                dt.totalElements ||
                dt.count ||
                0;

            setNotices(list);
            setTotalPages(tp);
            setTotalCount(tc);
            setPageNo(page);
        } catch (e) {
            console.error(e);
            setError("게시글 목록을 불러오는 도중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 사용자가 /notices 들어오면 useEffect에서 fetchBoards 호출
    useEffect(() => {
        fetchBoards(1);
    }, []);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        fetchBoards(page);
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === pageNo}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        return (
            <Pagination className="justify-content-center mt-3">
                <Pagination.First onClick={() => handlePageChange(1)} disabled={pageNo === 1}/>
                <Pagination.Prev onClick={() => handlePageChange(pageNo - 1)} disabled={pageNo === 1}/>
                {items}
                <Pagination.Next onClick={() => handlePageChange(pageNo + 1)} disabled={pageNo === totalPages}/>
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={pageNo === totalPages}/>
            </Pagination>
        );
    };

    return (
        <Container className="my-4">
            <Row className="justify-content-center">
                <Col lg={10}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="d-flex justify-content-between align-items-center">
                                <span>공지사항</span>
                                {localStorage.getItem("role") === "ROLE_ADMIN" && (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => navigate("/admin/notice/new")}
                                    >
                                        글 작성
                                    </Button>
                                )}
                            </Card.Title>
                            <Card.Subtitle className="mb-3 text-muted">
                                총 {totalCount}건의 게시글이 있습니다.
                            </Card.Subtitle>

                            {loading && (
                                <div className="text-center my-4">
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div>
                            )}

                            {error && <Alert variant="danger">{error}</Alert>}

                            {!loading && !error && (
                                <>
                                    <Table hover responsive className="align-middle">
                                        <thead className="table-light">
                                        <tr>
                                            <th style={{width: "80px"}}>번호</th>
                                            <th>제목</th>
                                            <th style={{width: "200px"}}>작성일</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {notices.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="text-center py-4">
                                                    등록된 게시글이 없습니다.
                                                </td>
                                            </tr>
                                        )}
                                        {notices.map((notice) => (
                                            <tr
                                                key={notice.id}
                                                style={{cursor: "pointer"}}
                                                onClick={() => navigate(`/notice/${notice.id}`)}
                                            >
                                                <td>{notice.id}</td>
                                                <td>
                                                    {notice.pinnedFlag === "Y" && (
                                                        <Badge bg="warning" text="dark" className="me-2">
                                                            중요
                                                        </Badge>
                                                    )}
                                                    <span>{notice.title}</span>
                                                </td>
                                                <td>
                                                    {notice.createdAt
                                                        ? new Date(notice.createdAt).toLocaleString()
                                                        : "-"}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>

                                    {renderPagination()}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default NoticeListPage;
