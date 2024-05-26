import React, { useState } from 'react'
import { Container, Form, Button, ButtonGroup, Image, Row, Col, InputGroup } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'

import googleIcon from './../../assets/imgs/google.png'
import useAuth from '../../hooks/useAuth'
import Loading from '../../components/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import InputGroupText from 'react-bootstrap/esm/InputGroupText'

const Signup = () => {
    const { loading, handleRegister } = useAuth()
    const [account, setAccount] = useState({
        email: "",
        password: "",
        confirm: "",
    })
    const [showpassword, setShowPassword] = useState(false)
    const [showpConfirmassword, setShowConfirmPassword] = useState(false)
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState(false)
    const [isSignup, setIsSignup] = useState(false)
    const navigate = useNavigate()

    const handleInputChange = (event) => {
        const value = { ...account, [event.target.name]: event.target.value }
        setAccount(value)
    }
    const handleSignup = (e) => {
        e.preventDefault()
        setIsSignup(true)
        const result = handleRegister(account.email, account.password)
        setStatus(result.status)
        setMessage(result.message)
    }
    const chooseLogin = () => {
        navigate('/login')
    }
    const toggleShowPassword = () => {
        setShowPassword(!showpassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showpConfirmassword);
    };
    return (
        <Container className="100-w 100-h min-vh-100 d-flex justify-content-center align-items-center text-center overflow-hiddenFover" fluid={true} style={{ backgroundColor: "#C2F1EB" }} >
            <Row className='bg-white rounded-4 d-flex box-area w-75 h-50 mx-auto'>
                <Col sm={4} className='d-flex flex-column align-items-center justify-content-center rounded-start-4 text-light' style={{ backgroundColor: "#419489" }}>
                    <span className='h1 mb-2'>Hello!</span>
                    <span className='w-75'>Enter your personal details and start following conferences/magazines!</span>
                    <div className=' border border-1 p-2 mt-5 border-white rounded-2'>
                        <Link to='/' className='fs-6 text-light'>  {"<  "}Back to Homepage</Link>
                    </div>
                </Col>
                <Col className='p-5 d-flex flex-column align-items-center justify-content-center bg-skyblue-light rounded-end-4' >

                    <Form onSubmit={handleSignup} className='w-75 '>
                        <h1 className='mb-4 fw-bold' style={{ fontSize: "30px", color: "#419489" }}>Create Account</h1>
                        <Button className='border-0 w-100 p-2' style={{ backgroundColor: "#E8F1F3", color: "#434343" }}>
                            <Image src={googleIcon} width={20} className="me-2" />
                            You can join with your Google account
                        </Button>
                        <div className='d-flex flex-row align-items-center'>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'gray' }} />

                            <div><p className='pt-3 mx-3 text-color-black'>or create  your account here</p></div>

                            <div style={{ flex: 1, height: '1px', backgroundColor: 'gray' }} />
                        </div>
                        <Form.Group className="mb-2 text-start">
                            <Form.Label htmlFor="inputPassword5" className='fs-6 text-color-black'>Email</Form.Label>
                            <Form.Control
                                type="text"
                                name="email"
                                value={account.email}
                                placeholder="name@example.com"
                                onChange={handleInputChange}
                                required
                                className="border-0 shadow-sm rounded-2 px-3 py-2"
                            />
                        </Form.Group>
                        <Form.Group className="mb-4 text-start">
                            <Form.Label htmlFor="inputPassword5" className='fs-6 text-color-black'>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showpassword ? "text" : "password"}
                                    value={account.password}
                                    name="password"
                                    placeholder='Your password'
                                    onChange={handleInputChange}
                                    required
                                    className="border-0 shadow-sm rounded-start-2 px-3 py-2"

                                />
                                <InputGroup.Text onClick={toggleShowPassword} className='border-0 bg-white rounded-end shadow-sm '>
                                    {showpassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                </InputGroup.Text>

                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-4 text-start">
                            <Form.Label htmlFor="inputPassword5" className='fs-6 text-color-black'>Confirm password</Form.Label>
                          
                             <InputGroup>
                                <Form.Control
                                    type={showpassword ? "text" : "password"}
                                    value={account.confirm}
                                    name="confirm"
                                    placeholder='Your password'
                                    onChange={handleInputChange}
                                    required
                                    className="border-0 shadow-sm rounded-start-2 px-3 py-2"

                                />
                                <InputGroup.Text onClick={toggleShowConfirmPassword} className='border-0 bg-white rounded-end shadow-sm'>
                                    {showpConfirmassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                </InputGroup.Text>

                            </InputGroup>
                        </Form.Group>
                        {
                            !status && isSignup && message !== '' && <p className="text-danger">{message}</p>
                        }
                        <Button
                            type='submit'
                            className='border-0 fw-bold rounded-3 p-2'
                            style={{ width: "140px", fontSize: "20px", backgroundColor: "#419489" }}>
                            {
                                loading
                                    ?
                                    <Loading />
                                    :
                                    'SIGN UP'
                            }
                        </Button>
                        <div className="my-3  mx-5 d-flex align-items-center justify-content-center">
                            <span htmlFor="#signup">Already have an account?</span>
                            <Button
                                className='bg-transparent border-0 fw-bold'
                                style={{ fontSize: "20px", color: "#419489" }}
                                onClick={chooseLogin}>
                                <span>LOG IN</span>
                            </Button>
                        </div>
                    </Form>
                </Col>

            </Row>
        </Container>
    )
}

export default Signup