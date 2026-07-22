// ===== ตัวนับคนเข้าชมเว็บ (Visitor Counter) =====
// ใช้ CountAPI (ฟรี ไม่ต้องมี API key) เก็บค่าจำนวนครั้งที่เข้าชม
async function loadVisitorCounter() {
  const el = document.getElementById("visitor-count");
  if (!el) return;
  try {
    const namespace = "suphawich-portfolio-032"; // เปลี่ยนได้ตามต้องการให้ไม่ซ้ำกับคนอื่น
    const key = "home";
    const res = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`);
    const data = await res.json();
    el.textContent = data.value.toLocaleString("th-TH");
  } catch (err) {
    el.textContent = "ไม่สามารถโหลดข้อมูลได้";
    console.error("Visitor counter error:", err);
  }
}

// ===== พยากรณ์อากาศ (Weather) =====
// ใช้ Open-Meteo (ฟรี ไม่ต้องมี API key) พยากรณ์อากาศจังหวัดเชียงใหม่
async function loadWeather() {
  const iconEl = document.getElementById("weather-icon");
  const tempEl = document.getElementById("weather-temp");
  const descEl = document.getElementById("weather-desc");
  if (!tempEl) return;

  // พิกัดจังหวัดเชียงใหม่
  const lat = 18.7883;
  const lon = 98.9853;

  const weatherIcons = {
    0: ["☀️", "ท้องฟ้าแจ่มใส"],
    1: ["🌤️", "มีเมฆบางส่วน"],
    2: ["⛅", "เมฆเป็นบางส่วน"],
    3: ["☁️", "มีเมฆมาก"],
    45: ["🌫️", "หมอก"],
    48: ["🌫️", "หมอกน้ำแข็ง"],
    51: ["🌦️", "ฝนตกปรอยๆ"],
    53: ["🌦️", "ฝนตกปรอยๆ"],
    55: ["🌦️", "ฝนตกปรอยๆหนัก"],
    61: ["🌧️", "ฝนตกเล็กน้อย"],
    63: ["🌧️", "ฝนตกปานกลาง"],
    65: ["🌧️", "ฝนตกหนัก"],
    80: ["🌦️", "ฝนซู่ๆ"],
    81: ["🌧️", "ฝนซู่ๆปานกลาง"],
    82: ["⛈️", "ฝนซู่ๆรุนแรง"],
    95: ["⛈️", "พายุฝนฟ้าคะนอง"],
  };

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const res = await fetch(url);
    const data = await res.json();
    const w = data.current_weather;
    const [icon, desc] = weatherIcons[w.weathercode] || ["🌡️", "ไม่ทราบสภาพอากาศ"];

    if (iconEl) iconEl.textContent = icon;
    tempEl.textContent = `${Math.round(w.temperature)}°C`;
    if (descEl) descEl.textContent = `${desc} · ลม ${w.windspeed} กม./ชม.`;
  } catch (err) {
    tempEl.textContent = "โหลดไม่สำเร็จ";
    console.error("Weather error:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadVisitorCounter();
  loadWeather();
  loadAdvice();
  const btn = document.getElementById("advice-refresh");
  if (btn) btn.addEventListener("click", loadAdvice);
});

// ===== ตรวจสอบว่าเป็นบอทหรือคน (Google reCAPTCHA) =====
// เรียกอัตโนมัติเมื่อผู้ใช้ติ๊กถูกในช่อง "ฉันไม่ใช่บอท" สำเร็จ
function onBotCheckSuccess(token) {
  const overlay = document.getElementById("bot-check-overlay");
  const content = document.getElementById("site-content");
  if (overlay) overlay.style.display = "none";
  if (content) content.style.display = "block";
}

// ===== คำแนะนำประจำวัน (Random Advice) =====
// ใช้ Advice Slip API (ฟรี ไม่ต้องมี API key) สุ่มคำแนะนำภาษาอังกฤษสั้นๆ
async function loadAdvice() {
  const el = document.getElementById("advice-text");
  if (!el) return;
  el.textContent = "กำลังโหลด...";
  try {
    // เพิ่ม timestamp กัน cache เพื่อให้ได้คำแนะนำใหม่ทุกครั้งที่กดสุ่ม
    const res = await fetch(`https://api.adviceslip.com/advice?_=${Date.now()}`);
    const data = await res.json();
    el.textContent = `"${data.slip.advice}"`;
  } catch (err) {
    el.textContent = "ไม่สามารถโหลดคำแนะนำได้";
    console.error("Advice API error:", err);
  }
}
