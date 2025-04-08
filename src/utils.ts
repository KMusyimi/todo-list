import { redirect } from "react-router-dom";
import { isProjectsEmpty } from "./api";

type Days = string[];

export const daysInWeekArr: Days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const colors = ['#FF4848', '#5D50C6', '#F85E9F', '#F02A71', '#EBC7E8', '#BFACE0', '#5D1451', '#14868C', '#94CECA', '#AACB73', '#CDE990', '#FFE26F', '#FBFF5F', '#D1FFA2', '#00CF95', '#0098EF']


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

