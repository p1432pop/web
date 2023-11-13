import React from 'react';
import { useState } from 'react';
import item1 from '../assets/item';
import item2 from '../assets/weapon';
import item from '../assets/consumable';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const CustomWidthTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
  ))({
	[`& .${tooltipClasses.tooltip}`]: {
	  maxWidth: 600,
	  padding: 0
	},
  });
export default function Guide(props) {
	const [view, setView] = useState();
	const radiodata = [
		{value:"all", label:"모든 아이템"},
		{value:"Weapon", label:"무기"},
		{value:"Dagger", label:"단검"},
		{value:"TwoHandSword", label:"양손검"},
		{value:"Axe", label:"도끼"},
		{value:"DualSword", label:"쌍검"},
		{value:"Pistol", label:"권총"},
		{value:"AssaultRifle", label:"돌격 소총"},
		{value:"SniperRifle", label:"저격총"},
		{value:"Rapier", label:"레이피어"},
		{value:"Spear", label:"창"},
		{value:"Hammer", label:"망치"},
		{value:"Bat", label:"방망이"},
		{value:"HighAngleFire", label:"투척"},
		{value:"DirectFire", label:"암기"},
		{value:"Bow", label:"활"},
		{value:"Crossbow", label:"석궁"},
		{value:"Glove", label:"글러브"},
		{value:"Tonfa", label:"톤파"},
		{value:"Guitar", label:"기타"},
		{value:"Nunchaku", label:"쌍절곤"},
		{value:"Whip", label:"채찍"},
		{value:"Camera", label:"카메라"},
		{value:"Arcana", label:"아르카나"},
		{value:"VFArm", label:"VF의수"},
		{value:"Armor", label:"방어구"},
		{value:"Chest", label:"옷"},
		{value:"Head", label:"머리"},
		{value:"Arm", label:"팔"},
		{value:"Leg", label:"다리"},
		{value:"Consume", label:"소모품"},
		{value:"Food", label:"음식"},
		{value:"Beverage", label:"음료"},
		{value:"SpecialConsume", label:"특수"},
		{value:"special1", label:"설치"},
		{value:"special2", label:"설치"},
		{value:"material1", label:"재료"},
		{value:"material2", label:"재료"}
	]
	const radiodatas = () => {
		let arr = [];
		radiodata.forEach((item) => {
			arr.push(
				<FormControlLabel key={item.value} value={item.value} control={<Radio />} label={item.label} />
			)
		})
		return arr;
	}
	const items = () => {
		let arr = [];
		item.forEach((it) => {
			if (it.itemType === 'Consume') {
				arr.push(
					<CustomWidthTooltip key={it.code} title={
						<>
							<div style={{display: 'flex', flexDirection: 'row', background: `linear-gradient(90deg, ${backcolorrgba(it.itemGrade)}`}}>
								<div>
									<p style={{fontWeight: 'bold', fontSize: '24px'}}>{it.name}</p>
									<p style={{fontWeight: 'bold', fontSize: '20px', color: backcolor(it.itemGrade)}}>{grade(it.itemGrade)}</p>
									<p style={{fontWeight: 'bold', fontSize: '20px'}}>{type(it.consumableType)}</p>
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
						<img onClick={()=>setView(it)} src={name(it.code, it.itemType, it.name)} alt='imag'  width='128' height='71' style={{backgroundColor: backcolor(it.itemGrade), margin: '4px'}}/>
					</CustomWidthTooltip>
				)
			}
			else {
				
			}
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
		if (consumableType === 'Beverage') return '음료';
		else if (consumableType === 'Food') return '음식';
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
	const backcolorrgba = (a) => {
		if (a === 'Uncommon') return 'rgba(0,255,0,0) 0%, rgba(0,255,0,1) 100%)';
		else if (a === 'Rare') return 'rgba(0,0,255,0) 0%, rgba(0,0,255,1) 100%)';
		else if (a === 'Epic') return 'rgba(255,0,255,0) 0%, rgba(255,0,255,1) 100%)';
		else if (a === 'Legend') return 'rgba(255,255,0,0) 0%, rgba(255,255,0,1) 100%)';
		else return 'rgba(20,20,20,0) 0%, rgba(20,20,20,1) 100%)';
	}
	const recover = (hp, sp) => {
		if (hp > 0) return `체력 재생 + ${hp}`;
		else return `스태미나 재생 + ${sp}`;
	}
	const consumeEffect = (hp, sp) => {
		if (hp > 0 && sp > 0) return '15초에 걸쳐 체력과 스태미나를 회복합니다.';
		else if (hp > 0) return '15초에 걸쳐 체력을 회복합니다.';
		else if (sp > 0) return '15초에 걸쳐 스태미나를 회복합니다.';
	}
	return (
		<div style={{maxWidth: '1080px', width: '100%', margin: 'auto'}}>
			<div style={{display: 'flex', flexDirection: 'row'}}>
				<div style={{background: "gray"}}>
					<FormControl>
						<RadioGroup
							defaultValue="all"
							name="radio-buttons-group"
						>
							{radiodatas()}
						</RadioGroup>
					</FormControl>
				</div>
				<div style={{maxWidth: '410px', overflow: 'auto', backgroundColor: "rgb(45, 45, 45)"}}>
					{items()}
				</div>
				<div>
					{view ? 
					<img src={name(view.code, 1, 1)} alt="img" width='128' height='71'/> 
					: ''}
				</div>
			</div>
		</div>
	);
};