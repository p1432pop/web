import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const Main = (props) => {
	return (
		<>
			<h3>안녕하세요. 메인페이지 입니다.</h3>
            <Button variant="text">Text</Button>
            <Link to="/ranking">1번상품</Link>
		</>
	);
};

export default Main;