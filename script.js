const calendarEl = document.getElementById("calendar");
const calendarTitle = document.getElementById("calendarTitle");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const clearBtn = document.getElementById("clearMonth");
const form = document.getElementById("addMedicineForm");
const newMedicineInput = document.getElementById("newMedicineName");
const medicineListEl = document.getElementById("medicineList");
const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
let currentDate = new Date();
const savedData = JSON.parse(localStorage.getItem("trackerDataV2")) || {
medicines: [],
months: {}
};
const colors = [
"#7AE2CF",
"#A6D6D6",
"#94B4C1",
"#8E7DBE",
"#C599B6",
"#E6B2BA",
"#FAD0C4",
"#F7CFD8",
"#9F8383",
"#574964"
];
function saveData() {
localStorage.setItem("trackerDataV2", JSON.stringify(savedData));
}
function renderMedicineList() {
medicineListEl.innerHTML = "";
savedData.medicines.forEach((med, index) => {
const tag = document.createElement("span");
tag.className = "medicine-tag";
tag.style.backgroundColor = med.color;
tag.innerHTML = `${med.name} <button title="Удалить">✖</button>`;
tag.querySelector("button").onclick = () => {
savedData.medicines.splice(index, 1);
Object.values(savedData.months).forEach(month => {
Object.values(month).forEach(day => {
delete day[med.name];
});
});
saveData();
renderMedicineList();
renderCalendar(currentDate);
};
medicineListEl.appendChild(tag);
});
}
function renderCalendar(date) {
calendarEl.innerHTML = "";
const year = date.getFullYear();
const month = date.getMonth();
const key = `${year}-${month + 1}`;
if (!savedData.months[key]) savedData.months[key] = {};
const firstDay = new Date(year, month, 1);
const lastDay = new Date(year, month + 1, 0);
const startDay = (firstDay.getDay() + 6) % 7;
calendarTitle.textContent = `${date.toLocaleString('ru', { month: 'long' })} ${year}`;
clearBtn.onclick = () => {
if (confirm("Очистить все отметки за этот месяц?")) {
delete savedData.months[key];
saveData();
renderCalendar(currentDate);
}
};
for (let i = 0; i < 7; i++) {
const el = document.createElement("div");
el.className = "day-name";
el.textContent = daysOfWeek[i];
calendarEl.appendChild(el);
}
for (let i = 0; i < startDay; i++) {
calendarEl.appendChild(document.createElement("div"));
}
for (let day = 1; day <= lastDay.getDate(); day++) {
const dayEl = document.createElement("div");
dayEl.className = "day";
const label = document.createElement("div");
label.textContent = day;
dayEl.appendChild(label);
const checkboxContainer = document.createElement("div");
checkboxContainer.className = "checkbox-container";
savedData.medicines.forEach((med, idx) => {
const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.style.accentColor = med.color;
const dayKey = `${day}`;
if (!savedData.months[key][dayKey]) savedData.months[key][dayKey] = {};
checkbox.checked = !!savedData.months[key][dayKey][med.name];
checkbox.addEventListener("change", () => {
if (!savedData.months[key][dayKey]) savedData.months[key][dayKey] = {};
savedData.months[key][dayKey][med.name] = checkbox.checked;
saveData();
});
checkboxContainer.appendChild(checkbox);
});
dayEl.appendChild(checkboxContainer);
calendarEl.appendChild(dayEl);
}
}
form.addEventListener("submit", (e) => {
e.preventDefault();
const name = newMedicineInput.value.trim();
if (!name) return;
if (savedData.medicines.length >= 10) {
alert("Можно добавить максимум 10 препаратов.");
return;
}
if (savedData.medicines.find(m => m.name === name)) {
alert("Такой препарат уже добавлен.");
return;
}
const color = colors[savedData.medicines.length % colors.length];
savedData.medicines.push({ name, color });
newMedicineInput.value = "";
saveData();
renderMedicineList();
renderCalendar(currentDate);
});
prevBtn.addEventListener("click", () => {
currentDate.setMonth(currentDate.getMonth() - 1);
renderCalendar(currentDate);
});
nextBtn.addEventListener("click", () => {
currentDate.setMonth(currentDate.getMonth() + 1);
renderCalendar(currentDate);
});
renderMedicineList();
renderCalendar(currentDate);