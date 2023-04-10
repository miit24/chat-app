import { useEffect, useContext, useState } from 'react'
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import '../index.css'
import { Button } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getError } from '../util';

function OtpScreen() {

    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const [otp, setOtp] = useState()
    const [loading, setLoading] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault();
        if (otp < 1000) {
            toast.error("Invalid Otp")
        }

        try {
            setLoading(true)
            const { data } = await axios.post('api/users/otp', {
                otp,
                id:userInfo.auth,
                userId:userInfo._id
            }, {
                headers: { authorization: `Bearer ${userInfo.token}` }
            })
            setLoading(false)
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/chat')
            
        } catch (error) {
            toast.error(getError(error))
        }
    }

    useEffect(() => {
        if (!userInfo) {
            navigate('/')
        }
        else {
            if (!userInfo.auth) {
                ctxDispatch({ type: 'USER_LOGOUT' })
                navigate('/')
            }
        }
    }, [])

    return (
        <div>
            <form>
                <div className="otp-input-wrapper">
                    <input
                        type="number"
                        maxLength="4"
                        pattern="[0-9]*"
                        autoComplete="off"
                        onChange={(e) => {
                            setOtp(e.target.value)
                        }}
                    />
                    <svg viewBox="0 0 240 1" xmlns="http://www.w3.org/2000/svg">
                        <line x1="0" y1="0" x2="240" y2="0" stroke="#3e3e3e" strokeWidth="2" strokeDasharray="44,22" />
                    </svg>
                </div>
                <br />
                <br />
                <Button onClick={submitHandler}>Submit</Button>
            </form>
        </div>
    )
}

export default OtpScreen
