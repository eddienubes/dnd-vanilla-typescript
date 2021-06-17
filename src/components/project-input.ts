import {Component} from "./base-component";
import {IValidatable} from "../models/validation";
import {validate} from "../util/validation";
import {FunctionBinder} from "../decorators/autobind";
import {projectState} from "../state/project-state";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
