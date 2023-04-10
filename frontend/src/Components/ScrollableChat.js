import React, { useState, useContext, useEffect, useRef } from 'react'
import { Store } from '../Store';
import "../index.css"

function ScrollableChat({ message }) {
    const bottomRef = useRef(null);
    const { state } = useContext(Store);
    const { userInfo } = state;

    const rgb = () => {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        var rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
        return rgb;
    }

    const mapper = {}

    message.forEach(m => {
        mapper[m.sender._id] = rgb();
    })

    // for scrolling message to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    return (
        <div id='chat-feed'>
            {message && message.map((m, i) => {
                const d = new Date(m.createdAt)
                let flag=false
                if(m.content.indexOf("base64")!==-1){
                    flag=true
                }
                return (
                    <div
                        style={{ display: "flex" }}
                        key={i}
                    >
                        {
                            m.sender._id === userInfo._id ? (
                                <div className="container darker" style={{
                                    marginLeft: "auto",
                                    marginTop: "2px"
                                }}>
                                    {flag?<img src={m.content}></img>:<p>{m.content}</p>}
                                    <span className="time-right">{d.getHours() < 10 ? "0" + d.getHours() : d.getHours()}:{d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()}</span>
                                </div>

                            ) : (
                                <div style={{ margin: "1% 0%" }}>
                                    {
                                        m.chat.isGroupChat ? (
                                            <div className="container">
                                                <p><span style={{
                                                    color: mapper[m.sender._id],
                                                    fontStyle: "italic",
                                                }}>{m.sender.name}</span>{" "}:{" "}{flag?<img src={m.content}></img>:<p>{m.content}</p>}</p>
                                                <span className="time-left">{d.getHours() < 10 ? "0" + d.getHours() : d.getHours()}:{d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()}</span>
                                            </div>
                                        ) : (
                                            <div className="container">
                                                {flag?<img src={m.content}></img>:<p>{m.content}</p>}
                                                <span className="time-left">{d.getHours() < 10 ? "0" + d.getHours() : d.getHours()}:{d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()}</span>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                        <div ref={bottomRef} />
                    </div>
                )
            })}
        </div>
    )
}

export default ScrollableChat
