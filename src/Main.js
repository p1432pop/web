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
		opacity: 0.7,
		position: 'relative',
		left: `calc(50% - 1280px)`,
		width: '2560px',
		height: '1440px',
		backgroundImage: `url('${mainimage}')`
	}
	return (
		<div>
			<div style={mainImage}>
				<div>
					<Box sx={{position: 'absolute', top: '25%', left: `calc(50% - 400px)`, width: 600, height: 56, backgroundColor: 'white'}}>
						<Stack direction="row" spacing={2}>
							<InputBase
								sx={{ ml: 10, flex: 1, color: 'black', opacity: 1}}
								placeholder="플레이어 검색"
								inputProps={{ 'aria-label': '플레이어 검색' }}
							/>
							<IconButton type="button" sx={{ p: '10px' }} aria-label="search">
								<SearchIcon />
							</IconButton>
						</Stack>
					</Box>
				</div>
				<div>
					<Box sx={{position: 'absolute',top: '40%',left: `calc(20%)`,width: 300,height: 300,backgroundColor: 'white',}}>
						<div>
							<Stack style={{paddingLeft: '10px'}} spacing={2}>
								<div style={{paddingTop: '12px'}}>
									- 최근 패치 노트
								</div>
								<Stack direction="row" spacing={0.5}>
									<Link href="https://playeternalreturn.com/posts/news/1424" underline="none">
										{'1.4 패치 노트 보기'}
									</Link>
									<FiberNewIcon />
								</Stack>
								<Link href="https://playeternalreturn.com/posts/news/1381" underline="none">
									{'1.3 패치 노트 보기'}
								</Link>
								<Link href="https://playeternalreturn.com/posts/news/1354" underline="none">
									{'1.2 패치 노트 보기'}
								</Link>
								<Link href="https://playeternalreturn.com/posts/news/1328" underline="none">
									{'1.1 패치 노트 보기'}
								</Link>
							</Stack>
						</div>
					</Box>
				</div>
			</div>
			<div>
				정규시즌1 랭크 순위표
			</div>
		</div>
	);
};