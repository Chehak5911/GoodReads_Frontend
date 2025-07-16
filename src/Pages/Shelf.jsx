import Layout from "Layouts/Layout";
import BookImage from 'Assets/Images/book.jpg';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createShelf, getAllBookShelves } from "Redux/Slices/ShelfSlice";
import { useNavigate } from "react-router-dom";

export default function Shelf(){

    const dispatch = useDispatch();
    const shelfState = useSelector((state)=>state.shelf);
    const navigate = useNavigate();

    const [activeShelf, setActiveShelf] = useState(null);
    const [books, setBooks] = useState([]);
    const [shelfInput, setShelfInput] = useState("");

    async function loadShelves(){
        if(shelfState.bookList.length === 0){
            const response = await dispatch(getAllBookShelves());
            if(response?.payload?.data?.data.length>0){
                setBooks(response?.payload?.data?.data[0])
                setActiveShelf(response?.payload?.data?.data[0]?._id)
            }
            else if(shelfState.bookList.length > 0){
                setBooks(shelfState.bookList[0])
                setActiveShelf(shelfState.bookList[0]._id)
            }
            console.log(response);
        }
    }

    useEffect(()=>{
        loadShelves();
    }, [])

    function changeActiveShelf(id){
        setActiveShelf(id);
        shelfState.shelfList.forEach(shelf => {
            if(shelf._id === id){
                setBooks(shelf.books);
            }
        });
    }

    return (
        <Layout>
            <div className="flex justify-start items-start gap-32">
                <div className="flex flex-col justify-start items-start">
                    {shelfState.shelfList.length>0 && shelfState.shelfList.map((shelf)=>{
                        return (
                            <div onClick={()=>changeActiveShelf(shelf._id)} key={shelf._id} className="mt-3 mb-3 w-full">
                                <button className={`btn-${activeShelf === shelf._id ? 'primary': 'warning'} px-2 py-1 text-2xl rounded-md px-2 w-full`}> 
                                    {shelf.name} 
                                </button>
                            </div>
                        )
                    })}
                    <div>
                        <input 
                        className="p-4 bg-white rounded-sm mb-4 text-black" 
                        placeholder="Shelf Name"
                        value={shelfInput}
                        onChange={(e)=>{setShelfInput(e.target.value)}}
                        />
                        <button 
                        className="block btn-accent px-4 py-2 rounded-md"
                        onClick={async ()=>{
                            await dispatch(createShelf({shelfName: shelfInput}))
                            await dispatch(getAllBookShelves());
                            setBooks('');
                        }}
                        >
                            Create New Shelf
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Rating</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* row 1 */}
                    {books.length>0 &&  books.map((book)=>{
                        return (
                            <tr className="hover:bg-slate-700" key={book._id} onClick={()=> navigate("/book/description", {...books})}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                        <div className="mask mask-squircle h-12 w-12">
                                            <img src={BookImage} alt="Book Image" />
                                        </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-xl"> {book.title} </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {book.author}
                                </td>
                                <td>{book.genre[0]}</td>
                                <td>5</td>
                                <th>
                                <button className="btn btn-ghost btn-xs text-l hover:bg-primary">details</button>
                                </th>
                            </tr>
                        )
                    })}
                    </tbody>
                    {/* foot */}
                    <tfoot>
                    <tr>
                        <th>Title</th>
                        <th>Rating</th>
                        <th></th>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </Layout>
    )
}