import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc
} from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY as string,
  authDomain: "todo-app-53bcd.firebaseapp.com",
  projectId: "todo-app-53bcd",
  storageBucket: "todo-app-53bcd.firebasestorage.app",
  messagingSenderId: "627588620012",
  appId: "1:627588620012:web:9c64e9dd5fc43a72af4fc9"
};


export interface Recommendations {
  id: string;
  names: string[];
  createdAt?: Date;
}

export interface MyTodo {
  id: string;
  projectName: string;
  tasks: MyTask;
  createdAt: number;
  updatedAt: number;
}

export type MyTask = {
  todoId: string;
  title: string;
  dueDate: string;
  isDue: boolean;
  priority: number;
  description: string;
  notes: string;
  isCompleted: boolean;
  updatedAt: number;
  createdAt: number;
}[];

// const recs = ['personal', 'design', 'work', 'house', 'web development', 'construction', 'fishing', 'travel', 'solo project', 'music', 'outdoor', 'family']
// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const projectsRef = collection(db, 'projects');
const recommendationsRef = collection(db, 'recommendations')


// async function addRecommendations() {
//   try {
//     const docRef = await addDoc(recommendationsRef, {
//       names: recs,
//       createdAt: Date.now()
//     })
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// }

export async function getRecommendations() {
  const querySnapshot = await getDocs(recommendationsRef);
  if (!querySnapshot.empty) {
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const names = data.names as string[];
      return { names, id: doc.id };
    })[0];
  }
  return null;
}

export async function addProject(projectName: FormDataEntryValue) {
  try {
    const docRef = await addDoc(projectsRef, {
      projectName: projectName,
      tasks: [],
      createdAt: Date.now(),
      updateAt: '',
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id.toString();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function isProjectsEmpty(): Promise<boolean> {
  const querySnapshot = await getDocs(projectsRef);
  return querySnapshot.empty;
}


export async function getProjects() {
  const qry = query(projectsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(qry);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as MyTodo;
    return { ...data, id: doc.id }
  });
}

export async function updateTasks(task: MyTodo): Promise<void> {
  try {
    const docRef = doc(db, 'projects', task.id);
    await updateDoc(docRef, { tasks: arrayUnion(...task.tasks) });
    console.log("Document updated with ID: ", task.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


export function getProject() {
  return {
    project: async (id: string | undefined) => {
      if (id) {
        const docRef = doc(db, 'projects', id);
        const projectSnapshot = await getDoc(docRef);
        const data = projectSnapshot.data() as MyTodo;
        return { ...data, id: projectSnapshot.id }
      }
    }
  };
}
