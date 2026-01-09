import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initCharts, updatePowerChart, updateVoltageChart } from "./chart.js";

const firebaseConfig = {
    apiKey: "AIzaSyCr04dfdSKJn22sVHr8zmo5FImm_FYzbQk",
    authDomain: "monitoring-e8493.firebaseapp.com",
    databaseURL: "https://monitoring-e8493-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "monitoring-e8493",
    storageBucket: "monitoring-e8493.appspot.com",
    messagingSenderId: "118411333054",
    appId: "1:118411333054:web:6492931cf42f1418403def"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

signInWithEmailAndPassword(auth, "habiibsantri@gmail.com", "habiibltd24").then(() => startDashboard());

function startDashboard() {
    initCharts();
    setInterval(() => { document.getElementById("date").innerText = new Date().toLocaleString('id-ID'); }, 1000);

    for (let i = 1; i <= 4; i++) {
        const btn = document.getElementById(`btn-${i}`);
        const lampRef = ref(db, `devices/lamp${i}`);
        btn.onclick = () => set(lampRef, !btn.classList.contains('on'));
        onValue(lampRef, (snap) => { btn.className = `lamp-btn ${snap.val() ? 'on' : 'off'}`; });
    }

    onValue(ref(db, 'sensors'), (snap) => {
        const data = snap.val();
        if (data) {
            const powerVal = Number(data.power || 0);
            document.getElementById("power").innerText = powerVal.toFixed(1);
            updatePowerChart(powerVal);

            const voltVal = Number(data.voltage || 0);
            const voltEl = document.getElementById("voltage");
            voltEl.innerText = voltVal.toFixed(1);
            voltEl.style.color = voltVal < 180 ? "#ff4d4d" : "#00f2ff";
            updateVoltageChart(voltVal);

            for (let i = 1; i <= 3; i++) {
                const val = data[`ldr${i}`] || 0;
                const el = document.getElementById(`ldr${i}`);
                el.innerText = `LDR: ${val} (${val > 2000 ? "Terang" : "Gelap"})`;
                el.style.color = val > 2000 ? "#ffea00" : "#aaa";
            }
        }
    });

    document.getElementById("saveSchedule").onclick = () => {
        set(ref(db, 'schedule'), { on: document.getElementById("onTime").value, off: document.getElementById("offTime").value });
    };
    onValue(ref(db, 'schedule'), (snap) => {
        if (snap.val()) document.getElementById("scheduleInfo").innerText = `ON: ${snap.val().on} | OFF: ${snap.val().off}`;
    });
}