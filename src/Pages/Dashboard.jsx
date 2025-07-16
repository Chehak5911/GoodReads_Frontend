import BookCard from "Components/BookCard/BookCard";
import Footer from "Components/Footer/Footer";
import Navbar from "Components/Navbar/Navbar";
import Layout from "Layouts/Layout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks } from "Redux/Slices/BookSlice";

export default function Dashboard(){
    const dispatch = useDispatch();
    const bookState = useSelector((state)=>state.book);

    async function loadBooks(){
        if(bookState.bookList.length === 0){
            const response = await dispatch(getAllBooks());
            console.log(response);
        }
    }

    useEffect(()=>{
        loadBooks();
    }, [])

    return (
        <Layout>
            {bookState.bookList.length>0 && bookState.bookList.map(book => {
                return <BookCard id={book._id} title={book.title} description={book.description} author={book.author?.name} />
            })}
        </Layout>
    )
}