import { useState, useEffect } from "react";

interface DateInput {
  day: string;
  month: string;
  year: string;
}

type CountMode = 1 | 2 | 3;

interface DiffResult {
  totalDays: number;
  years: number;
  months: number;
  weeks: number;
  remDaysAfterYears: number;
  remWeeksAfterYears: number;
  remDaysAfterYearsWeeks: number;
  remMonthsAfterYears: number;
  remWeeksAfterYearsMonths: number;
  remDaysAfterYearsMonths: number;
  remDaysAfterYearsMonthsWeeks: number;
  remDaysAfterMonths: number;
  remWeeksAfterMonths: number;
  remDaysAfterMonthsWeeks: number;
}

function isValidDate(d: DateInput): boolean {
  const day = parseInt(d.day);
  const month = parseInt(d.month);
  const year = parseInt(d.year);
  if (!day || !month || !year) return false;
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function toDate(d: DateInput): Date {
  return new Date(parseInt(d.year), parseInt(d.month) - 1, parseInt(d.day));
}

function calcDiff(start: Date, end: Date): DiffResult {
  if (start > end) [start, end] = [end, start];

  const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000);
  const totalWeeks = Math.floor(totalDays / 7);

  const totalYears =
    end.getFullYear() -
    start.getFullYear() -
    (end.getMonth() < start.getMonth() ||
    (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
      ? 1
      : 0);

  const afterYears = new Date(start);
  afterYears.setFullYear(afterYears.getFullYear() + totalYears);
  const remDaysAfterYears = Math.round(
    (end.getTime() - afterYears.getTime()) / 86400000
  );
  const remWeeksAfterYears = Math.floor(remDaysAfterYears / 7);
  const remDaysAfterYearsWeeks = remDaysAfterYears % 7;

  const remMonthsAfterYears =
    (end.getFullYear() - afterYears.getFullYear()) * 12 +
    (end.getMonth() - afterYears.getMonth()) +
    (end.getDate() >= afterYears.getDate() ? 0 : -1);

  const afterYearsMonths = new Date(afterYears);
  afterYearsMonths.setMonth(afterYearsMonths.getMonth() + remMonthsAfterYears);
  const remDaysAfterYearsMonths = Math.round(
    (end.getTime() - afterYearsMonths.getTime()) / 86400000
  );
  const remWeeksAfterYearsMonths = Math.floor(remDaysAfterYearsMonths / 7);
  const remDaysAfterYearsMonthsWeeks = remDaysAfterYearsMonths % 7;

  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    (end.getDate() >= start.getDate() ? 0 : -1);

  const afterMonths = new Date(start);
  afterMonths.setMonth(afterMonths.getMonth() + totalMonths);
  const remDaysAfterMonths = Math.round(
    (end.getTime() - afterMonths.getTime()) / 86400000
  );
  const remWeeksAfterMonths = Math.floor(remDaysAfterMonths / 7);
  const remDaysAfterMonthsWeeks = remDaysAfterMonths % 7;

  return {
    totalDays,
    years: totalYears,
    months: totalMonths,
    weeks: totalWeeks,
    remDaysAfterYears,
    remWeeksAfterYears,
    remDaysAfterYearsWeeks,
    remMonthsAfterYears,
    remWeeksAfterYearsMonths,
    remDaysAfterYearsMonths,
    remDaysAfterYearsMonthsWeeks,
    remDaysAfterMonths,
    remWeeksAfterMonths,
    remDaysAfterMonthsWeeks,
  };
}

function applyMode(
  d1: DateInput,
  d2: DateInput,
  mode: CountMode
): { start: Date; end: Date } | null {
  if (!isValidDate(d1) || !isValidDate(d2)) return null;
  let start = toDate(d1);
  let end = toDate(d2);
  if (start > end) [start, end] = [end, start];

  if (mode === 1) {
    start = new Date(start.getTime() + 86400000);
  } else if (mode === 2) {
    start = new Date(start.getTime() + 86400000);
    end = new Date(end.getTime() - 86400000);
  }

  if (start > end) {
    const tmp = start;
    start = end;
    end = tmp;
  }
  return { start, end };
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return `${n} ${many}`;
  if (mod10 === 1) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} ${few}`;
  return `${n} ${many}`;
}

const yStr = (n: number) => plural(n, "год", "года", "лет");
const mStr = (n: number) => plural(n, "месяц", "месяца", "месяцев");
const wStr = (n: number) => plural(n, "неделя", "недели", "недель");
const dStr = (n: number) => plural(n, "день", "дня", "дней");

const HIGHLIGHT_BG = new Set(["119","911","116","611","239","932","329","923","293","392","666","616","69","96","216","612","358","853"]);
const HIGHLIGHT_UNDERLINE = new Set(["1119","9111","1116","6111","999","966","996","669","699","696","969","916","619","919","219","912","144","441","44","55","126","621","162","261"]);

function ResultRow({ label, value, nums }: { label: string; value: string; nums: number[] }) {
  const key = nums.join("");
  const isBg = HIGHLIGHT_BG.has(key);
  const isUnderline = HIGHLIGHT_UNDERLINE.has(key);

  let numStyle: React.CSSProperties = { fontSize: "13px", color: "#c5bfb5", fontWeight: 400, marginLeft: "6px" };
  if (isBg) {
    numStyle = { ...numStyle, fontSize: "15px", fontWeight: 700, color: "#1a1713", background: "#ffd700", borderRadius: "4px", padding: "1px 5px" };
  } else if (isUnderline) {
    numStyle = { ...numStyle, fontSize: "15px", fontWeight: 700, color: "#1a1713", textDecoration: "underline", textDecorationColor: "#ffd700", textDecorationThickness: "3px", textUnderlineOffset: "3px" };
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        padding: "10px 0",
        borderBottom: "1px solid #f0ede8",
      }}
    >
      <span
        style={{
          fontFamily: "'Golos Text', sans-serif",
          fontSize: "12px",
          color: "#b0aa9f",
          fontWeight: 400,
          letterSpacing: "0.03em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Golos Text', sans-serif",
          fontSize: "17px",
          color: "#1a1713",
          fontWeight: 500,
        }}
      >
        {value}
        <span style={numStyle}>
          ({key})
        </span>
      </span>
    </div>
  );
}

interface DateRowProps {
  label: string;
  value: DateInput;
  onChange: (v: DateInput) => void;
}

function DateRow({ label, value, onChange }: DateRowProps) {
  const handleInput = (field: keyof DateInput, val: string, maxLen: number) => {
    const clean = val.replace(/\D/g, "").slice(0, maxLen);
    onChange({ ...value, [field]: clean });
  };

  const fillToday = () => {
    const now = new Date();
    onChange({
      day: String(now.getDate()).padStart(2, "0"),
      month: String(now.getMonth() + 1).padStart(2, "0"),
      year: String(now.getFullYear()),
    });
  };

  const inputStyle: React.CSSProperties = {
    width: "48px",
    height: "48px",
    border: "1.5px solid #e8e4de",
    borderRadius: "8px",
    background: "#faf9f7",
    fontFamily: "'Golos Text', sans-serif",
    fontSize: "18px",
    fontWeight: 500,
    color: "#1a1713",
    textAlign: "center",
    outline: "none",
    transition: "border-color 0.15s ease",
    caretColor: "#b5936a",
  };

  const yearInputStyle: React.CSSProperties = {
    ...inputStyle,
    width: "72px",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      <span
        style={{
          fontFamily: "'Golos Text', sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#b5936a",
          width: "60px",
          textAlign: "right",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <button
          onClick={fillToday}
          style={{
            background: "none",
            border: "1.5px solid #e8e4de",
            borderRadius: "7px",
            padding: "4px 8px",
            fontSize: "11px",
            color: "#b5936a",
            fontFamily: "'Golos Text', sans-serif",
            fontWeight: 500,
            cursor: "pointer",
            letterSpacing: "0.04em",
            transition: "all 0.15s ease",
            marginBottom: "18px",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.borderColor = "#b5936a";
            (e.target as HTMLButtonElement).style.background = "#fdf8f3";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.borderColor = "#e8e4de";
            (e.target as HTMLButtonElement).style.background = "none";
          }}
        >
          Сегодня
        </button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <input
            style={inputStyle}
            placeholder="ДД"
            maxLength={2}
            value={value.day}
            onChange={(e) => handleInput("day", e.target.value, 2)}
            onFocus={(e) => (e.target.style.borderColor = "#b5936a")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e4de")}
          />
          <span style={{ fontSize: "10px", color: "#c5bfb5", fontFamily: "'Golos Text', sans-serif", letterSpacing: "0.05em" }}>день</span>
        </div>
        <span style={{ color: "#d0cbc3", fontSize: "20px", fontWeight: 300, marginBottom: "18px" }}>/</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <input
            style={inputStyle}
            placeholder="ММ"
            maxLength={2}
            value={value.month}
            onChange={(e) => handleInput("month", e.target.value, 2)}
            onFocus={(e) => (e.target.style.borderColor = "#b5936a")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e4de")}
          />
          <span style={{ fontSize: "10px", color: "#c5bfb5", fontFamily: "'Golos Text', sans-serif", letterSpacing: "0.05em" }}>месяц</span>
        </div>
        <span style={{ color: "#d0cbc3", fontSize: "20px", fontWeight: 300, marginBottom: "18px" }}>/</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <input
            style={yearInputStyle}
            placeholder="ГГГГ"
            maxLength={4}
            value={value.year}
            onChange={(e) => handleInput("year", e.target.value, 4)}
            onFocus={(e) => (e.target.style.borderColor = "#b5936a")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e4de")}
          />
          <span style={{ fontSize: "10px", color: "#c5bfb5", fontFamily: "'Golos Text', sans-serif", letterSpacing: "0.05em" }}>год</span>
        </div>
      </div>
    </div>
  );
}

const MODE_LABELS: Record<CountMode, string> = {
  1: "Не считать первый день, считать последний",
  2: "Не считать первый и последний день",
  3: "Считать первый и последний день",
};

export default function Index() {
  const [date1, setDate1] = useState<DateInput>({ day: "", month: "", year: "" });
  const [date2, setDate2] = useState<DateInput>({ day: "", month: "", year: "" });
  const [mode, setMode] = useState<CountMode>(1);
  const [result, setResult] = useState<DiffResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const adjusted = applyMode(date1, date2, mode);
    if (!adjusted) {
      setResult(null);
      const filled =
        (date1.day || date1.month || date1.year) &&
        (date2.day || date2.month || date2.year);
      setError(filled ? "Проверьте правильность введённых дат" : "");
      return;
    }
    setError("");
    setResult(calcDiff(adjusted.start, adjusted.end));
  }, [date1, date2, mode]);

  const hasYears = result !== null && result.years > 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f4f0",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "60px 20px 80px",
        fontFamily: "'Golos Text', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1
            style={{
              fontFamily: "'Cormorant', serif",
              fontSize: "clamp(32px, 6vw, 48px)",
              fontWeight: 300,
              color: "#1a1713",
              letterSpacing: "-0.01em",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Калькулятор дат
          </h1>
          <p
            style={{
              marginTop: "10px",
              fontSize: "14px",
              color: "#9e9890",
              letterSpacing: "0.04em",
            }}
          >
            разница между двумя датами
          </p>
        </div>

        {/* Input card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "32px 28px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
            <button
              onClick={() => { setDate1({ day: "", month: "", year: "" }); setDate2({ day: "", month: "", year: "" }); }}
              style={{
                background: "none",
                border: "none",
                fontSize: "12px",
                color: "#c5bfb5",
                fontFamily: "'Golos Text', sans-serif",
                cursor: "pointer",
                letterSpacing: "0.04em",
                padding: "2px 0",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#b5936a")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#c5bfb5")}
            >
              Очистить
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <DateRow label="Дата 1" value={date1} onChange={setDate1} />
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "0 8px" }}>
              <div style={{ flex: 1, height: "1px", background: "#f0ede8" }} />
              <button
                onClick={() => { setDate1(date2); setDate2(date1); }}
                title="Поменять даты местами"
                style={{
                  background: "#faf9f7",
                  border: "1.5px solid #e8e4de",
                  borderRadius: "8px",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#b5936a",
                  transition: "all 0.15s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#b5936a";
                  (e.currentTarget as HTMLButtonElement).style.background = "#fdf8f3";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#e8e4de";
                  (e.currentTarget as HTMLButtonElement).style.background = "#faf9f7";
                }}
              >
                ⇅
              </button>
              <div style={{ flex: 1, height: "1px", background: "#f0ede8" }} />
            </div>
            <DateRow label="Дата 2" value={date2} onChange={setDate2} />
          </div>
        </div>

        {/* Mode selector */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {([1, 2, 3] as CountMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "none",
                background: mode === m ? "#f7f4f0" : "transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s ease",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  border: `2px solid ${mode === m ? "#b5936a" : "#d0cbc3"}`,
                  background: mode === m ? "#b5936a" : "transparent",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {mode === m && (
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#fff",
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: "13px",
                  color: mode === m ? "#1a1713" : "#9e9890",
                  fontWeight: mode === m ? 500 : 400,
                  lineHeight: 1.4,
                }}
              >
                {MODE_LABELS[m]}
              </span>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#c0766a",
              padding: "12px",
              background: "#fdf3f2",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#b5936a",
                marginBottom: "16px",
              }}
            >
              Результат
            </div>

            {result.years > 0 && result.remDaysAfterYears === 0 && (
              <ResultRow label="В годах" value={yStr(result.years)} nums={[result.years]} />
            )}
            {result.years > 0 && result.remDaysAfterYears > 0 && (
              <ResultRow label="В годах и днях" value={`${yStr(result.years)} и ${dStr(result.remDaysAfterYears)}`} nums={[result.years, result.remDaysAfterYears]} />
            )}
            {result.years > 0 && result.remMonthsAfterYears > 0 && result.remDaysAfterYearsMonths === 0 && (
              <ResultRow label="В годах и месяцах" value={`${yStr(result.years)} и ${mStr(result.remMonthsAfterYears)}`} nums={[result.years, result.remMonthsAfterYears]} />
            )}
            {result.years > 0 && result.remWeeksAfterYears > 0 && result.remDaysAfterYearsWeeks === 0 && (
              <ResultRow label="В годах и неделях" value={`${yStr(result.years)} и ${wStr(result.remWeeksAfterYears)}`} nums={[result.years, result.remWeeksAfterYears]} />
            )}
            {result.years > 0 && result.remMonthsAfterYears > 0 && result.remWeeksAfterYearsMonths > 0 && result.remDaysAfterYearsMonthsWeeks === 0 && (
              <ResultRow label="В годах, месяцах и неделях" value={`${yStr(result.years)}, ${mStr(result.remMonthsAfterYears)} и ${wStr(result.remWeeksAfterYearsMonths)}`} nums={[result.years, result.remMonthsAfterYears, result.remWeeksAfterYearsMonths]} />
            )}
            {result.years > 0 && result.remMonthsAfterYears > 0 && result.remDaysAfterYearsMonths > 0 && (
              <ResultRow label="В годах, месяцах и днях" value={`${yStr(result.years)}, ${mStr(result.remMonthsAfterYears)} и ${dStr(result.remDaysAfterYearsMonths)}`} nums={[result.years, result.remMonthsAfterYears, result.remDaysAfterYearsMonths]} />
            )}
            {result.years > 0 && result.remWeeksAfterYears > 0 && result.remDaysAfterYearsWeeks > 0 && (
              <ResultRow label="В годах, неделях и днях" value={`${yStr(result.years)}, ${wStr(result.remWeeksAfterYears)} и ${dStr(result.remDaysAfterYearsWeeks)}`} nums={[result.years, result.remWeeksAfterYears, result.remDaysAfterYearsWeeks]} />
            )}
            {result.years > 0 && result.remMonthsAfterYears > 0 && result.remWeeksAfterYearsMonths > 0 && result.remDaysAfterYearsMonthsWeeks > 0 && (
              <ResultRow label="В годах, месяцах, неделях и днях" value={`${yStr(result.years)}, ${mStr(result.remMonthsAfterYears)}, ${wStr(result.remWeeksAfterYearsMonths)} и ${dStr(result.remDaysAfterYearsMonthsWeeks)}`} nums={[result.years, result.remMonthsAfterYears, result.remWeeksAfterYearsMonths, result.remDaysAfterYearsMonthsWeeks]} />
            )}

            {result.years > 0 && <div style={{ height: "1px", background: "#e8e4de", margin: "8px 0 0" }} />}

            {result.months > 0 && result.remDaysAfterMonths === 0 && (
              <ResultRow label="В месяцах" value={mStr(result.months)} nums={[result.months]} />
            )}
            {result.weeks > 0 && result.totalDays % 7 === 0 && (
              <ResultRow label="В неделях" value={wStr(result.weeks)} nums={[result.weeks]} />
            )}
            <ResultRow label="В днях" value={dStr(result.totalDays)} nums={[result.totalDays]} />
            {result.months > 0 && result.remWeeksAfterMonths > 0 && result.remDaysAfterMonthsWeeks === 0 && (
              <ResultRow label="В месяцах и неделях" value={`${mStr(result.months)} и ${wStr(result.remWeeksAfterMonths)}`} nums={[result.months, result.remWeeksAfterMonths]} />
            )}
            {result.months > 0 && result.remDaysAfterMonths > 0 && (
              <ResultRow label="В месяцах и днях" value={`${mStr(result.months)} и ${dStr(result.remDaysAfterMonths)}`} nums={[result.months, result.remDaysAfterMonths]} />
            )}
            {result.weeks > 0 && result.totalDays % 7 > 0 && (
              <ResultRow label="В неделях и днях" value={`${wStr(result.weeks)} и ${dStr(result.totalDays % 7)}`} nums={[result.weeks, result.totalDays % 7]} />
            )}
            {result.months > 0 && result.remWeeksAfterMonths > 0 && result.remDaysAfterMonthsWeeks > 0 && (
              <ResultRow label="В месяцах, неделях и днях" value={`${mStr(result.months)}, ${wStr(result.remWeeksAfterMonths)} и ${dStr(result.remDaysAfterMonthsWeeks)}`} nums={[result.months, result.remWeeksAfterMonths, result.remDaysAfterMonthsWeeks]} />
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: #d0cbc3; }
        input:focus { outline: none; }
      `}</style>
    </div>
  );
}