export const getTierName = (mmr, idx) => {
    if (mmr >= 6000) {
        if (idx <= 200) {
            return '이터니티';
        }
        else if (idx <= 700) {
            return '데미갓';
        }
        else {
            return '미스릴';
        }
    }
    else if (mmr >= 5750) {
        return '다이아몬드 1';
    }
    else if (mmr >= 5500) {
        return '다이아몬드 2';
    }
    else if (mmr >= 5250) {
        return '다이아몬드 3';
    }
    else if (mmr >=5000) {
        return '다이아몬드 4';
    }
    else if (mmr >= 4750) {
        return '플래티넘 1';
    }
    else if (mmr >= 4500) {
        return '플래티넘 2';
    }
    else if (mmr >= 4250) {
        return '플래티넘 3';
    }
    else if (mmr >=4000) {
        return '플래티넘 4';
    }
    else if (mmr >= 3750) {
        return '골드 1';
    }
    else if (mmr >= 3500) {
        return '골드 2';
    }
    else if (mmr >= 3250) {
        return '골드 3';
    }
    else if (mmr >=3000) {
        return '골드 4';
    }
    else if (mmr >= 2750) {
        return '실버 1';
    }
    else if (mmr >= 2500) {
        return '실버 2';
    }
    else if (mmr >= 2250) {
        return '실버 3';
    }
    else if (mmr >= 2000) {
        return '실버 4';
    }
    else if (mmr >= 1750) {
        return '브론즈 1';
    }
    else if (mmr >= 1500) {
        return '브론즈 2';
    }
    else if (mmr >= 1250) {
        return '브론즈 3';
    }
    else if (mmr >= 1000) {
        return '브론즈 4';
    }
    else if (mmr >= 750) {
        return '브론즈 1';
    }
    else if (mmr >= 500) {
        return '브론즈 2';
    }
    else if (mmr >= 250) {
        return '브론즈 3';
    }
    else if (mmr >= 0) {
        return '브론즈 4';
    }
    else {
        return '언랭크';
    }
}

export const getTierImg = (mmr, idx) => {
    if (mmr >= 6000) {
        if (idx <= 200) {
            return 'image/tier/Immortal.png';
        }
        else if (idx <= 700) {
            return 'image/tier/Titan.png';
        }
        else {
            return 'image/tier/Mithril.png';
        }
    }
    else if (mmr >= 5000) {
        return 'image/tier/Diamond.png';
    }
    else if (mmr >= 4000) {
        return 'image/tier/Platinum.png';
    }
    else if (mmr >= 3000) {
        return 'image/tier/Gold.png';
    }
    else if (mmr >= 2000) {
        return 'image/tier/Silver.png';
    }
    else if (mmr >= 1000) {
        return 'image/tier/Bronze.png';
    }
    else if (mmr >= 0) {
        return 'image/tier/Iron.png';
    }
    else {
        return 'image/tier/Unrank.png';
    }
}