import { redirect } from "react-router-dom";
import { isProjectsEmpty } from "./api";

type Days = string[];

export const daysInWeekArr: Days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];



export async function checkUserProjects() {
  const isEmpty = await isProjectsEmpty();

  return {
    hasNoProjects: () => {
      if (!isEmpty) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw redirect('/projects');
      }
      return null;
    },
    hasProjects: () => {
      if (isEmpty) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw redirect('/');
      }
      return null;
    }
  }
}

