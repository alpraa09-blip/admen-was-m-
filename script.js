// ✅ استيراد Firebase
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  increment
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ تحقق من الإدمن
onAuthStateChanged(auth, (user) => {
  if (user && user.email === "admin@soshial.com") {
    loadDashboard();
  } else {
    alert("صلاحيات غير كافية للدخول إلى لوحة التحكم");
  }
});

// ✅ تحميل البيانات
async function loadDashboard() {
  const usersSnap = await getDocs(collection(db, "users"));
  const postsSnap = await getDocs(collection(db, "posts"));
  const videosSnap = await getDocs(collection(db, "videos"));
  const livesSnap = await getDocs(collection(db, "live_streams"));
  const giftsSnap = await getDocs(collection(db, "gifts"));

  // الإحصائيات
  document.getElementById("userCount").textContent = usersSnap.size;
  document.getElementById("postCount").textContent = postsSnap.size;
  document.getElementById("videoCount").textContent = videosSnap.size;
  document.getElementById("liveCount").textContent = livesSnap.size;
  document.getElementById("giftCount").textContent = giftsSnap.size;

  // المستخدمين
  const userList = document.getElementById("userList");
  usersSnap.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      ${data.name || doc.id} - ${data.coins || 0} كوينز
      <button onclick="banUser('${doc.id}')">حظر</button>
      <button onclick="addCoins('${doc.id}', 100)">+100 كوينز</button>
    `;
    userList.appendChild(li);
  });

  // المنشورات
  const postList = document.getElementById("postList");
  postsSnap.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      ${data.caption || "منشور بدون وصف"}
      <button onclick="deletePost('${doc.id}')">حذف</button>
    `;
    postList.appendChild(li);
  });

  // الفيديوهات
  const videoList = document.getElementById("videoList");
  videosSnap.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      فيديو: ${data.title || "بدون عنوان"}
      <button onclick="deleteVideo('${doc.id}')">حذف</button>
    `;
    videoList.appendChild(li);
  });

  // البثوث المباشرة
  const liveList = document.getElementById("liveList");
  livesSnap.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      بث: ${data.streamer || doc.id} - مشاهدين: ${data.viewers || 0}
      <button onclick="endLive('${doc.id}')">إنهاء البث</button>
    `;
    liveList.appendChild(li);
  });

  // الهدايا
  const giftList = document.getElementById("giftList");
  giftsSnap.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.name || "هدية"} - ${data.price || 0} كوينز`;
    giftList.appendChild(li);
  });
}

// ✅ وظائف التحكم

// حظر مستخدم
async function banUser(userId) {
  await updateDoc(doc(db, "users", userId), {
    banned: true
  });
  alert("تم حظر المستخدم");
}

// شحن كوينز
document.getElementById("chargeCoinsBtn").addEventListener("click", async () => {
  const userId = document.getElementById("userIdInput").value;
  const amount = parseInt(document.getElementById("coinAmount").value);
  if (userId && amount > 0) {
    await updateDoc(doc(db, "users", userId), {
      coins: increment(amount)
    });
    alert(`تم شحن ${amount} كوينز للمستخدم ${userId}`);
  } else {
    alert("يرجى إدخال بيانات صحيحة");
  }
});

// حذف منشور
async function deletePost(postId) {
  await deleteDoc(doc(db, "posts", postId));
  alert("تم حذف المنشور");
}

// حذف فيديو
async function deleteVideo(videoId) {
  await deleteDoc(doc(db, "videos", videoId));
  alert("تم حذف الفيديو");
}

// إنهاء بث مباشر
async function endLive(liveId) {
  await deleteDoc(doc(db, "live_streams", liveId));
  alert("تم إنهاء البث");
}
