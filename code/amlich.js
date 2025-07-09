
"use strict";
const {floor, sin, PI} = Math;
const computeJulianDayFromDate = (dd, mm, yy) => {
  const a = floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + floor((153 * m + 2) / 5) + 365 * y + floor(y / 4) - floor(y / 100) + floor(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + floor((153 * m + 2) / 5) + 365 * y + floor(y / 4) - 32083;
  }
  return jd;
};
const computeDateFromJulianDay = (jd) => {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044;
    b = floor((4 * a + 3) / 146097);
    c = a - floor(b * 146097 / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = floor((4 * c + 3) / 1461);
  const e = c - floor(1461 * d / 4);
  const m = floor((5 * e + 2) / 153);
  const day = e - floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * floor(m / 10);
  const year = b * 100 + d - 4800 + floor(m / 10);
  return {
    day,
    month: month, // Corrected from month + 1
    year
  };
};
const computeNewMoon = (k) => {
  const t = k / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;
  const dr = Math.PI / 180;
  let jd1 = 2415020.75933 + 29.53058868 * k + .0001178 * t2 - 155e-9 * t3;
  jd1 = jd1 + .00033 * sin((166.56 + 132.87 * t - .009173 * t2) * dr);
  const m = 359.2242 + 29.10535608 * k - 333e-7 * t2 - 347e-8 * t3;
  const mpr = 306.0253 + 385.81691806 * k + .0107306 * t2 + 1236e-8 * t3;
  const f = 21.2964 + 390.67050646 * k - .0016528 * t2 - 239e-8 * t3;
  let c1 = (.1734 - 393e-6 * t) * sin(m * dr) + .0021 * sin(2 * dr * m);
  c1 = c1 - .4068 * sin(mpr * dr) + .0161 * sin(dr * 2 * mpr);
  c1 = c1 - 4e-4 * sin(dr * 3 * mpr);
  c1 = c1 + .0104 * sin(dr * 2 * f) - .0051 * sin(dr * (m + mpr));
  c1 = c1 - .0074 * sin(dr * (m - mpr)) + 4e-4 * sin(dr * (2 * f + m));
  c1 = c1 - 4e-4 * sin(dr * (2 * f - m)) - 6e-4 * sin(dr * (2 * f + mpr));
  c1 = c1 + .001 * sin(dr * (2 * f - mpr)) + 5e-4 * sin(dr * (2 * mpr + m));
  const calculateDeltaT = (t2) => {
    let deltaT;
    const t3 = t2 * t2;
    const t4 = t3 * t2;
    if (t2 < -11) {
      deltaT = .001 + .000839 * t2 + .0002261 * t3 - 845e-8 * t4 - 81e-9 * t2 * t4;
    } else {
      deltaT = -278e-5 + 265e-5 * t2 + 262e-5 * t3;
    }
    return deltaT;
  };
  const jd = jd1 + c1 - calculateDeltaT(t);
  return jd;
};
const computeSunLongitude = (jdn) => {
  const t = (jdn - 2451545) / 36525;
  const t2 = t * t;
  const dr = PI / 180;
  const m = 357.5291 + 35999.0503 * t - 1559e-7 * t2 - 48e-8 * t * t2;
  const l0 = 280.46645 + 36000.76983 * t + 3032e-7 * t2;
  let dl = (1.9146 - .004817 * t - 14e-6 * t2) * Math.sin(dr * m);
  dl = dl + (.019993 - 101e-6 * t) * Math.sin(dr * 2 * m) + 29e-5 * Math.sin(dr * 3 * m);
  let l = l0 + dl;
  l = l * dr;
  l = l - PI * 2 * floor(l / (PI * 2));
  return l;
};
const getSunLongitude = (dayNumber, timeZone) => {
  return floor(computeSunLongitude(dayNumber - .5 - timeZone / 24) / PI * 6);
};
const getNewMoonDay = (k, timeZone) => {
  return floor(computeNewMoon(k) + .5 + timeZone / 24);
};
const getLunarMonth11 = (yy, timeZone) => {
  const off = computeJulianDayFromDate(31, 12, yy) - 2415021;
  const k = floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
};
const getLeapMonthOffset = (a11, timeZone) => {
  const k = floor((a11 - 2415021.076998695) / 29.530588853 + .5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc != last && i < 14);
  return i - 1;
};
const computeDateToLunarDate = (dd, mm, yy, timeZone) => {
  const dayNumber = computeJulianDayFromDate(dd, mm, yy);
  const k = floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear;
  if (a11 > monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = floor((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;
  let leapMonthDiff;
  if (b11 - a11 > 365) {
    leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff == leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return {
    lunarDay,
    lunarMonth,
    lunarYear,
    lunarLeap
  };
};
const computeDateFromLunarDate = (lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone) => {
  let a11;
  let b11;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }
  const k = floor(.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }
  let leapOff;
  let leapMonth;
  if (b11 - a11 > 365) {
    leapOff = getLeapMonthOffset(a11, timeZone);
    leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
    if (lunarLeap && lunarMonth != leapMonth) {
      return {day:0, month:0, year:0};
    } else if (lunarLeap || off >= leapOff) {
      off += 1;
    }
  }
  const monthStart = getNewMoonDay(k + off, timeZone);
  return computeDateFromJulianDay(monthStart + lunarDay - 1);
};
const CAN = [ "Canh", "Tân", "Nhâm", "Quý", "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ" ];
const CHI = [ "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi" ];
const getCanChi = (lunarYear) => {
  return {
    can: CAN[lunarYear % 10],
    chi: CHI[lunarYear % 12]
  };
};

export const getLunarDate = (day, month, year, timeZone = 7) => {
  const {lunarDay, lunarMonth, lunarYear, lunarLeap} = computeDateToLunarDate(day, month, year, timeZone);
  const {can, chi} = getCanChi(lunarYear);
  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    leap: lunarLeap,
    lunarDate: lunarDay,
    lunarMonth: lunarMonth,
    lunarYear: lunarYear,
    can,
    chi
  };
};

export const getSolarDate = (lunarDay, lunarMonth, lunarYear, isLeap = false, timeZone = 7) => {
  return computeDateFromLunarDate(lunarDay, lunarMonth, lunarYear, isLeap, timeZone);
};
