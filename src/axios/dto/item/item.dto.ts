import { ConsumableType, ItemGrade, ItemType, WearableType } from "./item.enum";

abstract class CommonDTO {
  code: number;
  name: string;
  itemType: ItemType;
  itemGrade: ItemGrade;
}

class ItemWearableDTO extends CommonDTO {
  wearableType: WearableType;
  attackPower: number;
  attackPowerByLv: number;
  defense: number;
  defenseByLv: number;
  skillAmp: number;
  skillAmpByLevel: number;
  adaptiveForce: number;
  maxHp: number;
  maxHpByLv: number;
  maxSp: number;
  hpRegenRatio: number;
  spRegenRatio: number;
  spRegen: number;
  attackSpeedRatio: number;
  attackSpeedRatioByLv: number;
  criticalStrikeChance: number;
  criticalStrikeDamage: number;
  cooldownReduction: number;
  lifeSteal: number;
  normalLifeSteal: number;
  moveSpeed: number;
  sightRange: number;
  preventBasicAttackDamagedRatio: number;
  increaseBasicAttackDamageRatioByLv: number;
  preventSkillDamagedRatio: number;
  penetrationDefense: number;
  penetrationDefenseRatio: number;
  healerGiveHpHealRatio: number;
  uniqueAttackRange: number;
  uniqueCooldownLimit: number;
  uniqueTenacity: number;
  uniqueMoveSpeed: number;
  uniqueSkillAmpRatio: number;
}

class ItemConsumableDTO extends CommonDTO {
  consumableType: ConsumableType;
  hpRecover: number;
  spRecover: number;
}

export class ItemsWearableDTO {
  items: ItemWearableDTO[];
}

export class ItemsConsumableDTO {
  items: ItemConsumableDTO[];
}
