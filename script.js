<script>
  // ✅ إعداد Firebase
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

  // ✅ التنقل بين الأقسام
  function showSection(id) {
    document.querySelectorAll('.panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
  }

  // ✅ تحميل الإحصائيات
  async function loadStats() {
    try {
      const usersSnap = await db.collection("users").get();
      const postsSnap = await db.collection("posts").get();
      const videosSnap = await db.collection("videos").get();
      const livesSnap = await db.collection("live_streams").get();
      const giftsSnap = await db.collection("gifts").get();

      document.getElementById("userCount").textContent = usersSnap.size;
      document.getElementById("postCount").textContent = postsSnap.size;
      document.getElementById("videoCount").textContent = videosSnap.size;
      document.getElementById("liveCount").textContent = livesSnap.size;
      document.getElementById("giftCount").textContent = giftsSnap.size;

      loadUsers(usersSnap);
    } catch (error) {
      console.error("❌ خطأ في تحميل الإحصائيات:", error);
    }
  }

  // ✅ عرض المستخدمين
  function loadUsers(snapshot) {
    const userList = document.getElementById("userList");
    userList.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `
        ${data.name || doc.id} - ${data.coins || 0} كوينز
        <button onclick="banUser('${doc.id}')">حظر</button>
        <button onclick="addCoins('${doc.id}', 100)">+100 كوينز</button>
      `;
      userList.appendChild(li);
    });
  }

  // ✅ شحن كوينز يدوي
  document.addEventListener("DOMContentLoaded", () => {
    loadStats();

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

  // ✅ حظر مستخدم
  async function banUser(userId) {
    try {
      await db.collection("users").doc(userId).update({ banned: true });
      alert(`🚫 تم حظر المستخدم ${userId}`);
    } catch (error) {
      console.error("❌ خطأ في الحظر:", error);
      alert("فشل في الحظر");
    }
  }

  // ✅ شحن مباشر من القائمة
  async function addCoins(userId, amount) {
    try {
      await db.collection("users").doc(userId).update({
        coins: firebase.firestore.FieldValue.increment(amount)
      });
      alert(`✅ تم شحن ${amount} كوينز للمستخدم ${userId}`);
    } catch (error) {
      console.error("❌ خطأ في الشحن:", error);
      alert("فشل في الشحن");
    }
  }
</script>
