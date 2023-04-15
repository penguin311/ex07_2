import React, { useEffect, useState } from 'react'
import {Row, Col, Button, Form, InputGroup, Card} from 'react-bootstrap'
import axios from 'axios'
import Book from './Book';

const BookPage = () => {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [is_end, setIs_end] = useState(false);
    const [query, setQuery] = useState('리액트');

    const getBooks = async() => {
        const url = "https://dapi.kakao.com/v3/search/book?target=title";
        const config = {
            headers: {"Authorization": "KakaoAK b80880fbde422de3fd9b4a4e67c9bb54"},
            params: {"query": query, "size": 8, "page": page}
        }
        setLoading(true);
        const result = await axios(url, config);
        console.log(result.data);
        const data=result.data.documents.map(book=>{
            const fmtPrice=book.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return { ...book, fmtPrice:fmtPrice, show:false }
        })
        setBooks(data);
        setTotal(result.data.meta.pageable_count);
        setIs_end(result.data.meta.is_end);
        setLoading(false);
    }

    useEffect(()=>{
        getBooks();
    },[page]);

    const onSearch = () => {
        setPage(1);
        getBooks();
    }

    if(loading) return <h1 className='text-center my-5'>로딩중......</h1>
    return (
        <Row className='justify-content-center mx-2 my-5'>
            <h1 className='text-center mb-5'>도서검색</h1>
            <Row className='my-2'>
                <Col md={4} xs={6}>
                    <Form onSubmit={ onSearch }>
                        <InputGroup>
                            <Form.Control value={query} placeholder='검색어'
                                onChange={(e)=>setQuery(e.target.value)}/>
                            
                        </InputGroup>
                    </Form>
                </Col>
                <Col>검색수: {total}건</Col>
            </Row>
            <hr/>
            <Row className='my-2 justify-content-center'>
                {books.map(book=>
                    <Col key={book.isbn} className="my-2" md={3} xs={6}>
                        <Card>
                            <Card.Body>
                                <div><img src={!book.thumbnail ? 'http://via.placeholder.com/120x170':book.thumbnail}/></div>
                                <div className="ellipsis">{book.title}</div>
                                <div>{book.fmtPrice}원</div>
                                <div className="ellipsis">{book.authors}</div>
                                <Book book={book}/>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
            <div className='text-center my-3'>
                <Button disabled={page === 1 && true}
                    onClick={()=>setPage(page-1)}>이전</Button>
                <span className='mx-2'>{page}</span>
                <Button disabled={is_end}
                    onClick={()=>setPage(page+1)}>다음</Button>
            </div>
        </Row>
    )
}

export default BookPage