import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadPlayer } from '../playerSlice';

import styles from '../style/Player.module.css';

import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

export default function Player(props) {
    const value = useSelector((state) => state.player);
    const params = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadPlayer(params.nickname));
    }, [params, dispatch]);
    const profileImage = () => {
        return (<img alt="img" src={`../image/CharacterIcon/6.png`} />)
    }
    if (value.onload) {
        if (value.loading === 200 || value.loading === 204) {
            return (
                <div className={styles.container}>
                    <div className={styles.profile}>
                        <img alt="img" src={`../image/CharacterIcon/6.png`}/>
                        <div className={styles.profileContent}>
                            <Chip label="레벨 : 120" variant="outlined"/>
                            아낌없이담는라면
                            {value.loading === 200
                            ? 
                            <Button className={styles.notAllowedButton} variant="outlined">갱신 불가</Button>
                            : 
                            <Button variant="outlined">갱신 가능</Button>}
                            최근 갱신 시간
                        </div>
                        정규시즌2 랭크 게임에 대한 정보만 제공합니다.
                    </div>
                </div>
            )
        }
        else if (value.loading === 404) {
            return (
                <div className={styles.container}>
                    <div className={styles.flexCenter}>
                        <div className={styles.content}>
                            <div className={styles.nicknameBox}>{params.nickname}</div>
                            해당 닉네임의 플레이어를 찾을 수 없습니다.<br></br>
                            다시 검색해 주세요.
                        </div>
                    </div>
                </div>
            )
        }
    }
    return (
        <>
            <div className={styles.container}>
                <CircularProgress />
                {params.nickname}
                플레이어를 검색하고 있습니다. 잠시만 기다려 주세요.
            </div>
        </>
    );
}