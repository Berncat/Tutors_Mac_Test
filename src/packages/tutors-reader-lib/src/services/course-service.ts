import { courseUrl, currentCourse, currentLo, week} from "../stores/stores";
import { Course } from "../models/course";
import { Lab } from "../models/lab";
import type { Lo } from "../types/lo-types";
import type { Topic } from "../models/topic";
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { readTextFile } from '@tauri-apps/api/fs';
import { tutorsfile } from "../stores/stores";

let name = ""

tutorsfile.subscribe((path) => {
  console.log(`file: ${name}`)
  name = path
})

export const courseService = {
  course: Course,

  convertAssets(jsonObject: object, assetType: string, assetPath: string): object {
		if (typeof jsonObject == 'object' && jsonObject != null) {
			for (const key in jsonObject) {
				if (key == assetType && jsonObject[key] != '') {
					jsonObject[assetType] = convertFileSrc(jsonObject[assetPath]);
				} else if (typeof jsonObject == 'object' && jsonObject != null) {
					this.convertAssets(jsonObject[key], assetType, assetPath);
				}
			}
		}
		return jsonObject;
	},

	async convertTutorsJson() {
		let tutorsJson = JSON.parse(await readTextFile(name));
		tutorsJson = this.convertAssets(tutorsJson, 'img', 'imgPath');
		tutorsJson = this.convertAssets(tutorsJson, 'pdf', 'pdfPath');
		tutorsJson = this.convertAssets(tutorsJson, 'zip', 'zipPath');
		return tutorsJson;
	},

  async getOrLoadCourse(courseId: string): Promise<Course> {
    const courseUrl = courseId;
      try {
        const loadtime = Date.now()
				console.log(`load start: ${loadtime}`);
        const data = await this.convertTutorsJson()
        console.log(data);
        const course = new Course(data, courseId, courseUrl);
        const loadfinish = Date.now()
				console.log(`load finsh: ${loadfinish}`);
        return course;
      } catch (error) {
        console.log(error);
        throw error;
      }
  },

  async readCourse(courseId: string): Promise<Course> {
    const readCourse = Date.now()
    console.log(`read course: ${readCourse }`);
    const course = await this.getOrLoadCourse(courseId);
    currentCourse.set(course);
    courseUrl.set(course.url);
    week.set(course?.currentWeek);
    this.course = course;
    return course;
  },

  async readTopic(courseId: string, topicId: string): Promise<Topic> {
    console.log("readTopic")
    const course = await this.readCourse(courseId);
    const topic = course.topicIndex.get(topicId);
    currentLo.set(topic.lo);
    return topic;
  },

  async readLab(courseId: string, labId: string): Promise<Lab> {
    console.log("readLab")
    const course = await this.readCourse(courseId);

    const lastSegment = labId.substring(labId.lastIndexOf("/") + 1);
    if (!lastSegment.startsWith("book")) {
      labId = labId.substr(0, labId.lastIndexOf("/"));
    }
    const lo = course.loIndex.get(labId);
    let lab = course.hydratedLabs.get(labId);
    if (!lab) {
      lab = new Lab(course, lo, labId);
      course.hydratedLabs.set(labId, lab);
    }
    currentLo.set(lab.lo);
    return lab;
  },

  async readWall(courseId: string, type: string): Promise<Lo[]> {
    console.log("readWall")
    const course = await this.readCourse(courseId);
    const wall = course.walls.get(type);
    return wall;
  },

  async readLo(courseId: string, loId: string): Promise<Lo> {
    console.log("readLo")
    const course = await this.readCourse(courseId);
    const lo = course.loIndex.get(loId);
    currentLo.set(lo);
    return lo;
  }
};
