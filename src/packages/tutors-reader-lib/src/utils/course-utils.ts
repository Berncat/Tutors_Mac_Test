/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IconType } from "../types/icon-types";
import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs';

export interface CourseSummary {
  title: string;
  visits: number;
  count: number;
  img: string;
  icon: IconType;
  route: string;
  isPrivate: boolean;
  currentLo: any;
  studentIds: Set<string>;
}

export async function getCourseSummary(courseId: string): Promise<CourseSummary> {
  const response = await readTextFile('tutors.json', { dir: BaseDirectory.App });
  const lo = JSON.parse(response)
  const courseTime: CourseSummary = {
    title: lo.title,
    img: lo.img,
    icon: lo.properties?.icon,
    route: lo.route,
    visits: 0,
    count: 0,
    isPrivate: lo.properties?.private,
    currentLo: null,
    studentIds: new Set<string>()
  };
  return courseTime;
}

