import {Component} from "./base-component";
import {IDraggable} from "../models/dnd";
import {Project} from "../models/project";
import {FunctionBinder} from "../decorators/autobind";
import {projectState} from "../state/project-state";

export class ListItem extends Component<HTMLUListElement, HTMLLIElement> implements IDraggable {
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
