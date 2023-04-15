import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import axios from "axios";

const BookPage = () => {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [is_end, setIs_end] = useState(false);
  const [query, setQuery] = useState("리액트");
  const ref_query = useRef(null);

  const onSummit = (e) => {
    e.preventDefault();
    getBooks();
  };

  const getBooks = async () => {
    const url = "https://dapi.kakao.com/v3/search/book?target=title";
    const config = {
      headers: { Authorization: "KakaoAK 4361e376f3dd2e9b4ec4f09da086421b" },
      params: { query: query, size: 6, page: page },
    };

    setLoading(true);
    const result = await axios(url, config);

    setTotal(result.data.meta.pageable_count);
    setIs_end(result.data.meta.is_end);
    setBooks(result.data.documents);
    console.log(result);
    setLoading(false);
    ref_query.current.focus();
  };

  useEffect(() => {
    getBooks();
  }, [page]);

  if (loading) return <h1 className="text-center my-5">로딩중임 ...</h1>;
  return (
    <Row className="my-5 mx-2">
      <Row>
        <Col>
          <Form onSubmit={onSummit}>
            <Form.Control
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              placeholder="검색어"
              ref={ref_query}
            />
          </Form>
        </Col>
        <Col>검색수 : {total}</Col>
      </Row>
      <Col>
        <h1 className="text-center">도서검색</h1>
        <Row>
          {books.map((book) => (
            <Col key={book.isbn} className="box my-2">
              <div>
                <img
                  src={
                    !book.thumbnail
                      ? "http://via.placeholder.com/120x170"
                      : book.thumbnail
                  }
                />
              </div>
              <div className="eilipsis">{book.title}</div>
              <div className="eilipsis">{book.price}원</div>
            </Col>
          ))}
        </Row>
      </Col>
      <div>
        <Button disabled={page == 1 && true} onClick={() => setPage(page - 1)}>
          이전
        </Button>
        <span className="mx-3">{page}</span>
        <Button
          disabled={is_end == 1 && true}
          onClick={() => setPage(page + 1)}
        >
          다음
        </Button>
      </div>
    </Row>
  );
};

export default BookPage;