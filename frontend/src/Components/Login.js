import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { Center, Box, FormControl, FormLabel, Input, Checkbox, Stack, Button, Heading, useColorModeValue } from '@chakra-ui/react';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../util';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from "react-helmet-async";

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/login', {
                email,
                password
            })
            if(!data.verify)
            {
                toast.error("Verify Your Email")
                navigate('/')
                return
            }
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/chat')
        } catch (err) {
            toast.error(getError(err));
        }
    }

    useEffect(()=>{
        if(userInfo){
            if(userInfo.auth){
                navigate('/otp')
            }
        }
    },[])

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Login</Heading>
                </Stack>
                <form onSubmit={submitHandler}>
                    <Box
                        rounded={'lg'}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl>
                                <FormLabel>Email address</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    required
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                    }}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input type="password"
                                    value={password}
                                    required
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }} />
                            </FormControl>
                            <Stack spacing={10}>
                                <Button
                                    bg={'blue.400'}
                                    color={'white'}
                                    type='submit'
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Login
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </form>
            </Stack>
        </>
    )
}

export default Login
