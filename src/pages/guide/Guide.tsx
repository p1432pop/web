import React from "react";
import { useState, useEffect } from "react";
import { Api } from "../../axios/axios";
import Loading from "../../components/Loading";
import { getItemType, radiodata, name, grade, backcolor, backcolorrgba, recover, consumeEffect, weaponArmor } from "../../utils/itemtype";

import Sheet from "@mui/joy/Sheet";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

import styles from "./Guide.module.css";
import { ItemConsumableDTO, ItemWearableDTO } from "../../axios/dto/item/item.dto";
import { JSX } from "react/jsx-runtime";

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)({
	[`& .${tooltipClasses.tooltip}`]: {
		maxWidth: 600,
		padding: 0,
	},
});
export default function Guide() {
	const [view, setView] = useState("Weapon");
	const [item, setItem] = useState<ItemWearableDTO[] | ItemConsumableDTO[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const setup = async () => {
			const result = await Api.getItemWeapon();
			setItem(result);
			setLoading(false);
		};
		setup();
	}, []);
	const radioHandler = async (ev: React.ChangeEvent<HTMLInputElement>) => {
		const type = (ev.target as HTMLInputElement).value;
		const itemType = getItemType(type);
		const param = type === itemType ? undefined : type;
		setView(type);
		if (itemType === "Weapon") {
			const result = await Api.getItemWeapon(param);
			setItem(result);
			return;
		}
		if (itemType === "Armor") {
			const result = await Api.getItemArmor(param);
			setItem(result);
			return;
		}
		if (itemType === "Consume") {
			const result = await Api.getItemConsumable(param);
			setItem(result);
			return;
		}
	};
	const radiodatas = () => {
		let arr: JSX.Element[] = [];
		radiodata.forEach((item) => {
			arr.push(
				<Sheet key={item.value} className={styles.Sheet}>
					<Radio
						label={item.label}
						value={item.value}
						disableIcon
						overlay
						slotProps={{
							action: ({ checked }) => ({
								sx: (theme) => ({
									...(checked && {
										"--variant-borderWidth": "2px",
										"&&": {
											borderColor: theme.vars.palette.primary[500],
										},
									}),
								}),
							}),
						}}
					/>
				</Sheet>
			);
		});
		return arr;
	};
	const wearableTooltip = (item: ItemWearableDTO) => {
		return (
			<CustomWidthTooltip
				key={item.code}
				title={
					<>
						<div style={{ display: "flex", background: `linear-gradient(90deg, ${backcolorrgba(item.itemGrade)}`, padding: "8px" }}>
							<div>
								<p className={styles.itemName}>{item.name}</p>
								<p className={styles.itemEffect} style={{ color: backcolor(item.itemGrade) }}>
									{grade(item.itemGrade)}
								</p>
							</div>
							<img className={styles.imgmd} src={name(item.code)} alt="img" />
						</div>
						<div className={styles.itemDetail}>{weaponArmor(item)}</div>
					</>
				}
			>
				<div className={styles.itemBox}>
					<img className={styles.imgsm} src={name(item.code)} alt="img" style={{ backgroundColor: backcolor(item.itemGrade) }} />
					{item.name}
				</div>
			</CustomWidthTooltip>
		);
	};
	const consumableTooltip = (item: ItemConsumableDTO) => {
		return (
			<CustomWidthTooltip
				key={item.code}
				title={
					<>
						<div style={{ display: "flex", background: `linear-gradient(90deg, ${backcolorrgba(item.itemGrade)}`, padding: "8px" }}>
							<div>
								<p className={styles.itemName}>{item.name}</p>
								<p className={styles.itemEffect} style={{ color: backcolor(item.itemGrade) }}>
									{grade(item.itemGrade)}
								</p>
							</div>
							<img className={styles.imgmd} src={name(item.code)} alt="img" />
						</div>
						<div className={styles.itemDetail}>
							<p>{recover(item.hpRecover, item.spRecover)}</p>
							<p>소비 효과</p>
							<p>{consumeEffect(item.hpRecover, item.spRecover)}</p>
						</div>
					</>
				}
			>
				<div className={styles.itemBox}>
					<img className={styles.imgsm} src={name(item.code)} alt="img" style={{ backgroundColor: backcolor(item.itemGrade) }} />
					{item.name}
				</div>
			</CustomWidthTooltip>
		);
	};
	const items = () => {
		const value = getItemType(view);
		let arr: JSX.Element[] = [];
		if (value === "Weapon" || value === "Armor") {
			item.forEach((it) => {
				arr.push(wearableTooltip(it as ItemWearableDTO));
			});
		} else if (value === "Consume") {
			item.forEach((it) => {
				arr.push(consumableTooltip(it as ItemConsumableDTO));
			});
		}
		return arr;
	};
	if (loading) return <Loading />;
	return (
		<div className={styles.content}>
			<div style={{ margin: "16px" }}>최근 업데이트 : 2024/08/23</div>
			<div>
				<RadioGroup defaultValue="Weapon" className={styles.RadioGroup} onChange={radioHandler} value={view}>
					{radiodatas()}
				</RadioGroup>
			</div>
			<div style={{ display: "flex", flexWrap: "wrap" }}>{items()}</div>
		</div>
	);
}
