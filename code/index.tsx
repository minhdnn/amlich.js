
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { getLunarDate, getSolarDate } from './amlich.js';

// --- TYPE DEFINITIONS ---
interface LunarDateInfo {
  day: number;
  month: number;
  year: number;
  leap: boolean;
  lunarDate: number;
  lunarMonth: number;
  lunarYear: number;
  can: string;
  chi: string;
}

interface SolarDateInfo {
  day: number;
  month: number;
  year: number;
}

interface FunFacts {
  daysLived: number;
  sundaysPassed: number;
  tetHolidays: number;
  milestone1000: string;
  milestone5000: string;
  milestone10000: string;
  milestone20000: string;
  milestone30000: string;
  gregorianAge: number;
  lunarAge: number;
  birthDayOfWeek: string;
  lunarBirthDate: string;
  zodiac: string;
  canChi: string;
  weekendBirthdays: number;
}

// --- CONSTANTS ---
const VIETNAMESE_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const VIETNAMESE_FULL_DAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const MONTH_NAMES = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
const ZODIAC_ANIMALS: { [key: string]: string } = {
  "Tý": "Chuột 🐭", "Sửu": "Trâu 🐃", "Dần": "Hổ 🐅", "Mão": "Mèo 🐈",
  "Thìn": "Rồng 🐉", "Tỵ": "Rắn 🐍", "Ngọ": "Ngựa 🐎", "Mùi": "Dê 🐐",
  "Thân": "Khỉ 🐒", "Dậu": "Gà 🐓", "Tuất": "Chó 🐕", "Hợi": "Heo 🐖"
};

// --- HELPER FUNCTIONS ---
const getLunarInfo = (date: Date): LunarDateInfo => {
    return getLunarDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
};

const formatDate = (date: Date) => {
    if (isNaN(date.getTime())) return "N/A";
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

// --- COMPONENTS ---

// #region Calendar Components
const CalendarControls: React.FC<{
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onGoToToday: () => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}> = ({ currentDate, onPrev, onNext, onGoToToday, onMonthChange, onYearChange }) => (
  <div className="calendar-controls">
    <div className="nav-buttons">
      <button onClick={onPrev} className="nav-button" aria-label="Tháng trước">‹</button>
      <button onClick={onGoToToday} className="today-button">Hôm nay</button>
      <button onClick={onNext} className="nav-button" aria-label="Tháng sau">›</button>
    </div>
    <div className="date-selectors">
       <select
        value={currentDate.getMonth()}
        onChange={(e) => onMonthChange(parseInt(e.target.value, 10))}
        aria-label="Chọn tháng"
      >
        {MONTH_NAMES.map((name, index) => (
          <option key={name} value={index}>{name}</option>
        ))}
      </select>
      <input
        type="number"
        value={currentDate.getFullYear()}
        onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
        aria-label="Chọn năm"
      />
    </div>
  </div>
);


const DayCell: React.FC<{ day: Date; isToday: boolean; isCurrentMonth: boolean; isSelected: boolean; onClick: () => void; }> = ({ day, isToday, isCurrentMonth, isSelected, onClick }) => {
  const lunarInfo = getLunarInfo(day);
  const classNames = [
    'day-cell',
    isToday ? 'is-today' : '',
    !isCurrentMonth ? 'is-other-month' : '',
    (day.getDay() === 0 || day.getDay() === 6) ? 'is-weekend' : '',
    isSelected ? 'is-selected' : ''
  ].join(' ');
  
  const lunarDayText = `${lunarInfo.day}/${lunarInfo.month}${lunarInfo.leap ? ' (nhuận)' : ''}`;

  return (
    <div className={classNames} onClick={onClick}>
      <span className="solar-day">{day.getDate()}</span>
      <span className="lunar-day">{lunarDayText}</span>
    </div>
  );
};

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleGoToToday = () => setCurrentDate(new Date());
  const handleMonthChange = (month: number) => setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
  const handleYearChange = (year: number) => {
    if(year > 1000 && year < 9999) {
        setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    }
  };
   const handleDayClick = (date: Date) => setSelectedDate(date);


  const calendarDays = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay();

    // Days from previous month
    for (let i = startDayOfWeek; i > 0; i--) {
      const day = new Date(year, month, 1 - i);
      days.push({ date: day, isCurrentMonth: false });
    }

    // Days of current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const day = new Date(year, month, i);
      const isToday = day.getTime() === today.getTime();
      days.push({ date: day, isCurrentMonth: true, isToday });
    }
    
    // Fill remaining grid cells to ensure 6 rows for consistent height
    const totalDays = days.length;
    const remainingCells = (totalDays > 35 ? 42 : 35) - totalDays;

    for (let i = 1; i <= remainingCells; i++) {
        const day = new Date(year, month + 1, i);
        days.push({ date: day, isCurrentMonth: false});
    }
    
    return days;
  }, [currentDate]);

  return (
    <div className="calendar-view">
      <CalendarControls 
        currentDate={currentDate} 
        onPrev={handlePrevMonth} 
        onNext={handleNextMonth}
        onGoToToday={handleGoToToday}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />
      <div className="calendar-grid">
        {VIETNAMESE_DAYS.map(day => <div key={day} className="day-name">{day}</div>)}
        {calendarDays.map(({ date, isCurrentMonth, isToday }, index) => (
          <DayCell 
            key={index} 
            day={date} 
            isToday={!!isToday} 
            isCurrentMonth={isCurrentMonth}
            isSelected={selectedDate?.getTime() === date.getTime()}
            onClick={() => handleDayClick(date)}
          />
        ))}
      </div>
    </div>
  );
};
// #endregion

// #region Fun Facts Components
const FunFactsView: React.FC = () => {
    const [birthDate, setBirthDate] = useState('');
    const [facts, setFacts] = useState<FunFacts | null>(null);

    const handleCalculate = () => {
        if (!birthDate) return;

        const bd = new Date(birthDate);
        if (isNaN(bd.getTime())) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const daysLived = Math.floor((today.getTime() - bd.getTime()) / (1000 * 60 * 60 * 24));
        
        const birthDayOfWeek = bd.getDay();
        const daysToFirstSunday = (7 - birthDayOfWeek) % 7;
        let sundaysPassed = 0;
        if (daysLived >= daysToFirstSunday) {
            sundaysPassed = 1 + Math.floor((daysLived - daysToFirstSunday) / 7);
        }

        const bdYear = bd.getFullYear();
        const currentYear = today.getFullYear();
        let tetHolidays = 0;
        for (let year = bdYear; year <= currentYear; year++) {
            const tetSolar = getSolarDate(1, 1, year);
            const tetDate = new Date(tetSolar.year, tetSolar.month - 1, tetSolar.day);
            if (tetDate >= bd && tetDate <= today) {
                tetHolidays++;
            }
        }
        
        const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

        const gregorianAge = today.getFullYear() - bd.getFullYear() - (today.getMonth() < bd.getMonth() || (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate()) ? 1 : 0);
        
        const lunarBirthInfo = getLunarInfo(bd);
        const currentLunarInfo = getLunarInfo(today);
        const lunarAge = currentLunarInfo.lunarYear - lunarBirthInfo.lunarYear + 1;

        const birthDayOfWeekStr = VIETNAMESE_FULL_DAYS[bd.getDay()];
        const lunarBirthDate = `${lunarBirthInfo.day}/${lunarBirthInfo.month}/${lunarBirthInfo.lunarYear} (${lunarBirthInfo.can} ${lunarBirthInfo.chi})`;
        const canChi = `${lunarBirthInfo.can} ${lunarBirthInfo.chi}`;
        const zodiac = ZODIAC_ANIMALS[lunarBirthInfo.chi] || 'N/A';
        
        let weekendBirthdays = 0;
        for (let year = bdYear + 1; year <= currentYear; year++) {
            const birthdayThisYear = new Date(year, bd.getMonth(), bd.getDate());
            if (birthdayThisYear.getDay() === 0 || birthdayThisYear.getDay() === 6) {
                weekendBirthdays++;
            }
        }

        setFacts({
            daysLived, sundaysPassed, tetHolidays,
            milestone1000: formatDate(addDays(bd, 1000)),
            milestone5000: formatDate(addDays(bd, 5000)),
            milestone10000: formatDate(addDays(bd, 10000)),
            milestone20000: formatDate(addDays(bd, 20000)),
            milestone30000: formatDate(addDays(bd, 30000)),
            gregorianAge, lunarAge,
            birthDayOfWeek: birthDayOfWeekStr, lunarBirthDate, zodiac, canChi,
            weekendBirthdays
        });
    };

    return (
        <div className="fun-facts-view">
            <div className="input-section">
                <label htmlFor="birthdate-input">Nhập ngày sinh của bạn:</label>
                <input
                    type="date"
                    id="birthdate-input"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                />
                <button onClick={handleCalculate} className="calculate-button">Khám phá ngay!</button>
            </div>

            {facts && (
                <div className="results-section">
                    <h3>🎉 Fun Facts Về Bạn 🎂</h3>
                    <ul className="results-list">
                        <li><span className="fact-label">Tuổi dương lịch</span> <span className="fact-value">{facts.gregorianAge} tuổi</span></li>
                        <li><span className="fact-label">Tuổi âm lịch</span> <span className="fact-value">{facts.lunarAge} tuổi</span></li>
                        <li><span className="fact-label">Can chi năm sinh</span> <span className="fact-value">{facts.canChi}</span></li>
                        <li><span className="fact-label">Con giáp</span> <span className="fact-value">{facts.zodiac}</span></li>
                        <li><span className="fact-label">Ngày sinh (âm lịch)</span> <span className="fact-value">{facts.lunarBirthDate}</span></li>
                        <li><span className="fact-label">Sinh vào</span> <span className="fact-value">{facts.birthDayOfWeek}</span></li>
                        <li><span className="fact-label">Số ngày đã sống</span> <span className="fact-value">{facts.daysLived.toLocaleString('vi-VN')} ngày</span></li>
                        <li><span className="fact-label">Số Chủ Nhật đã qua</span> <span className="fact-value">{facts.sundaysPassed.toLocaleString('vi-VN')}</span></li>
                        <li><span className="fact-label">Số lần ăn Tết</span> <span className="fact-value">{facts.tetHolidays} lần</span></li>
                        <li><span className="fact-label">Sinh nhật vào cuối tuần</span> <span className="fact-value">{facts.weekendBirthdays} lần</span></li>
                        <li><span className="fact-label">Mốc 1,000 ngày</span> <span className="fact-value">{facts.milestone1000}</span></li>
                        <li><span className="fact-label">Mốc 5,000 ngày</span> <span className="fact-value">{facts.milestone5000}</span></li>
                        <li><span className="fact-label">Mốc 10,000 ngày</span> <span className="fact-value">{facts.milestone10000}</span></li>
                        <li><span className="fact-label">Mốc 20,000 ngày</span> <span className="fact-value">{facts.milestone20000}</span></li>
                        <li><span className="fact-label">Mốc 30,000 ngày</span> <span className="fact-value">{facts.milestone30000}</span></li>
                    </ul>
                </div>
            )}
        </div>
    );
};
// #endregion


// #region Date Converter
const DateConverterView: React.FC = () => {
  const [solarInput, setSolarInput] = useState({ day: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [lunarInput, setLunarInput] = useState({ day: 1, month: 1, year: 2024, isLeap: false });
  const [solarToLunarResult, setSolarToLunarResult] = useState('');
  const [lunarToSolarResult, setLunarToSolarResult] = useState('');

  const handleSolarToLunar = () => {
    try {
      const { day, month, year } = solarInput;
      const lunar = getLunarDate(day, month, year);
      const result = `Ngày ${lunar.day}/${lunar.month}/${lunar.year} ${lunar.leap ? '(nhuận)' : ''} (${lunar.can} ${lunar.chi})`;
      setSolarToLunarResult(result);
    } catch (e) {
      setSolarToLunarResult("Ngày không hợp lệ");
    }
  };

  const handleLunarToSolar = () => {
    try {
      const { day, month, year, isLeap } = lunarInput;
      const solar = getSolarDate(day, month, year, isLeap);
      if (solar.year === 0) throw new Error("Invalid lunar date");
      const date = new Date(solar.year, solar.month - 1, solar.day);
      const result = `${VIETNAMESE_FULL_DAYS[date.getDay()]}, ngày ${solar.day}/${solar.month}/${solar.year}`;
      setLunarToSolarResult(result);
    } catch (e) {
      setLunarToSolarResult("Ngày không hợp lệ");
    }
  };

  return (
    <div className="converter-view">
      <div className="converter-box">
        <h3>Dương sang Âm</h3>
        <div className="converter-inputs">
          <input type="number" placeholder="Ngày" value={solarInput.day} onChange={e => setSolarInput({...solarInput, day: +e.target.value})} />
          <input type="number" placeholder="Tháng" value={solarInput.month} onChange={e => setSolarInput({...solarInput, month: +e.target.value})} />
          <input type="number" placeholder="Năm" value={solarInput.year} onChange={e => setSolarInput({...solarInput, year: +e.target.value})} />
        </div>
        <button onClick={handleSolarToLunar} className="calculate-button">Chuyển đổi</button>
        {solarToLunarResult && <p className="converter-result">{solarToLunarResult}</p>}
      </div>
      <div className="converter-box">
        <h3>Âm sang Dương</h3>
        <div className="converter-inputs">
          <input type="number" placeholder="Ngày" value={lunarInput.day} onChange={e => setLunarInput({...lunarInput, day: +e.target.value})} />
          <input type="number" placeholder="Tháng" value={lunarInput.month} onChange={e => setLunarInput({...lunarInput, month: +e.target.value})} />
          <input type="number" placeholder="Năm" value={lunarInput.year} onChange={e => setLunarInput({...lunarInput, year: +e.target.value})} />
        </div>
        <div className="leap-year-check">
          <input type="checkbox" id="isLeap" checked={lunarInput.isLeap} onChange={e => setLunarInput({...lunarInput, isLeap: e.target.checked})} />
          <label htmlFor="isLeap">Tháng nhuận</label>
        </div>
        <button onClick={handleLunarToSolar} className="calculate-button">Chuyển đổi</button>
        {lunarToSolarResult && <p className="converter-result">{lunarToSolarResult}</p>}
      </div>
    </div>
  );
};
// #endregion

// --- Main App Component ---
const App = () => {
  type View = 'calendar' | 'funfacts' | 'converter';
  const [activeView, setActiveView] = useState<View>('calendar');

  return (
    <div className="app-container">
      <header>
        <h1>Lịch Vạn Niên</h1>
        <nav className="tabs">
          <button 
            className={`tab-button ${activeView === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveView('calendar')}
            aria-pressed={activeView === 'calendar'}
          >
            🗓️ Lịch Tháng
          </button>
          <button 
            className={`tab-button ${activeView === 'funfacts' ? 'active' : ''}`}
            onClick={() => setActiveView('funfacts')}
            aria-pressed={activeView === 'funfacts'}
          >
            🎉 Fun Facts
          </button>
           <button 
            className={`tab-button ${activeView === 'converter' ? 'active' : ''}`}
            onClick={() => setActiveView('converter')}
            aria-pressed={activeView === 'converter'}
          >
            🔄 Chuyển Đổi
          </button>
        </nav>
      </header>
      <main>
        {activeView === 'calendar' && <CalendarView />}
        {activeView === 'funfacts' && <FunFactsView />}
        {activeView === 'converter' && <DateConverterView />}
      </main>
    </div>
  );
};

// --- App Initialization ---
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}