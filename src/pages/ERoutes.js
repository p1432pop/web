import React from 'react';
import mainimage from '../assets/1920.png';

export default function ERoutes(props) {
	const mainImage = {
		backgroundImage: `url('${mainimage}')`,
		
	}
	return (
		<div>
			<img src={mainimage} alt='im' style={{display: 'block', margin: 'auto'}}></img>
		</div>
	);
};