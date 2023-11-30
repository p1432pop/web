import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadPlayer } from '../playerSlice';

import styles from '../style/Player.module.css';

export default function Player(props) {
    const value = useSelector((state) => state.play);
    const params = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadPlayer(params.nickname));
    }, [params, dispatch]);
    return (
        <>

            <div className={styles.container}>
                123
            </div>
        </>
    );
}