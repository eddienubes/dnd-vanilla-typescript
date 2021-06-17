import {ProjectInput} from "./components/project-input";
import {ProjectList} from "./components/project-list";
import {ProjectStatus} from "./models/project";


const projectInput = new ProjectInput();
const activeProjectsList = new ProjectList(ProjectStatus.Active);
const finishedProjectsList = new ProjectList(ProjectStatus.Finished);

