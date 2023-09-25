import React from 'react';
//import Button from '@mui/material/Button';
import mainimage from './1920.png';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import Link from '@mui/material/Link';
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
		let hrefs = ["https://playeternalreturn.com/posts/news/1424",
					 "https://playeternalreturn.com/posts/news/1381",
					 "https://playeternalreturn.com/posts/news/1354",
					 "https://playeternalreturn.com/posts/news/1328"];
		let labels = ["1.4 패치 노트 보기",
					  "1.3 패치 노트 보기",
					  "1.2 패치 노트 보기",
					  "1.1 패치 노트 보기"];
		for (let i=0; i<4; i++) {
			if (i === 0) {
				arr.push(
				<Stack key={i} direction="row" spacing={0.5}>
					<Link href={hrefs[i]} underline='none'>{labels[i]}</Link>
					<FiberNewIcon />
				</Stack>);
			}
			else {
				arr.push(<Link key={i} href={hrefs[i]} underline='none'>{labels[i]}</Link>);
			}
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
								inputProps={{ 'aria-label': '플레이어 검색' }}
								onKeyDown={(ev) => {
									if (ev.key === 'Enter') {
										console.log(ev.target.value);
									}
								}}
							/>
							<IconButton type="button" sx={{ p: '10px' }} aria-label="search">
								<SearchIcon />
							</IconButton>
						</Box>
					</div>
					<div>
						<Box sx={{position: 'absolute',top: '40%',left: `calc(20%)`,width: 300,height: 300,backgroundColor: 'white',}}>
							<div>
								<Stack style={{paddingLeft: '10px'}} spacing={2}>
									<div style={{paddingTop: '12px'}}>
										- 최근 패치 노트
									</div>
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