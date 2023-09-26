import React from 'react';
import mainimage from '../assets/1920.png';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

import SearchIcon from '@mui/icons-material/Search';
import FiberNewIcon from '@mui/icons-material/FiberNew';

export default function Main(props) {
	const mainImage = {
		position: 'relative',
		left: `calc(50% - 1280px)`,
		width: '2560px',
		height: '1080px',
		backgroundImage: `url('${mainimage}')`,
	}
	const patchNotes = () => {
		let arr = [];
		let Links = [
			{url: "https://playeternalreturn.com/posts/news/1424", text: "1.4 패치 노트 보기"},
			{url: "https://playeternalreturn.com/posts/news/1381", text: "1.3 패치 노트 보기"},
			{url: "https://playeternalreturn.com/posts/news/1354", text: "1.2 패치 노트 보기"}
		]
		for (let i=0; i<Links.length; i++) {
			arr.push(<Link key={i} href={Links[i].url} underline='none'>{Links[i].text}</Link>);
		}
		return arr;
	}
	return (
		<div>
			<div style={mainImage}>
				<div>
					<div>
						<Box sx={{display: 'flex', alignItems: 'center', position: 'absolute', top: '25%', left: `calc(50% - 300px)`, width: 600, height: 60, backgroundColor: 'white'}}>
							<InputBase
								sx={{ml: 3, minWidth: '520px'}}
								placeholder="플레이어 검색"
								inputProps={{'aria-label': '플레이어 검색'}}
								onKeyDown={(ev) => {
									if (ev.key === 'Enter') {
										console.log(ev.target.value);
									}
								}}
							/>
							<IconButton type="button" sx={{p: '10px'}} aria-label="search">
								<SearchIcon sx={{color:'black'}}/>
							</IconButton>
						</Box>
					</div>
					<div>
						<Box sx={{position: 'absolute',top: '40%',left: `calc(20%)`,width: 210,height: 210,backgroundColor: 'white',}}>
							<div>
								<Stack style={{paddingLeft: '20px'}} spacing={2}>
									<div style={{paddingTop: '16px'}}>
										- 최근 패치 노트
									</div>
									<Stack direction="row" spacing={0.5}>
										<Link href="https://playeternalreturn.com/posts/news/1447" underline='none'>1.5 패치 노트 보기</Link>
										<FiberNewIcon style={{height: '21px'}}/>
									</Stack>
									{patchNotes()}
								</Stack>
							</div>
						</Box>
					</div>
				</div>
			</div>
			<div>
				정규시즌1 랭크 순위표
			</div>
		</div>
	);
};