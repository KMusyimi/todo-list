import { redirect } from "react-router-dom";
import { isProjectsEmpty } from "./api";

// type Days = string[];

// export const daysInWeekArr: Days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const colors = ['#FF4848', '#5D50C6', '#F85E9F', '#F02A71', '#EBC7E8', '#BFACE0', '#5D1451', '#14868C', '#94CECA', '#AACB73', '#CDE990', '#FFE26F', '#FFE700', '#1DCD9F', '#00CF95', '#0098EF']

export function hexToRGB(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}


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

