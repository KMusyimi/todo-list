import {
  addDoc,
  collection,
  deleteDoc,
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
  iconColor: string;
  updatedAt?: Date | null;
  createdAt: Date| '';
}

export type MyProject = {
  id: string;
  projectName: string;
  iconColor: string;
  tasks: MyTask[]
  updatedAt?: Date | null;
  createdAt: Date | '';
} | null;

export type MyProjects = MyProject[];

export type MyTask = {
  projectId: string;
  id: string;
  title: string;
  status: 'active' | 'overdue' | 'completed';
  dueDate: string;
  dueTime: string;
  priority: number | string;
  description: string;
  notes: string;
  updatedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date | '';
} | null;



export type CompleteTaskParams = Record<string, string>;
export type UpdateTaskParams = Record<string, string>;

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const projectsRef = collection(db, 'projects');
const tasksRef = collection(db, 'tasks');
const completedRef = collection(db, 'completed');
const recommendationsRef = collection(db, 'recommendations');

export const currentDate = new Date(Date.now());
const createdAt = currentDate;
const dateFormatted = moment(currentDate).local().format('YYYY-MM-DDTHH:mm');


// eslint-disable-next-line @typescript-eslint/no-misused-promises
setInterval(async () => await checkOverDueTasks(), 1000 * 60);


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

export async function addProject(payload: Record<string, FormDataEntryValue>) {
  try {
    const docRef = await addDoc(projectsRef, {
      ...payload,
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


export async function getProjects(date: string) {
  const qry = query(projectsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(qry);
  if (querySnapshot.empty) { return null }
  return await Promise.all(querySnapshot.docs.map(async (doc) => {
    const data = doc.data() as Project;
    const tasks = await getTasks(doc.id, date);
    return { ...data, id: doc.id, tasks };
  })) as MyProjects;
}

export function getProject() {
  return {
    project: async (id: string | undefined, date: string) => {
      if (!id) { return null; }

      const docRef = doc(db, 'projects', id);
      const projectSnap = await getDoc(docRef);
      if (!projectSnap.exists()) { return null; }
      const data = projectSnap.data() as Project;
      const tasks = await getTasks(id, date);
      let project = { ...data, id: projectSnap.id, tasks } as MyProject;

      if (!date) {
        const completedTask = await getCompletedTasks(id);
        if (completedTask) {
          project = { ...project, tasks: [...tasks, ...completedTask] } as MyProject;
        }
      }
      return project;
    }
  };
}


export async function addTask(task: UpdateTaskParams): Promise<void> {
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

async function getTasks(id: string, date = '') {
  const dateFmt = moment(date).format('YYYY-MM-DD');

  const qry = date ? query(tasksRef, where('projectId', '==', id), where('dueDate', '==', dateFmt), orderBy('dueDate', 'asc')) : query(tasksRef, where('projectId', '==', id), orderBy('priority', 'desc'), orderBy('dueDate', 'asc'));

  const taskSnapshot = await getDocs(qry);
  if (taskSnapshot.empty) { return []; }

  return taskSnapshot.docs.map((doc) => {
    const taskData = doc.data() as MyTask;
    return { ...taskData, id: doc.id };
  }) as MyTask[];
}

async function getCompletedTasks(id: string) {
  const qry = query(completedRef, where('projectId', '==', id));
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

export async function deleteTask(id: string) {
  try {
    const docRef = doc(db, 'tasks', id);
    await deleteDoc(docRef);
    console.log('deleted doc with id:', id);

  } catch (e) {
    console.error('err=> ', e);
  }
}

async function checkOverDueTasks() {
  const qry = query(tasksRef, where('dueDate', '<', dateFormatted));
  const taskSnapshot = await getDocs(qry);

  if (!taskSnapshot.empty) {
    return await Promise.all(taskSnapshot.docs.map(async (doc) => {
      const taskData = doc.data() as MyTask;
      if (taskData){
        taskData.status = 'overdue';
        const status = taskData.status;
        await updateOverDueTask(doc.id, status);
      }
    }));
  }
}

async function updateOverDueTask(id: string, status: string) {
  const docRef = doc(db, 'tasks', id);
  await updateDoc(docRef, {
    status
  });
}

export async function updateTask(task:UpdateTaskParams) {
  try{
    const docRef = doc(db, 'tasks', task.id);
    await setDoc(docRef, {
      ...task,
      updatedAt: dateFormatted
    });
  }catch (e){
    console.error(e);
  }
  
}

export async function completeTask(params: CompleteTaskParams) {
  try {
    const docRef = doc(db, 'tasks', params.taskId);
    const taskSnap = await getDoc(docRef);
    const data = taskSnap.data() as MyTask;
    if (data){
      await addDoc(completedRef, {
        projectId: data.projectId,
        title: data.title,
        status: 'completed',
        completedAt: currentDate,
        createdAt: data.createdAt
      });
      await deleteDoc(docRef);
    }
  } catch (e) {
    console.error('error => ', e)
  }
}




