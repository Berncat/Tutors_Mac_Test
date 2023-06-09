import { writable, type Writable } from "svelte/store";
import type { Lo, WeekType } from "../types/lo-types";
import { localStorageStore } from "@skeletonlabs/skeleton";
import type { Course } from "../models/course";

const weekType: WeekType = {
  title: "",
  type: "",
  date: "",
  dateObj: null
};

export const revealSidebar = writable(false);
export const revealOnline = writable(false);
export const week = writable(weekType);
export const courseUrl = writable("");
export const currentCourse: Writable<Course> = writable();
export const currentLo: Writable<Lo> = writable();
export const portfolio = writable(false);
export const layout = writable("");
export const currentPage= writable("");
export const transitionKey = writable("");
export const storeTheme = localStorageStore("storeTheme", "tutors");
export const storePreview = localStorageStore("storePreview", false);
export const authenticating: Writable<boolean> = writable(false);

export const tutorsJsonPath: Writable<boolean> = writable(true);
export const tutorsfile= writable("");