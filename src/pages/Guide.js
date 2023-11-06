import React from 'react';
import item1 from '../assets/item';
import item2 from '../assets/weapon';
import item from '../assets/consumable';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const CustomWidthTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
  ))({
	[`& .${tooltipClasses.tooltip}`]: {
	  maxWidth: 600,
	  backgroundColor: 'black'
	},
  });
export default function Guide(props) {
	const items = () => {
		let arr = [];
		item.forEach((it) => {
			arr.push(
				<CustomWidthTooltip key={it.code} title={
					<>
						<div style={{display: 'flex', flexDirection: 'row'}}>
							<div>
								<p style={{fontWeight: 'bold', fontSize: '24px'}}>{it.name}</p>
								<p style={{fontSize: '20px', color: backcolor(it.itemGrade)}}>{grade(it.itemGrade)}</p>
								<p style={{fontSize: '20px'}}>{type(it.consumableType)}</p>
							</div>
							<img src={name(it.code, it.itemType, it.name)} alt='imag' width='256' height='142'/>
						</div>
						<div>
							{recover(it.hpRecover, it.spRecover)}<br />
							소비 효과<br />
							{consumeEffect(it.hpRecover, it.spRecover)}
							{it.makeMaterial1}
						</div>
					</>
				}>
					<img src={name(it.code, it.itemType, it.name)} alt='imag'  width='128' height='71' style={{backgroundColor: backcolor(it.itemGrade), margin: '4px'}}/>
				</CustomWidthTooltip>
				)
		})
		return arr;
	}
	const datas = () => {
		console.log(item)
	}
	const name = (itemType, armorType, Name) => {
		return `/image/Icon/${itemType}.png`;	
	}
	const type = (consumableType) => {
		if (consumableType === 'Beverage') {
			return '음료';
		}
		else if (consumableType === 'Food') {
			return '음식';
		}
	}
	const grade = (Grade) => {
		if (Grade === 'Uncommon') return '고급';
		else if (Grade === 'Rare') return '희귀';
		else if (Grade === 'Epic') return '영웅';
		else if (Grade === 'Legend') return '전설';
		else return '일반';
	}
	const backcolor = (a) => {
		if (a === 'Uncommon') return 'green';
		else if (a === 'Rare') return 'blue';
		else if (a === 'Epic') return 'purple';
		else if (a === 'Legend') return 'yellow';
		else return 'gray';
	}
	const recover = (hp, sp) => {
		if (hp > 0) return `체력 재생 + ${hp}`;
		else return `스태미나 재생 + ${sp}`;
	}
	const consumeEffect = (hp, sp) => {
		if (hp > 0 && sp > 0) {
			return '15초에 걸쳐 체력과 스태미나를 회복합니다.';
		}
		else if (hp > 0) {
			return '15초에 걸쳐 체력을 회복합니다.';
		}
		else if (sp > 0) {
			return '15초에 걸쳐 스태미나를 회복합니다.';
		}
		else {

		}
	}
	return (
		<>
			<Button onClick={datas}>데이터보기</Button>
			<h3>가이드</h3>
			<div style={{maxWidth: '1200px'}}>
				{items()}
			</div>
		</>
	);
};