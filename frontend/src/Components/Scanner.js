import { useState, useContext, useEffect } from 'react'
import { ViewIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    IconButton,
    Text,
    Image,
} from "@chakra-ui/react";
import QrReader from "react-qr-reader";
import { Store } from '../Store';
import { getError } from '../util';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';


function Scanner() {
    const [selected, setSelected] = useState("environment");
    const [startScan, setStartScan] = useState(false);
    const [loadingScan, setLoadingScan] = useState(false);
    const [result, setResult] = useState("");
    const navigate = useNavigate()
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const handleScan = async (scanData) => {
        setLoadingScan(true);
        if (scanData && scanData !== "") {
            setStartScan(false);
            setLoadingScan(false);
                try {
                    const { data } = await axios.post('/api/users/check/barcode', {
                        uuid: scanData
                    })
                    ctxDispatch({ type: 'USER_SIGNIN', payload: data });
                    localStorage.setItem('userInfo', JSON.stringify(data));
                    navigate('/chat')
                } catch (err) {
                    toast.error(getError(err));
                }

        }
    };
    const handleError = (err) => {
        console.error(err);
    };

    return (
        <div>
            <div className="App">
                <button
                    onClick={() => {
                        setStartScan(!startScan);
                    }}
                >
                    {startScan ? "Stop Scan" : "Start Scan"}
                </button>
                {startScan && (
                    <>
                        <select onChange={(e) => setSelected(e.target.value)}>
                            <option value={"environment"}>Back Camera</option>
                            <option value={"user"}>Front Camera</option>
                        </select>
                        <QrReader
                            facingMode={selected}
                            delay={1000}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ width: "300px" }}
                        />
                    </>
                )}
                {loadingScan && <p>Loading</p>}
            </div>
        </div>
    )
}

export default Scanner
