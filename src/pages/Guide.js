import React from 'react';
import item from '../assets/item';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
export default function Guide(props) {
	const items = () => {
		let arr = [];
		item.forEach((it) => {
			arr.push(
				<Tooltip key={it.code} title={
					<div>
						{it.name}
						<img src={name(it.armorType, it.name)} alt='imag' width='128' height='71'/>
					</div>
				}>
					<img src={name(it.armorType, it.name)} alt='imag'  width='128' height='71' style={{backgroundColor: backcolor(it.itemGrade), margin: '4px'}}/>
				</Tooltip>
				)
		})
		return arr;
	}
	const datas = () => {
		console.log(item)
	}
	const name = (armorType, Name) => {
		return '/image/Armor/' + armorType + '/' + Name + '.png';
	}
	const backcolor = (a) => {
		if (a === 'Uncommon') return 'green';
		else if (a === 'Rare') return 'blue';
		else if (a === 'Epic') return 'purple';
		else if (a === 'Legend') return 'yellow';
		else return 'gray';
	}
	return (
		<>
			<Button onClick={datas}>데이터보기</Button>
			<h3>가이드</h3>
			{items()}
		</>
	);
};