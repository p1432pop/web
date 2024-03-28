export const radiodata = [
    {value:"Weapon", label:"무기"},
    {value:"OneHandSword", label:"단검"},
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
    {value:"CrossBow", label:"석궁"},
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
    {value:"Beverage", label:"음료"}
]
const weapon = [
    "Weapon",
    "OneHandSword",
    "TwoHandSword",
    "Axe",
    "DualSword",
    "Pistol",
    "AssaultRifle",
    "SniperRifle",
    "Rapier",
    "Spear",
    "Hammer",
    "Bat",
    "HighAngleFire",
    "DirectFire",
    "Bow",
    "CrossBow",
    "Glove",
    "Tonfa",
    "Guitar",
    "Nunchaku",
    "Whip",
    "Camera",
    "Arcana",
    "VFArm",
]
const armor = [
    "Armor",
    'Chest',
    'Head',
    'Arm',
    'Leg'
]
const consume = [
    'Consume',
    'Food',
    'Beverage',
]

export const getItemType = (value) => {
    if (weapon.includes(value)) {
        return 'Weapon'
    }
    else if (armor.includes(value)) {
        return 'Armor'
    }
    else {
        return 'Consume'
    }
}

export const name = (code) => {
    return `/image/Icon/${code}.png`;	
}
export const grade = (Grade) => {
    if (Grade === 'Uncommon') return '고급';
    else if (Grade === 'Rare') return '희귀';
    else if (Grade === 'Epic') return '영웅';
    else if (Grade === 'Legend') return '전설';
    else if (Grade === 'Mythic') return '신화';
    else return '일반';
}
export const backcolor = (a) => {
    if (a === 'Uncommon') return '#00d500';
    else if (a === 'Rare') return 'blue';
    else if (a === 'Epic') return 'purple';
    else if (a === 'Legend') return '#ffd700';
    else if (a === 'Mythic') return 'red';
    else return 'gray';
}
export const backcolorrgba = (a) => {
    if (a === 'Uncommon') return 'rgba(0,245,0,0) 0%, rgba(0,245,0,0.8) 100%)';
    else if (a === 'Rare') return 'rgba(0,0,150,0) 0%, rgba(0,0,150,1) 100%)';
    else if (a === 'Epic') return 'rgba(150,0,150,0) 0%, rgba(150,0,150,1) 100%)';
    else if (a === 'Legend') return 'rgba(255,247,0,0) 0%, rgba(255,247,0,1) 100%)';
    else if (a === 'Mythic') return 'rgba(255,0,0,0) 0%, rgba(255,0,0,1) 100%)';
    else return 'rgba(20,20,20,0) 0%, rgba(20,20,20,1) 150%)';
}
export const recover = (hp, sp) => {
    if (hp > 0) return `체력 재생 + ${hp}`;
    else return `스태미나 재생 + ${sp}`;
}
export const consumeEffect = (hp, sp) => {
    if (hp > 0 && sp > 0) return '15초에 걸쳐 체력과 스태미나를 회복합니다.';
    else if (hp > 0) return '15초에 걸쳐 체력을 회복합니다.';
    else if (sp > 0) return '15초에 걸쳐 스태미나를 회복합니다.';
}
export const weaponArmor = (item) => {
    let arr = [];
    if (item.attackPower > 0) {
        arr.push(<p>공격력 +{item.attackPower}</p>)
    }
    if (item.attackPowerByLv > 0) {
        arr.push(<p>레벨 당 공격력 + {item.attackPowerByLv}~{item.attackPowerByLv*20}</p>)
    }
    if (item.defense > 0) {
        arr.push(<p>방어력 +{item.defense}</p>)
    }
    if (item.defenseByLv > 0) {
        arr.push(<p>레벨 당 방어력 + {item.defenseByLv}~{item.defenseByLv*20}</p>)
    }
    if (item.skillAmp > 0) {
        arr.push(<p>스킬 증폭 + {item.skillAmp}</p>)
    }
    if (item.skillAmpByLevel > 0) {
        arr.push(<p>레벨 당 스킬 증폭 + {item.skillAmpByLevel}~{item.skillAmpByLevel*20}</p>)
    }
    if (item.adaptiveForce > 0) {
        arr.push(<p>공격력 + {item.adaptiveForce} 또는 스킬 증폭 + {item.adaptiveForce*2}</p>)
    }
    if (item.maxHp > 0) {
        arr.push(<p>최대 체력 + {item.maxHp}</p>)
    }
    if (item.maxHpByLv > 0) {
        arr.push(<p>레벨 당 최대 체력 + {item.maxHpByLv}~{item.maxHpByLv*20}</p>)
    }
    if (item.maxSp > 0 || item.maxSP > 0) {
        arr.push(<p>최대 스테미나 + {item.maxSp}</p>)
    }
    if (item.hpRegenRatio > 0) {
        arr.push(<p>체력 재생 + {parseInt(item.hpRegenRatio*100)}%</p>)
    }
    if (item.spRegenRatio > 0) {
        arr.push(<p>스테미나 재생 + {parseInt(item.spRegenRatio*100)}%</p>)
    }
    if (item.spRegen > 0) {
        arr.push(<p>스테미나 재생 + {item.spRegen}</p>)
    }
    if (item.attackSpeedRatio > 0) {
        arr.push(<p>공격 속도 + {parseInt(item.attackSpeedRatio*100)}%</p>)
    }
    if (item.attackSpeedRatioByLv > 0) {
        arr.push(<p>레벨 당 공격 속도 + {parseInt(item.attackSpeedRatioByLv*100)}~{parseInt(item.attackSpeedRatioByLv*100)*20}%</p>)
    }
    if (item.criticalStrikeChance > 0) {
        arr.push(<p>치명타 확률 + {parseInt(item.criticalStrikeChance*100)}%</p>)
    }
    if (item.criticalStrikeDamage > 0) {
        arr.push(<p>치명타 피해량 + {parseInt(item.criticalStrikeDamage*100)}%</p>)
    }
    if (item.cooldownReduction > 0) {
        arr.push(<p>쿨다운 감소 + {parseInt(item.cooldownReduction*100)}%</p>)
    }
    if (item.lifeSteal > 0) {
        arr.push(<p>모든 피해 흡혈 + {parseInt(item.lifeSteal*100)}%</p>)
    }
    if (item.normalLifeSteal > 0) {
        arr.push(<p>생명력 흡수 + {parseInt(item.normalLifeSteal*100)}%</p>)
    }
    if (item.moveSpeed > 0) {
        arr.push(<p>이동 속도 + {item.moveSpeed}</p>)
    }
    if (item.sightRange > 0) {
        arr.push(<p>시야 + {item.sightRange}</p>)
    }
    if (item.preventBasicAttackDamagedRatio > 0) {
        arr.push(<p>기본 공격 피해 감소 + {parseInt(item.preventBasicAttackDamagedRatio*100)}%</p>)
    }
    if (item.increaseBasicAttackDamageRatioByLv > 0) {
        arr.push(<p>레벨 당 기본 공격 증폭 + {parseInt(item.increaseBasicAttackDamageRatioByLv*100)}~{parseInt(item.increaseBasicAttackDamageRatioByLv*100)*20}%</p>)
    }
    if (item.preventSkillDamagedRatio > 0) {
        arr.push(<p>스킬 피해 감소 + {parseInt(item.preventSkillDamagedRatio*100)}%</p>)
    }
    if (item.penetrationDefense > 0) {
        arr.push(<p>방어 관통 + {item.penetrationDefense}</p>)
    }
    if (item.penetrationDefenseRatio > 0) {
        arr.push(<p>방어 관통 + {parseInt(item.penetrationDefenseRatio*100)}%</p>)
    }
    if (item.healerGiveHpHealRatio > 0) {
        arr.push(<p>주는 회복 증가 + {parseInt(item.healerGiveHpHealRatio*100)}%</p>)
    }
    if (item.uniqueAttackRange > 0) {
        arr.push(<p>(고유) 기본 공격 사거리 + {item.uniqueAttackRange}</p>)
    }
    if (item.uniqueCooldownLimit > 0) {
        arr.push(<p>(고유) 최대 쿨다운 감소 + {parseInt(item.uniqueCooldownLimit*100)}%</p>)
    }
    if (item.uniqueTenacity > 0) {
        arr.push(<p>(고유) 방해 효과 저항 + {parseInt(item.uniqueTenacity*100)}%</p>)
    }
    if (item.uniqueMoveSpeed > 0) {
        arr.push(<p>(고유) 이동 속도 + {item.uniqueMoveSpeed}</p>)
    }
    if (item.uniqueSkillAmpRatio > 0) {
        arr.push(<p>(고유) 스킬 증폭 + {parseInt(item.uniqueSkillAmpRatio*100)}%</p>)
    }
    return arr;
}