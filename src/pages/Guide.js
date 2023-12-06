import React from 'react';
import { useState } from 'react';

import armor from '../assets/armor';
import weapon from '../assets/weapon';
import consume from '../assets/consume';

import { getItemType, radiodata, name, grade, backcolor, backcolorrgba, recover, consumeEffect, weaponArmor } from '../utils/itemtype';

import Sheet from '@mui/joy/Sheet';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

import styles from '../style/Guide.module.css';


const CustomWidthTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
  ))({
	[`& .${tooltipClasses.tooltip}`]: {
	  maxWidth: 600,
	  padding: 0
	},
  });
export default function Guide(props) {
	const [view, setView] = useState("Weapon");
	const radioHandler = (ev) => {
		setView(ev.target.value);
	}
	const radiodatas = () => {
		let arr = [];
		radiodata.forEach((item) => {
			arr.push(
				<Sheet key={item.value} className={styles.Sheet}>
					<Radio label={item.label} value={item.value} disableIcon overlay slotProps={{
						action: ({ checked }) => (
							{
						sx: (theme) => ({
							...(checked && {
							'--variant-borderWidth': '2px',
							'&&': {
								borderColor: theme.vars.palette.primary[500],
							},
							}),
						}),
						}),
					}}/>
				</Sheet>
			)
		})
		return arr;
	}
	const items = () => {
		const value = getItemType(view)
		let arr = [];
		if (value === "Weapon") {
			weapon.forEach((it) => {
				if (view === "Weapon" || view === it.weaponType) {
					arr.push(
						<CustomWidthTooltip key={it.code} title={
							<>
								<div style={{display: 'flex', background: `linear-gradient(90deg, ${backcolorrgba(it.itemGrade)}`, padding: '8px'}}>
									<div>
										<p className={styles.itemName}>{it.name}</p>
										<p className={styles.itemEffect} style={{color: backcolor(it.itemGrade)}}>{grade(it.itemGrade)}</p>
									</div>
									<img className={styles.imgmd} src={name(it.code)} alt='img'/>
								</div>
								<div className={styles.itemDetail}>
									{weaponArmor(it)}
								</div>
							</>
						}>
							<img className={styles.imgsm} src={name(it.code)} alt='img' style={{backgroundColor: backcolor(it.itemGrade)}}/>
						</CustomWidthTooltip>
					)
				}
			})
		}
		else if (value === "Armor") {
			armor.forEach((it) => {
				if (view === "Armor" || view === it.armorType) {
					arr.push(
						<CustomWidthTooltip key={it.code} title={
							<>
								<div style={{display: 'flex', background: `linear-gradient(90deg, ${backcolorrgba(it.itemGrade)}`, padding: '8px'}}>
									<div>
										<p className={styles.itemName}>{it.name}</p>
										<p className={styles.itemEffect} style={{color: backcolor(it.itemGrade)}}>{grade(it.itemGrade)}</p>
									</div>
									<img className={styles.imgmd} src={name(it.code)} alt='img'/>
								</div>
								<div className={styles.itemDetail}>
									{weaponArmor(it)}
								</div>
							</>
						}>
							<img className={styles.imgsm} src={name(it.code)} alt='img' style={{backgroundColor: backcolor(it.itemGrade)}}/>
						</CustomWidthTooltip>
					)
				}
			})
		}
		else if (value === "Consume") {
			consume.forEach((it) => {
				if (view === "Consume" || view === it.consumableType) {
					arr.push(
						<CustomWidthTooltip key={it.code} title={
							<>
								<div style={{display: 'flex', background: `linear-gradient(90deg, ${backcolorrgba(it.itemGrade)}`, padding: '8px'}}>
									<div>
										<p className={styles.itemName}>{it.name}</p>
										<p className={styles.itemEffect} style={{color: backcolor(it.itemGrade)}}>{grade(it.itemGrade)}</p>
									</div>
									<img className={styles.imgmd} src={name(it.code)} alt='img'/>
								</div>
								<div className={styles.itemDetail}>
									<p>{recover(it.hpRecover, it.spRecover)}</p>
									<p>소비 효과</p>
									<p>{consumeEffect(it.hpRecover, it.spRecover)}</p>
								</div>
							</>
						}>
							<img className={styles.imgsm} src={name(it.code)} alt='img' style={{backgroundColor: backcolor(it.itemGrade)}}/>
						</CustomWidthTooltip>
					)
				}
			})
		}
		return arr;
	}
	return (
		<div className={styles.content}>
			<div style={{margin: '16px'}}>최근 업데이트 : 2023/12/07</div>
			<div>
				<RadioGroup defaultValue="Weapon" className={styles.RadioGroup} onChange={radioHandler} value={view}>
					{radiodatas()}
				</RadioGroup>
			</div>
			<div>
				{items()}
			</div>
		</div>
	);
};