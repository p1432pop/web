import React from 'react';
import axios from 'axios';
export default function Ranking(props) {
	let data = [<div>1234</div>];
	async function getRanking() {
		await axios.get('/rank/1').then((res) => {
			console.log(res.data);
			for(let i=0; i<10; i++) {
				data.push(<div>res.data[i].nickname</div>);
			}
		});
	}
	return (
		<>
			<h3>랭킹</h3>
			<button onClick={getRanking}>button1</button>
			{data}
		</>
	);
};