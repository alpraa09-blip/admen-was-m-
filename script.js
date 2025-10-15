const firebaseConfig = {
  apiKey: "AIzaSyAtJKG2p4mfbxYLqVZHcu7t_YOSx15ts14",
  authDomain: "soshial-9932a.firebaseapp.com",
  projectId: "soshial-9932a",
  storageBucket: "soshial-9932a.appspot.com",
  messagingSenderId: "678676776751",
  appId: "1:678676776751:web:165b761716f6df2b3f03da",
  measurementId: "G-4LL3LE15P9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function showSection(id) {
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
  const chargeBtn = document.getElementById("chargeCoinsBtn");

  chargeBtn.addEventListener("click", async () => {
    const userId = document.getElementById("userIdInput").value.trim();
    const amount = parseInt(document.getElementById("coinAmount").value);

    if (!userId || isNaN(amount) || amount <= 0) {
      alert("⚠️ يرجى إدخال ID صحيح وعدد كوينز أكبر من 0");
      return;
    }

    try {
      const userRef = db.collection("users").doc(userId);
      await userRef.update({
        coins: firebase.firestore.FieldValue.increment(amount)
      });
      alert(`✅ تم شحن ${amount} كوينز للمستخدم ${userId}`);
    } catch (error) {
      console.error("❌ خطأ في الشحن:", error);
      alert("فشل في الشحن. تأكد من ID المستخدم أو الاتصال بـ Firebase");
    }
  });
});
