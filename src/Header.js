import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function Header(props) {
    return (
		<div>
			<ButtonGroup variant="text" aria-label="text button group">
				<Button href="/">메인</Button>
				<Button href="/ranking">랭킹</Button>
				<Button>가이드</Button>
				<Button href="/statistics">통계</Button>
				<Button href="/routes">루트</Button>
			</ButtonGroup>
		</div>
    );
};