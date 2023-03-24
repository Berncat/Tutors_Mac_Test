/* eslint-disable @typescript-eslint/no-explicit-any */
import { FluentIconLib } from "./support/fluent-icons";
import type { IconType } from "../../../../tutors-reader-lib/src/types/icon-types";

let StandardIconLib = FluentIconLib;

export function setIconLib(iconLib: any) {
  StandardIconLib = iconLib;
}

export const themes = ["tutors", "tutors-dark", "tutors-black", "tutors-dyslexia", "tutors-wireframe"];

export const themeIcons = {
  tutors: FluentIconLib,
  "tutors-dark": FluentIconLib,
  "tutors-dyslexia": FluentIconLib,
  "tutors-black": FluentIconLib,
  "tutors-wireframe": FluentIconLib
};

export function getIcon(type: string): IconType {
  let icon: IconType = StandardIconLib.default;
  if (currentIconLib[type]) {
    icon = currentIconLib[type];
  } else {
    if (StandardIconLib[type as keyof typeof StandardIconLib]) {
      icon = StandardIconLib[type as keyof typeof StandardIconLib];
    }
  }
  return icon;
}

export const currentIconLib: any = StandardIconLib;

export function addIcon(type: string, icon: IconType) {
  StandardIconLib[type as keyof typeof StandardIconLib] = icon;
}
