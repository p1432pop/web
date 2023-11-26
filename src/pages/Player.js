import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loadPlayer } from '../playerSlice';

export default function Player(props) {
    const value = useSelector((state) => state.player);
    const dispatch = useDispatch();
    const plyaerHandler = () => {
		dispatch(loadPlayer('아담라'));
	};
    return (
        <>
            <button onClick={plyaerHandler}>1</button>
        </>
    );
}