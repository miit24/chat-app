import { createContext, useReducer, useState } from "react";

export const Store = createContext();

const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
}


function reducer(state, action) {
    switch (action.type) {
        case 'USER_SIGNIN':
            return { userInfo: action.payload }
        case 'USER_LOGOUT':
            return { userInfo: null }
        default:
            return state
    }
}


export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [fetchAgain, setFetchAgain] = useState(false)// use for dependency in useEffect
    const value = {
        state,
        dispatch,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchAgain,
        setFetchAgain
    };

    return (
        <Store.Provider value={value}>
            {props.children}
        </Store.Provider>
    );
}