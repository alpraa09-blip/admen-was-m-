import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
const auth = getAuth();
const db = getFirestore(app);

document.getElementById("loginBtn").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => {
      loadDashboard();
    });
});

async function loadDashboard() {
  const usersSnap = await getDocs(collection(db, "users"));
  const postsSnap = await getDocs(collection(db, "posts"));

  document.getElementById("userCount").textContent = usersSnap.size;
  document.getElementById("postCount").textContent = postsSnap.size;

  const userList = document.getElementById("userList");
  usersSnap.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.data().name || doc.id;
    userList.appendChild(li);
  });

  const postList = document.getElementById("postList");
  postsSnap.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.data().caption || "منشور بدون وصف";
    postList.appendChild(li);
  });
}
