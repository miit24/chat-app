import React from 'react'
import axios from 'axios'
import { useContext, useEffect, useState, useReducer } from 'react';
import { Center, Box, FormControl, FormLabel, Input, Checkbox, Stack, Button, Heading, Text, useColorModeValue, Container } from '@chakra-ui/react';
import { InputGroup, HStack, InputRightElement } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import Loading from './Loading';
import { getError } from '../util';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
            return { ...state, loadingUpload: false, errorUpload: '', };
        case 'UPLOAD_FAIL':
            return { ...state, loadingUpload: false, errorUpload: action.payload };
        default:
            return state;
    }
};


function Signup() {
    const navigate = useNavigate();
    const [load, setLoad] = useState(false)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [image, setImage] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, loadingUpload }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        try {
            dispatch({ type: 'UPLOAD_REQUEST' });
            const { data } = await axios.post('/api/upload', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (data === "fatal error") {
                toast.error('Whoops empty file');
                dispatch({ type: 'UPLOAD_FAIL', payload: "Whoops empty file" });
                return
            }
            dispatch({ type: 'UPLOAD_SUCCESS' });
            setImage(data.secure_url);
            toast.success('Image uploaded successfully');
        } catch (err) {
            toast.error(err);
            dispatch({ type: 'UPLOAD_FAIL', payload: err });
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            setLoad(true)
            const { data } = await axios.post('api/users/signup', {
                name,
                email,
                password,
                image: image ? image : null
            });
            setLoad(false)
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/otp')
        } catch (err) {
            toast.error(getError(err));
        }
    }

    return (
        <>
            {
                load === true ? <Loading></Loading> :
                    <div>
                        <Helmet>
                            <title>Signup</title>
                        </Helmet>
                        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                            <Stack align={'center'}>
                                <Heading fontSize={'4xl'} textAlign={'center'}>
                                    Sign up
                                </Heading>
                            </Stack>
                            <form onSubmit={submitHandler}>
                                <Box
                                    rounded={'lg'}
                                    // bg={useColorModeValue('white', 'gray.700')}
                                    boxShadow={'lg'}
                                    p={8}>
                                    <Stack spacing={4}>
                                        <FormControl id="name" isRequired>
                                            <FormLabel>Name</FormLabel>
                                            <Input
                                                type="text"
                                                value={name}
                                                required
                                                onChange={(e) => {
                                                    setName(e.target.value)
                                                }} />
                                        </FormControl>
                                        <FormControl id="email" isRequired>
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
                                        <FormControl id="password1" isRequired>
                                            <FormLabel>Password</FormLabel>
                                            <InputGroup>
                                                <Input type="password"
                                                    value={password}
                                                    required
                                                    onChange={(e) => {
                                                        setPassword(e.target.value)
                                                    }} />
                                            </InputGroup>
                                        </FormControl>
                                        <FormControl id="password" isRequired>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <InputGroup>
                                                <Input type="password"
                                                    value={confirm}
                                                    required
                                                    onChange={(e) => {
                                                        setConfirm(e.target.value)
                                                    }}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormControl id="pic2" display={'none'}>
                                            <FormLabel>Image</FormLabel>
                                            <InputGroup>
                                                <Input type="text"
                                                    value={image}
                                                    onChange={(e) => {
                                                        setImage(e.target.value)
                                                    }}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormControl id="pic">
                                            <FormLabel>Upload Profile</FormLabel>
                                            <InputGroup>
                                                <Input type="file" onChange={uploadFileHandler}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <Stack spacing={10} pt={2}>
                                            <Button
                                                disabled={loadingUpload}
                                                loadingText="Submitting"
                                                size="lg"
                                                type='submit'
                                                bg={'blue.400'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'blue.500',
                                                }}>
                                                Sign up
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </form>
                        </Stack>
                    </div>
            }
        </>
    )
}

export default Signup
