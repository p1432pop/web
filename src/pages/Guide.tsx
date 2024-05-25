import React from "react";
import { useState, useEffect } from "react";
import { Api } from "../axios/axios";
import Loading from "../components/Loading";
import { getItemType, radiodata, name, grade, backcolor, backcolorrgba, recover, consumeEffect, weaponArmor } from "../utils/itemtype";

import Sheet from "@mui/joy/Sheet";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

import styles from "../style/Guide.module.css";

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
  ))({
	[`& .${tooltipClasses.tooltip}`]: {
		maxWidth: 600,
		padding: 0,
	},
});
export default function Guide() {
	const [view, setView] = useState("Weapon");
	const [item, setItem] = useState([]);
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
		const type = (ev.target as HTMLInputElement).value
		setView(type);
		if (type === "Weapon") {
			const result = await Api.getItemWeapon();
			setItem(result);
			return;
		}
		if (type === "Armor") {
			const result = await Api.getItemArmor();
			setItem(result);
			return;
		}
		if (type === "Consume") {
			const result = await Api.getItemConsumable();
			setItem(result);
			return;
		}
	};
	const radiodatas = () => {
		let arr = [];
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
	const items = () => {
		const value = getItemType(view);
		let arr = [];
		if (value === "Weapon" || value === "Armor") {
			item.forEach((it) => {
				arr.push(
					<CustomWidthTooltip
						key={it.code}
						title={
							<>
								<div style={{ display: "flex", background: `linear-gradient(90deg, ${backcolorrgba(it.itemGrade)}`, padding: "8px" }}>
									<div>
										<p className={styles.itemName}>{it.name}</p>
										<p className={styles.itemEffect} style={{ color: backcolor(it.itemGrade) }}>
											{grade(it.itemGrade)}
										</p>
									</div>
									<img className={styles.imgmd} src={name(it.code)} alt="img" />
								</div>
								<div className={styles.itemDetail}>{weaponArmor(it)}</div>
							</>
						}
					>
						<div className={styles.itemBox}>
							<img className={styles.imgsm} src={name(it.code)} alt="img" style={{ backgroundColor: backcolor(it.itemGrade) }} />
							{it.name}
						</div>
					</CustomWidthTooltip>
				);
			});
		} else if (value === "Consume") {
			item.forEach((it) => {
				if (view === "Consume" || view === it.consumableType) {
					arr.push(
						<CustomWidthTooltip
							key={it.code}
							title={
								<>
									<div style={{ display: "flex", background: `linear-gradient(90deg, ${backcolorrgba(it.itemGrade)}`, padding: "8px" }}>
										<div>
											<p className={styles.itemName}>{it.name}</p>
											<p className={styles.itemEffect} style={{ color: backcolor(it.itemGrade) }}>
												{grade(it.itemGrade)}
											</p>
										</div>
										<img className={styles.imgmd} src={name(it.code)} alt="img" />
									</div>
									<div className={styles.itemDetail}>
										<p>{recover(it.hpRecover, it.spRecover)}</p>
										<p>소비 효과</p>
										<p>{consumeEffect(it.hpRecover, it.spRecover)}</p>
									</div>
								</>
							}
						>
							<div className={styles.itemBox}>
								<img className={styles.imgsm} src={name(it.code)} alt="img" style={{ backgroundColor: backcolor(it.itemGrade) }} />
								{it.name}
							</div>
						</CustomWidthTooltip>
					);
				}
			});
		}
		return arr;
	};
	if (loading) {
		return <Loading />;
	}
	return (
		<div className={styles.content}>
			<div style={{ margin: "16px" }}>최근 업데이트 : 2024/03/20</div>
			<div>
				<RadioGroup defaultValue="Weapon" className={styles.RadioGroup} onChange={radioHandler} value={view}>
					{radiodatas()}
				</RadioGroup>
			</div>
			<div style={{ display: "flex", flexWrap: "wrap" }}>{items()}</div>
		</div>
	);
}
