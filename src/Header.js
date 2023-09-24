import React from 'react';
import Button from '@mui/material/Button';
//import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';

export default function Header(props) {
    return (
		<div style={{backgroundColor: 'black', height: '80px', minWidth: '620px'}}>
			<Stack style={{paddingTop: '11px', paddingLeft: '16px'}} direction="row" spacing={2}>
				<Button sx={{m: 1, color: 'white', fontSize: '24px'}} size="large" style={{textTransform: 'none'}} href="/">Lumia.kr</Button>
				<Button sx={{m: 1, color: 'white', fontSize: '24px'}} size="large" color="secondary" href="/">메인</Button>
				<Button sx={{m: 1, color: 'white', fontSize: '24px'}} size="large" href="/ranking">랭킹</Button>
				<Button sx={{m: 1, color: 'white', fontSize: '24px'}} size="large" >가이드</Button>
				<Button sx={{m: 1, color: 'white', fontSize: '24px'}} size="large" href="/statistics">통계</Button>
				<Button sx={{m: 1, color: 'white', fontSize: '24px'}} size="large" href="/routes">루트</Button>
			</Stack>
		</div>
    );
};