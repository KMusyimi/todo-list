import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
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

interface Project {
  id: string;
  projectName: string;
  createdAt: number;
}

export interface Recommendations {
  id: string;
  names: string[];
  createdAt?: Date;
}

export interface MyTodo {
  projectId: string;
  todos: {
    title: string;
    dueDate: string;
    isDue: boolean;
    priority: number;
    description: string;
    notes: string;
    updatedAt?: Date;
    createdAt?: Date;
  }[]

}
const recs = ['personal', 'design', 'work', 'house', 'web development', 'construction', 'fishing', 'travel', 'solo project', 'music', 'outdoor', 'family']
// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const projectsRef = collection(db, 'projects');
const todosRef = collection(db, 'todos');
const recommendationsRef = collection(db, 'recommendations')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      createdAt: Date.now(),
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id.toString();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


export async function getProjects(): Promise<{
  projectName: string | undefined;
  createdAt: number | undefined;
  id: string;
}[]> {
  const qry = query(projectsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(qry);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    const { projectName, createdAt }: Partial<Project> = data;
    return { projectName, createdAt, id: doc.id }
  });
}

export async function addTodos(todo: MyTodo): Promise<void> {
  try {
    const myTodo = todo.todos.map(todo => ({ ...todo, createdAt: Date.now(), updateAt: '' }));
    const qry = query(todosRef, where('projectId', '==', todo.projectId));
    const querySnapshot = await getDocs(qry);

    if (!querySnapshot.empty) {
      const id = querySnapshot.docs.map(doc => doc.id);
      const todoRef = doc(db, 'todos', ...id);
      await updateDoc(todoRef, { todos: arrayUnion(...myTodo) });
      console.log("Document updated with ID: ", ...id);
      return;
    }
    const docRef = await addDoc(todosRef, { projectId: todo.projectId, todos: myTodo });
    console.log("Document written with ID: ", docRef.id);


  } catch (e) {
    console.error("Error adding document: ", e);
  }
}



export async function getTodos(id: string | undefined) {
  const qry = query(todosRef, where('projectId', '==', id));
  const querySnapshot = await getDocs(qry);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    const { todos }: Partial<MyTodo> = data;
    if (todos) {
      return { id: doc.id, todos };
    }
    return null;
  })[0];
}

export function getProjectName() {
  return {
    projectName: async (id: string | undefined) => {
      if (id) {
        const docRef = doc(db, 'projects', id);
        const projectSnapshot = await getDoc(docRef);
        const data = projectSnapshot.data();
        if (data) {
          const { projectName } = data;
          return (projectName ?? 'New Project') as string;
        }
      }
    }
  };
}
