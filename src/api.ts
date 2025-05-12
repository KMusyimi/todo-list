import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  Query,
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
  createdAt: Date | '';
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
export type CompletedTask = Partial<MyProject>;
export type MyTask = {
  projectId: string;
  id: string;
  title: string;
  status: 'active' | 'overdue' | 'completed';
  dueDate: string;
  dueTime: string;
  priority: string;
  description: string;
  subtasks?: SubTaskEntity[];
  updatedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date | '';
} | null;

export type SubTaskEntity = {
  id: string;
  title: string;
  status: 'active' | 'completed';
  completedAt?: Date | null;
  createdAt: Date;
} | null;


export type CompleteTaskParams = Record<string, string>;
export type TaskRecordParams = Record<string, string>;
export type ProjectParams = Record<string, string>;
export type ActiveDates = Record<string, boolean>;

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const projectsRef = collection(db, 'projects');
const tasksRef = collection(db, 'tasks');
const recommendationsRef = collection(db, 'recommendations');

export const currentDate = new Date(Date.now());
const createdAt = currentDate;
const dateFormatted = moment(currentDate).local().format('YYYY-MM-DDTHH:mm');


// eslint-disable-next-line @typescript-eslint/no-misused-promises
setInterval(async () => await checkOverDueTasks(), 100 * 60);


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
      updatedAt: '',
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


export async function getProjects(date = '') {
  const qry = query(projectsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(qry);

  if (querySnapshot.empty) { return null }

  return await Promise.all(querySnapshot.docs.map(async (doc) => {
    const data = doc.data() as Project;
    const tasks = date ? await getTasksByDate(doc.id, date) : await getTasks(doc.id);
    return { ...data, id: doc.id, tasks } as MyProject;
  }));

}
export async function getFilteredProjects(date: string) {
  const projects = await getProjects(date);
  if (!projects) {
    return null;
  }
  return projects.filter(project => project && project.tasks.length > 0);
}


export async function getProject(id: string) {
  if (!id) { return null; }

  const docRef = doc(db, 'projects', id);
  const projectSnap = await getDoc(docRef);
  if (!projectSnap.exists()) { return null; }

  return {
    filteredTask: async (date: string) => {
      const data = projectSnap.data() as Project;
      const tasks = await getTasksByDate(id, date);
      return { ...data, id: projectSnap.id, tasks } as MyProject;
    },
    withoutTasks: () => {
      const data = projectSnap.data() as Project;
      return { ...data, id: projectSnap.id } as Project;
    },
    withTasks: async () => {
      const data = projectSnap.data() as Project;
      const tasks = await getTasks(id);
      return { ...data, id: projectSnap.id, tasks } as MyProject;
    }
  };
}


export async function addTask(task: TaskRecordParams): Promise<void> {
  try {
    delete task.id;
    delete task.intent;
    const docRef = await addDoc(tasksRef, {
      ...task,
      updatedAt: '',
      createdAt
    });
    console.log("Document updated with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
export async function addSubTask(task: TaskRecordParams): Promise<void> {
  const docRef = doc(db, 'tasks', task.taskId);
  try {
    const payload: SubTaskEntity = {
      id: task.id,
      title: task.title,
      status: 'active',
      createdAt: currentDate
    }
    await updateDoc(docRef, {
      subtasks: arrayUnion({ ...payload })
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function taskByQry(qry: Query) {
  const taskSnapshot = await getDocs(qry);
  if (taskSnapshot.empty) { return []; }


  return taskSnapshot.docs.map((doc) => {
    const taskData = doc.data();
    return { ...taskData, id: doc.id } as MyTask;
  });
}

async function getTasksByDate(id: string, date: string) {

  const qry = query(tasksRef, where('projectId', '==', id), where('dueDate', '==', date), orderBy('dueDate', 'asc'), orderBy('priority', 'desc'));
  return taskByQry(qry);
}

async function getTasks(id: string) {

  const qry = query(tasksRef, where('projectId', '==', id), orderBy('dueDate', 'asc'), orderBy('priority', 'desc'));
  return taskByQry(qry);
}

export async function getTask(id: string) {
  const docRef = doc(db, 'tasks', id);
  const taskSnap = await getDoc(docRef);
  if (!taskSnap.exists()) {
    return null;
  }
  const data = taskSnap.data();
  return { ...data, id: taskSnap.id } as MyTask;
}



export async function updateProject(payload: ProjectParams) {
  const dateFormatted = moment(currentDate).local().format('YYYY-MM-DDTHH:mm');
  const docRef = doc(db, 'projects', payload.id);
  try {
    await updateDoc(docRef, {
      ...payload,
      updatedAt: dateFormatted
    })

  } catch (e) {
    console.error(e);
  }
}

export async function getCompletedTasks() {
  const taskSnap = await getDocs(tasksRef);
  if (taskSnap.empty) {
    return null;
  }
  const tasks = taskSnap.docs.map((doc) => {
    const taskData = doc.data() as Partial<MyTask>;
    return { ...taskData, id: doc.id };
  }) as MyTask[];
  return { projectName: 'complete', iconColor: '#077A7D', tasks } as CompletedTask
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
  const dateFmt = moment(currentDate).local().format('YYYY-MM-DD');
  const timeFmt = moment().local().format('HH:mm');
  const qry = query(tasksRef, where('dueDate', '<=', dateFmt), where('dueTime', '<', timeFmt), where('status', '!=', 'overdue'));
  const taskSnapshot = await getDocs(qry);
  if (!taskSnapshot.empty) {
    return await Promise.all(taskSnapshot.docs.map(async (doc) => {
      const taskData = doc.data() as MyTask;
      if (taskData) {
        taskData.status = 'overdue';
        const status = taskData.status;
        console.log(status, taskData);
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

export async function updateTask(task: TaskRecordParams) {
  try {
    const docRef = doc(db, 'tasks', task.id);
    delete task.id;
    delete task.intent;
    await updateDoc(docRef, {
      ...task,
      updatedAt: dateFormatted
    });
  } catch (e) {
    console.error(e);
  }

}

export async function completeTask(payload: CompleteTaskParams) {
  try {
    const docRef = doc(db, 'tasks', payload.taskId);
    const taskSnap = await getDoc(docRef);
    const data = taskSnap.data() as MyTask;
    if (data) {
      await updateDoc(docRef, {
        status: payload.status,
        subtasks: [],
        completedAt: dateFormatted
      });
    }
  } catch (e) {
    console.error('error => ', e)
  }
}



export async function completeSubtask(payload: CompleteTaskParams) {
  try {
    const docRef = doc(db, 'tasks', payload.taskId);
    const taskSnap = await getDoc(docRef);
    const data = taskSnap.data() as MyTask;
    if (data) {
      const subtask = data.subtasks?.find(subtask => subtask?.id === payload.id)
      if (subtask) {
        subtask.status = 'completed';
      }
      await setDoc(docRef, { ...data });
    }
  } catch (e) {
    console.error('error => ', e)
  }
}

export async function deleteProject(payload: ProjectParams) {
  try {
    const project = await getProject(payload.id);
    const myProject = await project?.withTasks();
    if (myProject) {
      const { id, tasks } = myProject
      if (tasks.length > 0) {
        for (const task of tasks) {
          if (task) {
            const docRef = doc(db, 'tasks', task.id);
            await deleteDoc(docRef);
          }
        }

        console.log('deleted doc with id:', id);
      }
      await deleteDoc(doc(db, 'projects', myProject.id));
    }
  } catch (e) {
    console.error(e);
  }
}

export async function getActiveDates(id = '') {
  try {
    const obj: ActiveDates = {};
    const startDate = moment(currentDate).subtract(1, "days").format('YYYY-MM-DD');

    const qry = id ? query(tasksRef, where('projectId', '==', id), where('dueDate', '>=', startDate)) : query(tasksRef, where('dueDate', '>=', startDate));
    const taskSnapshot = await getDocs(qry);

    if (taskSnapshot.empty) { return null; }
    
    taskSnapshot.docs.forEach(doc => {
      const data = doc.data() as MyTask;
      if (data) {
        if (!obj[data.dueDate]) {
          obj[data.dueDate] = true;
        }
      }
    })
    return obj;
  } catch (e) {
    console.error(e);
  }
}




