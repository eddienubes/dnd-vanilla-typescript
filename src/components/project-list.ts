import {Component} from "./base-component";
import {IDragTarget} from "../models/dnd";
import {Project} from "../models/project";
import {ProjectStatus} from "../models/project";
import {ListItem} from "./list-item";
import {FunctionBinder} from "../decorators/autobind";
import {projectState} from "../state/project-state";

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements IDragTarget {
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

