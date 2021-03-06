import React, { useRef, useState, useEffect, useCallback } from 'react';
import Loading from './Loading'
import CarouselImage from './CarouseImage'
import {
    BrowserRouter as Router,
    Link,
} from "react-router-dom";


const ImageView = ({ src, offShow, log, id, uid, name, url }) => {
    
    console.log(uid);
    const [comments, setComment] = useState([])
    const [loaded, setLoad] = useState(false)
    const [text, setText] = useState('')
    const [userId, setUid] = useState(null)
    const [index, setIndex] = useState(5)
    const [moreComments, setMoreComments] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        console.log("its called");
        // console.log(messagesEndRef);
        messagesEndRef.current.scrollIntoView({ behavior: "instant" })
    }

    // let index = 0;
    const getComments = async () => {
        setMoreComments(true)
        console.log("got this far 2");
        if (uid !== '') {
            const response = await fetch(`http://localhost:3000/info/${uid}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                }
            })
            const result = await response.json();
            setUid(result._id)
        }
        const res = await fetch(`http://localhost:3000/api/${id}/cmts/${index}`, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
        const comments = await res.json();
        setComment(comments)
        setLoad(true)
        scrollToBottom()
        setMoreComments(false)
    }
    const handleChange = (e) => {
        setText(e.target.value)
        //  console.log(e.target.value);
    }
    const handleLoadMoreComments = () => {

        setIndex(index + 5)
    }

    const handleClick = async (e) => {
        console.log(id);
        fetch('http://localhost:3000/auto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "lid": id,
                "uid": userId,
                "title": text,
                "body": "thisisbody"
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.done) {
                    // setLoad(false)
                    const body = "nothing"
                    const lid = id
                    let uid = {
                        name: name,
                        image: url
                    }
                    const title = text;
                    const stringified = JSON.stringify({
                        lid, uid, title, body
                    })
                    comments.push(JSON.parse(stringified))
                    //setComment(comments)
                    scrollToBottom()
                    //  setLoad(true)
                    //    getComments();
                    setText('')
                } else {
                    alert("An error occured!")
                }
            })
        //  console.log(index);

    }
    // const ts = () =>{
    //     console.log("hihi");
    // }
    useEffect(() => {
        scrollToBottom()
        getComments();
        console.log("hic hiic");
        console.log(index);


        // setComment(cmt)
    }, [index])
    const styleDiv = {
        width: '100%',
        height: '100%',
        zIndex: '100',
        backgroundColor: 'rgb(0,0,0)',
        backgroundColor: 'rgba(0,0,0,0.4)', /* Black w/ opacity */
        position: 'relative',


    }
    return (

        <div style={styleDiv} >
            {/* {console.log("rerender")} */}
            <div style={{
                width: '700px',
                minHeight: '550px',
                position: 'absolute',
                marginLeft: '30%',
                marginTop: '100px',
                transform: 'translate(-30%,0)',
                opacity: '1',

            }}>
                {/* <img src={src} width={700} height={500}  /> */}
                <CarouselImage images={src} />

            </div>
            <div
                style={{
                    width: '350px',
                    height: '610px',
                    position: 'absolute',
                    marginLeft: '65%',
                    marginTop: '50px',
                    // transform:'translate(-50%,0)',
                    opacity: '1',
                    borderRadius: '4px',
                    backgroundColor: '#FFF',
                    boxShadow: '0 1px 2px rgba(0,0,0,.1)',
                    padding: '15px 20px',
                    zIndex: '1000'

                }}>
                <Router>
                    <Link to="/">
                        <div style={{
                            position: 'absolute',
                            right: '10px',
                            top: '0px',
                            // fontSize:'18px',
                            padding: '5px 5px',
                            cursor: 'pointer'
                        }}
                            onClick={() => offShow(false)}
                        >
                            <svg height="12px" viewBox="0 0 365.696 365.696" width="12px" xmlns="http://www.w3.org/2000/svg"><path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0" /></svg>
                        </div>
                    </Link>
                </Router>
                <h3 style={{
                    fontSize: '19px'
                }}>{log.title.toUpperCase()}</h3>
                <p
                    style={{
                        marginTop: '0',
                        marginBottom: '0',
                        fontWeight: 'bold',
                        fontSize: '17px'

                    }}
                >
                    {log.comments}
                </p>
                <p
                    style={{
                        marginTop: '0',
                        marginBottom: '20px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}
                >
                    Author: {log.author}
                </p>

                <p
                    style={{
                        margin: '0',
                        fontSize: '13px'
                    }}
                >
                    Comments({comments.length})
                </p>

                <div className="comments"

                    style={{
                        marginLeft: '15px',
                        height: '400px',
                        overflow: 'scroll'
                    }}
                >
                    {loaded ?

                        comments.map((cmt, index) => (
                            <React.Fragment key={index}>

                                <p className="cmt-row">
                                    <img src={cmt.uid.image} style={{
                                        display: 'absolute',
                                        marginTop: 'auto',
                                        width: '25px',
                                        height: '25px',
                                        borderRadius: '50%',
                                        marginRight: '5px'
                                    }} />
                                    <span><strong  style={{ marginRight: '5px',fontWeight:'700' }}>{cmt.uid.name}: </strong></span>{cmt.title}</p>
                            </React.Fragment>
                        ))


                        : <Loading />}

                    <div
                        ref={messagesEndRef} >
                    </div>
                    {loaded ? <div className="action_comments"
                        style={{
                            fontSize: '10px',
                            // position:'absolute',
                            marginLeft: '75%',
                            // marginTop:'-10px',
                            marginBottom: '5px'
                        }}
                    >
                        <span onClick={() => handleLoadMoreComments()} >
                            {moreComments ? 'loading more...' : 'more comments'}
                        </span>
                    </div> : ''
                    }

                    {

                        uid &&
                        <>

                            <textarea
                                style={{
                                    width: '95%',
                                    height: '35px',
                                    fontSize: '14px',
                                    marginTop: '5px'

                                }}
                                placeholder="enter some your review.."
                                type="text"
                                rows="5"
                                value={text}
                                onChange={(e) => handleChange(e)}
                            />


                            <button
                                style={{
                                    backgroundColor: '#333',
                                    border: '1px solid black',
                                    borderRadius: '2px',
                                    fontSize: '14px',
                                    color: 'white',
                                    marginBottom: '40px'


                                }}
                                onClick={() => handleClick()}
                            >
                                Share your review
                            </button>
                        </>
                    }
                </div>

            </div>
        </div>
    )
}

export default ImageView;