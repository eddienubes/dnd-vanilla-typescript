// Drag & Drop Interfaces
interface IDraggable {
  dragStartHandler(event: DragEvent): void;

  dragEndHandler(event: DragEvent): void;
}

interface IDragTarget {
  dragOverHandler(event: DragEvent): void;

  dropHandler(event: DragEvent): void;

  dragLeaveHandler(event: DragEvent): void;

  dragEnterHandler(event: DragEvent): void;
}

// Base class for state management
abstract class State<T> {
  protected listeners: Listener<T>[] = [];

  protected constructor() {
  }

  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }

}


// Component base class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  protected constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(templateId) as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId) as T;

    const importedNode = document.importNode(this.templateElement.content, true);

    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element);
  }

  abstract renderContent(): void;

  abstract configure(): void;
}

// type Listener = (items) => void
type Listener<T> = (items: T[]) => void;


// enum for project status
enum ProjectStatus {
  Active,
  Finished
}

// Project class
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {
  }
}


// Project State Management class
class ProjectState extends State<Project> {
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

const projectState = ProjectState.getInstance();

// validation
interface IValidatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatable: IValidatable) {
  let isValid = true;
  if (validatable.required && validatable.value != null) {
    isValid = isValid && validatable.value.toString().trim().length !== 0;
  }

  if (validatable.minLength != null && typeof validatable.value === 'string') {
    isValid = isValid && validatable.value.trim().length >= validatable.minLength;
  }

  if (validatable.maxLength != null && typeof validatable.value === 'string') {
    isValid = isValid && validatable.value.trim().length <= validatable.maxLength;
  }

  if (validatable.min != null && typeof validatable.value === 'number') {
    isValid = isValid && validatable.value >= validatable.min;
  }

  if (validatable.max != null && typeof validatable.value === 'number') {
    isValid = isValid && validatable.value <= validatable.max;
  }

  return isValid;
}

//autobind decorator
function FunctionBinder(_: any, _2: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalFn = descriptor.value;

  return {
    enumerable: true,
    configurable: true,
    get() {
      return originalFn.bind(this);
    }
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');
    console.log('Rendered projects input!');
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
  }

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const description = this.descriptionInputElement.value;
    const people = this.peopleInputElement.value;

    const titleValidatable: IValidatable = {
      value: title,
      required: true
    }

    const descriptionValidatable: IValidatable = {
      value: description,
      required: true
    }

    const peopleValidatable: IValidatable = {
      value: +people,
      required: true,
      min: 2,
      max: 6
    }

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invalid input, please try again');
      return;
    } else {
      return [title, description, +people];
    }
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() {
  }

  @FunctionBinder
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }


}

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements IDragTarget {
  assignedProjects: Project[];

  constructor(private type: ProjectStatus) {
    super('project-list', 'app', false, `${type === ProjectStatus.Active ? 'active' : 'finished'}-projects`);
    this.assignedProjects = [];
    console.log('Rendered projects list! ', type);

    this.configure();
    this.renderContent();
  }

  renderContent() {
    this.element.querySelector('ul')!.id = `${this.type === ProjectStatus.Active ? 'active' : 'finished'}-projects-list`;
    this.element.querySelector('h2')!.textContent = ProjectStatus[this.type] + ' PROJECTS';
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter(p => {
        return p.status === this.type;
      });
      this.renderProjects();
    });

    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragenter', this.dragEnterHandler);
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type === ProjectStatus.Active ? 'active' : 'finished'}-projects-list`) as HTMLElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      new ListItem(this.element.querySelector('ul')!.id, prjItem)
    }
  }

  @FunctionBinder
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      const listEl = this.element.querySelector('ul') as HTMLUListElement;
      listEl.classList.add('droppable');
      event.preventDefault();
    }
  }

  @FunctionBinder
  dropHandler(event: DragEvent) {
    const {id} = JSON.parse(event.dataTransfer!.getData('text/plain'));
    projectState.moveProject(id, this.type);
    const listEl = this.element.querySelector('ul') as HTMLUListElement;
    listEl.classList.remove('droppable');
  }

  @FunctionBinder
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul') as HTMLUListElement;
    listEl.classList.remove('droppable');
    console.log('leave');
  }

  @FunctionBinder
  dragEnterHandler(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (
      projectState.currentDraggable &&
      this.type !== projectState.currentDraggable.status
    ) {
      event.preventDefault();
    }
  }


}

class ListItem extends Component<HTMLUListElement, HTMLLIElement> implements IDraggable {
  private readonly project: Project;

  private get persons() {
    if (this.project.people === 1) {
      return '1 person';
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }

  @FunctionBinder
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', JSON.stringify({id: this.project.id, status: this.project.status}));
    event.dataTransfer!.effectAllowed = 'move';
    projectState.currentDraggable = this.project;
  }

  @FunctionBinder
  dragEndHandler(_: DragEvent) {
    console.log('Drag has ended!');
    projectState.currentDraggable = null;
  }
}


const projectInput = new ProjectInput();
const activeProjectsList = new ProjectList(ProjectStatus.Active);
const finishedProjectsList = new ProjectList(ProjectStatus.Finished);