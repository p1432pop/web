import React from 'react';
import axios from 'axios';
export default function Ranking(props) {
	async function getRanking() {
		await axios.get('/rank').then((res) => {
			console.log(res.data);
		});
	}
	return (
		<>
			<h3>랭킹</h3>
			<button onClick={getRanking}>button1</button>
		</>
	);
};