import Layout from "Layouts/Layout";
import { useLocation } from "react-router-dom";
import BookImage from "Assets/Images/book.jpg"
import { BiUser } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { addBookToShelf, getAllBookShelves } from "Redux/Slices/ShelfSlice";
import { useEffect } from "react";

export function BookDescription(){
    const {state} = useLocation();
    const dispatch = useDispatch();
    const shelfState = useSelector((state)=>state.shelf);

    useEffect(()=>{
        dispatch(getAllBookShelves());
    }, [])

    return (
        <Layout>
            {
                state._id && (
                    <div className="my-5 flex flex-col justify-center items-start gap-3 md:flex-row">
                        <div className="basis-1/3">
                            <img src={BookImage} className="w-full" />
                        </div>
                        <div className="flex flex-col justify-center items-center gap-10">
                            <div className="text-white text-4xl"> {state.title} </div>
                            <div className="text-white text-xl w-3/4"> {state.description} </div>
                            <div className='flex justify-start gap-5 items-center text-2xl text-yellow-400'>
                                <div>
                                    <BiUser />
                                </div>
                                <div>
                                    {state.author?.name}
                                </div>
                            </div>
                            <div className="tabs tabs-boxed flex justify-start items-center flex-wrap gap-3">
                                {state.genres.map((genre)=>{
                                    return <div key={genre._id} className="tab tab-active text-xl px-2 py1"> {genre.name} </div>
                                })}
                            </div>
                            <div className="text-xl">
                                Pages: <span className="text-yellow-400"> {state.pages} </span>
                            </div>
                            <div className="text-xl">
                                Publish Date: <span className="text-yellow-400"> {state.publishDate} </span>
                            </div>
                            <div>
                                <details className="dropdown">
                                    <summary className="btn m-1">Add to Shelf</summary>
                                    <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                    {shelfState.shelfList.length>0 && shelfState.shelfList.map((shelf)=> {
                                        return (
                                            <li onClick={async ()=> {
                                                await dispatch(addBookToShelf({shelfName: shelf.name, bookId: state._id}));
                                                await dispatch(getAllBookShelves());
                                            }} 
                                            className="text-white" 
                                            key={shelf._id}>
                                                <a>{shelf.name}</a>
                                            </li>
                                        )
                                    })}
                                    </ul>
                                </details>
                            </div>
                        </div>
                    </div>
                )
            }
        </Layout>
    )
}