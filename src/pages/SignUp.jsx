import React, {useState} from 'react';

import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormControl from '@mui/material/FormControl';
import Container from '@mui/material/Container';
import FormHelperText from '@mui/material/FormHelperText';

import styles from '../style/SignUp.module.css';

import axios from 'axios';

export default function SignUp(props) {
    const validationCode = "seoultech"
    const navigate = useNavigate();
    const [idError, setIdError] = useState("")
    const [passwordState, setPasswordState] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [validationError, setValidationError] = useState("")
    const onhandlePost = async (data) => {
        const { id, password, validation } = data
        console.log(id, password)
        const result = await axios.post('/member', {
            id: id,
            password: password,
            validation: validation
        })
        if (result.data === '중복') {
            setIdError("이미 존재하는 아이디입니다.")
        }
        else if (result.data === '성공') {
            alert("회원가입을 축하드립니다.")
            navigate(`/`);
        }
        console.log(result)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
    
        const data = new FormData(e.currentTarget)
        const joinData = {
          id: data.get("id"),
          validation: data.get("validation"),
          password: data.get("password"),
          rePassword: data.get("rePassword"),
        }
        const { id, validation, password, rePassword } = joinData
    
        // 아이디 유효성 체크
        const idRegex = /^(?=.*[a-z])(?=.*[0-9]).{5,20}$/
        if (!idRegex.test(id)) setIdError("아이디: 5~20자의 영문 소문자, 숫자만 사용 가능합니다.")
        else setIdError("")
    
        // 비밀번호 유효성 체크
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/
        if (!passwordRegex.test(password))
          setPasswordState("비밀번호: 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.")
        else setPasswordState("")
    
        // 비밀번호 같은지 체크
        if (password !== rePassword)
          setPasswordError("비밀번호가 일치하지 않습니다.")
        else setPasswordError("")
    
        // 인증 코드 검사
        if (validation !== validationCode)
          setValidationError("인증 코드가 일치하지 않습니다.")
        else setValidationError("")
    
        if (
          idRegex.test(id) &&
          passwordRegex.test(password) &&
          password === rePassword &&
          validation === validationCode
        ) {
          onhandlePost(joinData)
        }
    }
    return (
        <Container component="main" maxWidth="xs">
            <div className={styles.formBox}>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <FormControl component="fieldset" variant="standard">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField required autoFocus fullWidth type="id" id="id" name="id" label="아이디" error={idError !== "" || false}/>
                            </Grid>
                            <FormHelperText>{idError}</FormHelperText>
                            <Grid item xs={12}>
                                <TextField required fullWidth type="password" id="password" name="password" label="비밀번호" error={passwordState !== "" || false}/>
                            </Grid>
                            <FormHelperText>{passwordState}</FormHelperText>
                            <Grid item xs={12}>
                                <TextField required fullWidth type="password" id="rePassword" name="rePassword" label="비밀번호 재입력" error={passwordError !== "" || false}/>
                            </Grid>
                            <FormHelperText>{passwordError}</FormHelperText>
                            <Grid item xs={12}>
                                <TextField required fullWidth type="password" id="validation" name="validation" label="인증 코드" error={validationError !== "" || false}/>
                            </Grid>
                            <FormHelperText>{validationError}</FormHelperText>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} size="large">
                            회원가입
                        </Button>
                    </FormControl>
                </Box>
            </div>
        </Container>
    );
}