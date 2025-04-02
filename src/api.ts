import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import moment from "moment";

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

export interface Project {
  id: string;
  projectName: string;
  updatedAt?: Date | null;
  createdAt: Date;
}

export type MyProject = {
  id: string;
  projectName: string;
  tasks: MyTask[]
  updatedAt?: Date | null;
  createdAt: Date;
} | null;

export type MyProjects = MyProject[];
export interface MyTask {
  projectId: string;
  id: string;
  title: string;
  status: 'active' | 'overdue' | 'completed';
  dueDate: Date | string;
  priority: number;
  description: string;
  notes: string;
  updatedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
}



export type CompleteTaskParams = Record<string, string>;
// const recs = ['personal', 'design', 'work', 'house', 'web development', 'construction', 'fishing', 'travel', 'solo project', 'music', 'outdoor', 'family']
// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const projectsRef = collection(db, 'projects');
const tasksRef = collection(db, 'tasks');
const recommendationsRef = collection(db, 'recommendations');

const currentDate = new Date(Date.now());
const createdAt = currentDate;


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


// eslint-disable-next-line @typescript-eslint/no-misused-promises
setInterval(async ()=> await checkOverDueTasks(), 1000*60);


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
      updateAt: '',
      createdAt
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
  return await Promise.all(querySnapshot.docs.map(async (doc) => {
    const data = doc.data() as Project;
    const tasks = await getTasks(doc.id);
    return { ...data, id: doc.id, tasks };
  })) as MyProjects;
}

export async function getProjectNames() {
  const projectsSnapshot = await getDocs(projectsRef);
  if (projectsSnapshot.empty) { return null; }
  return projectsSnapshot.docs.map((doc) => {
    const data = doc.data() as Project;
    return { ...data, id: doc.id };
  }) as Project[]
}


export async function addTask(task: Record<string, FormDataEntryValue>): Promise<void> {
  try {
    const dueDate = task.dueDate as unknown as Date;
    const docRef = await addDoc(tasksRef, {
      ...task,
      dueDate,
      status: 'active',
      priority: Number(task.priority),
      updatedAt: '',
      createdAt
    });
    console.log("Document updated with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function getTasks(id: string) {
  const q = query(tasksRef, where('projectId', '==', id), orderBy('priority', 'desc'), orderBy('dueDate', 'asc'));

  const taskSnapshot = await getDocs(q);
  const completedTask = await getCompletedTasks(id);

  if (taskSnapshot.empty) { return []; }

  const tasks = taskSnapshot.docs.map((doc) => {
    const taskData = doc.data() as MyTask;
    return { ...taskData, id: doc.id };
  }) as MyTask[];

  if (completedTask) {
    return [...tasks, ...completedTask] as unknown as MyTask[]
  }

  return tasks;
}


async function getCompletedTasks(id: string) {
  const qry = query(tasksRef, where('projectId', '==', id), where('status', '==', 'completed'));
  const taskSnap = await getDocs(qry);
  if (!taskSnap.empty) {
    return taskSnap.docs.map((doc) => {
      const taskData = doc.data() as Partial<MyTask>;
      return { ...taskData, id: doc.id };
    }) as MyTask[];
  } else {
    return null
  }
}

async function checkOverDueTasks() {
  const currentDateFmt = moment(new Date(Date.now())).local().format('YYYY-MM-DDTHH:mm');
  const qry = query(tasksRef, where('dueDate', '<', currentDateFmt));
  const taskSnapshot = await getDocs(qry);
  
  if (!taskSnapshot.empty) {
    return await Promise.all(taskSnapshot.docs.map(async(doc) => {
      const taskData = doc.data() as MyTask;
      taskData.status = 'overdue';
      const status = taskData.status;
      await updateOverDueTask(doc.id, status);
    }))
  }
}

async function updateOverDueTask(id: string, status: string) {
  const docRef = doc(db, 'tasks', id);
  await updateDoc(docRef, {
    status
  });
}


export async function completeTask(params: CompleteTaskParams) {
  try {
    const docRef = doc(db, 'tasks', params.taskId);
    const taskSnap = await getDoc(docRef);
    const data = taskSnap.data() as MyTask;

    await setDoc(docRef, {
      projectId: data.projectId,
      title: data.title,
      status: 'completed',
      completedAt: currentDate,
      createdAt: data.createdAt
    });
  } catch (e) {
    console.error('error => ', e)
  }
}



export function getProject() {
  return {
    project: async (id: string | undefined) => {
      if (!id) { return null; }

      const docRef = doc(db, 'projects', id);
      const projectSnap = await getDoc(docRef);
      if (!projectSnap.exists()) { return null; }

      const data = projectSnap.data() as Project;
      const tasks = await getTasks(projectSnap.id);
      return { ...data, id: projectSnap.id, tasks } as MyProject;
    }
  };
}

