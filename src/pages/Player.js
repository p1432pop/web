import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadPlayer } from '../playerSlice';

import styles from '../style/Player.module.css';

import { getTierImg, getTierName } from '../utils/tier';

import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
export default function Player(props) {
    const value = useSelector((state) => state.player);
    const params = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadPlayer(params.nickname));
    }, [params, dispatch]);
    const itemImg = (list) => {
        console.log(list)
        let arr = [];
        list.forEach((item)=> {
            arr.push(<img className={styles.itemImg} alt="img" src={`../image/Icon/${item}.png`} />)
        })
        return arr;
    }
    const gameBox = () => {
        let arr = [];
        value.games.forEach((game) => {
            let equip = (JSON.parse(game.equipment))
            arr.push(
            <div className={styles.gameContainer}>
                <div>#{game.gameRank}</div>
                <div>{parseInt(game.duration/60)}:{game.duration%60}</div>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                    <Avatar className={styles.smallAvatar}>{game.characterLevel}</Avatar>
                    }
                >
                    <Avatar className={styles.avatarChar} alt="img" src={`../image/CharacterIcon/${game.characterNum}.png`} />
                </Badge>
                <div>{new Date(game.startDtm).toLocaleString('ko-KR')}</div>
                <div>
                    {game.teamKill} / {game.playerKill} / {game.playerAssistant}
                </div>
                <div>
                딜량 : {game.damageToPlayer}
                </div>
                <div>
                {game.mmrGain > 0 ? <ExpandLessIcon className={styles.redIcon} /> : 
                (game.mmrGain < 0 ? <ExpandMoreIcon className={styles.blueIcon} /> : <ExpandMoreIcon className={styles.blackIcon} />)}
                    
                </div>
                <div>
                {game.mmrAfter}
                    
                </div>
                <div>
                    equip : {equip['0']}
                </div>
            </div>)
        })
        return arr;
    }
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
		  	backgroundColor: theme.palette.common.black,
		  	color: theme.palette.common.white,
			textAlign: 'center'
		},
		[`&.${tableCellClasses.body}`]: {
		  	fontSize: 16,
			textAlign: 'center'
		},
	}));
	  
	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
		},
		// hide last border
		'&:last-child td, &:last-child th': {
		  	border: 0,
		},
	}));
    if (value.onload) {
        if (value.loading === 200 || value.loading === 204) {
            return (
                <div className={styles.container}>
                    <div className={styles.profile}>
                        <img alt="img" src={`../image/CharacterIcon/${value.characterCode}.png`}/>
                        <div className={styles.profileContent}>
                            <Chip label={`레벨 : ${value.level}`} variant="outlined"/>
                            {params.nickname}
                            {value.state
                            ? 
                            <Button variant="outlined">갱신 가능</Button>
                            : 
                            <Button className={styles.notAllowedButton} variant="outlined">갱신 불가</Button>}
                            최근 갱신 시간 : {value.updated}
                        </div>
                        정규시즌2 랭크 게임에 대한 정보만 제공합니다.
                    </div>
                    <div className={styles.tier}>
                        <img className={styles.avatarTier} src={"../"+getTierImg(value.mmr, 500)} alt='img'/>
                        
                    </div>
                    <div>
                        통계
                    </div>
                    <div>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>순위</StyledTableCell>
                                        <StyledTableCell>실험체</StyledTableCell>
                                        <StyledTableCell>Trait/Tactical</StyledTableCell>
                                        <StyledTableCell>TK / K / A</StyledTableCell>
                                        <StyledTableCell>딜량</StyledTableCell>
                                        <StyledTableCell>RP</StyledTableCell>
                                        <StyledTableCell>아이템</StyledTableCell>
                                        <StyledTableCell>플레이</StyledTableCell>
                                        <StyledTableCell>더보기</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {value.games.map((game, idx) => (
                                        <StyledTableRow
                                        key={idx}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <StyledTableCell>#{game.gameRank}</StyledTableCell>
                                            <StyledTableCell>
                                                <Badge
                                                    overlap="circular"
                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                    badgeContent={<Avatar className={styles.smallAvatar}>{game.characterLevel}</Avatar>}
                                                >
                                                    <Avatar className={styles.avatarChar} alt="img" src={`../image/CharacterIcon/${game.characterNum}.png`} />
                                                </Badge>
                                            </StyledTableCell>
                                            <StyledTableCell>{1}</StyledTableCell>
                                            <StyledTableCell>{game.teamKill} / {game.playerKill} / {game.playerAssistant}</StyledTableCell>
                                            <StyledTableCell>{game.damageToPlayer}</StyledTableCell>
                                            <StyledTableCell>
                                                <div className={styles.flexCenter}>
                                                    {game.mmrAfter}
                                                    {game.mmrGain > 0 ? <ExpandLessIcon className={styles.redIcon} /> : 
                                                    (game.mmrGain < 0 ? <ExpandMoreIcon className={styles.blueIcon} /> : <ExpandMoreIcon className={styles.blackIcon} />)}
                                                    {Math.abs(game.mmrGain)}
                                                </div>
                                            </StyledTableCell>  
                                            <StyledTableCell>{itemImg(game.equipment)}</StyledTableCell>
                                            <StyledTableCell>{parseInt(game.duration/60)}:{game.duration%60}</StyledTableCell>
                                            <StyledTableCell>+</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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