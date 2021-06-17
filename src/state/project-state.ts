import {Project} from "../models/project";
import {ProjectStatus} from "../models/project";

// type Listener = (items) => void
type Listener<T> = (items: T[]) => void;

// Base class for state management
export abstract class State<T> {
  protected listeners: Listener<T>[] = [];

  protected constructor() {
  }

  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }

}

// Project State Management class
export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;
  private draggable: Project | null = null;

  get currentDraggable() {
    return Object.create(this.draggable);
  }

  set currentDraggable(value: Project | null) {
    this.draggable = Object.create(value);
  }

  private constructor() {
    super();
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);

    this.projects.push(newProject);
    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    return new ProjectState();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const prj = this.projects.find(p => p.id === projectId);

    if (prj && prj.status !== newStatus) {
      prj.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }

}

export const projectState = ProjectState.getInstance();

