"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var State = (function () {
    function State() {
        this.listeners = [];
    }
    State.prototype.addListener = function (listener) {
        this.listeners.push(listener);
    };
    return State;
}());
var Component = (function () {
    function Component(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        var importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    Component.prototype.attach = function (insertAtStart) {
        this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element);
    };
    return Component;
}());
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
var Project = (function () {
    function Project(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
    return Project;
}());
var ProjectState = (function (_super) {
    __extends(ProjectState, _super);
    function ProjectState() {
        var _this = _super.call(this) || this;
        _this.projects = [];
        _this.draggable = null;
        return _this;
    }
    Object.defineProperty(ProjectState.prototype, "currentDraggable", {
        get: function () {
            return Object.create(this.draggable);
        },
        set: function (value) {
            this.draggable = Object.create(value);
        },
        enumerable: false,
        configurable: true
    });
    ProjectState.prototype.addProject = function (title, description, people) {
        var newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
        this.projects.push(newProject);
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(this.projects.slice());
        }
    };
    ProjectState.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        return new ProjectState();
    };
    ProjectState.prototype.moveProject = function (projectId, newStatus) {
        var prj = this.projects.find(function (p) { return p.id === projectId; });
        if (prj && prj.status !== newStatus) {
            prj.status = newStatus;
            this.updateListeners();
        }
    };
    ProjectState.prototype.updateListeners = function () {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(this.projects.slice());
        }
    };
    return ProjectState;
}(State));
var projectState = ProjectState.getInstance();
function validate(validatable) {
    var isValid = true;
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
function FunctionBinder(_, _2, descriptor) {
    var originalFn = descriptor.value;
    return {
        enumerable: true,
        configurable: true,
        get: function () {
            return originalFn.bind(this);
        }
    };
}
var ProjectInput = (function (_super) {
    __extends(ProjectInput, _super);
    function ProjectInput() {
        var _this = _super.call(this, 'project-input', 'app', true, 'user-input') || this;
        console.log('Rendered projects input!');
        _this.titleInputElement = _this.element.querySelector('#title');
        _this.descriptionInputElement = _this.element.querySelector('#description');
        _this.peopleInputElement = _this.element.querySelector('#people');
        _this.configure();
        return _this;
    }
    ProjectInput.prototype.gatherUserInput = function () {
        var title = this.titleInputElement.value;
        var description = this.descriptionInputElement.value;
        var people = this.peopleInputElement.value;
        var titleValidatable = {
            value: title,
            required: true
        };
        var descriptionValidatable = {
            value: description,
            required: true
        };
        var peopleValidatable = {
            value: +people,
            required: true,
            min: 2,
            max: 6
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            alert('Invalid input, please try again');
            return;
        }
        else {
            return [title, description, +people];
        }
    };
    ProjectInput.prototype.configure = function () {
        this.element.addEventListener('submit', this.submitHandler);
    };
    ProjectInput.prototype.renderContent = function () {
    };
    ProjectInput.prototype.submitHandler = function (event) {
        event.preventDefault();
        var userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            var title = userInput[0], description = userInput[1], people = userInput[2];
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
    };
    ProjectInput.prototype.clearInputs = function () {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    };
    __decorate([
        FunctionBinder
    ], ProjectInput.prototype, "submitHandler", null);
    return ProjectInput;
}(Component));
var ProjectList = (function (_super) {
    __extends(ProjectList, _super);
    function ProjectList(type) {
        var _this = _super.call(this, 'project-list', 'app', false, (type === ProjectStatus.Active ? 'active' : 'finished') + "-projects") || this;
        _this.type = type;
        _this.assignedProjects = [];
        console.log('Rendered projects list! ', type);
        _this.configure();
        _this.renderContent();
        return _this;
    }
    ProjectList.prototype.renderContent = function () {
        this.element.querySelector('ul').id = (this.type === ProjectStatus.Active ? 'active' : 'finished') + "-projects-list";
        this.element.querySelector('h2').textContent = ProjectStatus[this.type] + ' PROJECTS';
    };
    ProjectList.prototype.configure = function () {
        var _this = this;
        projectState.addListener(function (projects) {
            _this.assignedProjects = projects.filter(function (p) {
                return p.status === _this.type;
            });
            _this.renderProjects();
        });
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        this.element.addEventListener('dragenter', this.dragEnterHandler);
    };
    ProjectList.prototype.renderProjects = function () {
        var listEl = document.getElementById((this.type === ProjectStatus.Active ? 'active' : 'finished') + "-projects-list");
        listEl.innerHTML = '';
        for (var _i = 0, _a = this.assignedProjects; _i < _a.length; _i++) {
            var prjItem = _a[_i];
            new ListItem(this.element.querySelector('ul').id, prjItem);
        }
    };
    ProjectList.prototype.dragOverHandler = function (event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            var listEl = this.element.querySelector('ul');
            listEl.classList.add('droppable');
            event.preventDefault();
        }
    };
    ProjectList.prototype.dropHandler = function (event) {
        var id = JSON.parse(event.dataTransfer.getData('text/plain')).id;
        projectState.moveProject(id, this.type);
        var listEl = this.element.querySelector('ul');
        listEl.classList.remove('droppable');
    };
    ProjectList.prototype.dragLeaveHandler = function (_) {
        var listEl = this.element.querySelector('ul');
        listEl.classList.remove('droppable');
        console.log('leave');
    };
    ProjectList.prototype.dragEnterHandler = function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (projectState.currentDraggable &&
            this.type !== projectState.currentDraggable.status) {
            event.preventDefault();
        }
    };
    __decorate([
        FunctionBinder
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        FunctionBinder
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        FunctionBinder
    ], ProjectList.prototype, "dragLeaveHandler", null);
    __decorate([
        FunctionBinder
    ], ProjectList.prototype, "dragEnterHandler", null);
    return ProjectList;
}(Component));
var ListItem = (function (_super) {
    __extends(ListItem, _super);
    function ListItem(hostId, project) {
        var _this = _super.call(this, 'single-project', hostId, false, project.id) || this;
        _this.project = project;
        _this.configure();
        _this.renderContent();
        return _this;
    }
    Object.defineProperty(ListItem.prototype, "persons", {
        get: function () {
            if (this.project.people === 1) {
                return '1 person';
            }
            else {
                return this.project.people + " persons";
            }
        },
        enumerable: false,
        configurable: true
    });
    ListItem.prototype.configure = function () {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    };
    ListItem.prototype.renderContent = function () {
        this.element.querySelector('h2').textContent = this.project.title;
        this.element.querySelector('h3').textContent = this.persons + ' assigned';
        this.element.querySelector('p').textContent = this.project.description;
    };
    ListItem.prototype.dragStartHandler = function (event) {
        event.dataTransfer.setData('text/plain', JSON.stringify({ id: this.project.id, status: this.project.status }));
        event.dataTransfer.effectAllowed = 'move';
        projectState.currentDraggable = this.project;
    };
    ListItem.prototype.dragEndHandler = function (_) {
        console.log('Drag has ended!');
        projectState.currentDraggable = null;
    };
    __decorate([
        FunctionBinder
    ], ListItem.prototype, "dragStartHandler", null);
    __decorate([
        FunctionBinder
    ], ListItem.prototype, "dragEndHandler", null);
    return ListItem;
}(Component));
var projectInput = new ProjectInput();
var activeProjectsList = new ProjectList(ProjectStatus.Active);
var finishedProjectsList = new ProjectList(ProjectStatus.Finished);
//# sourceMappingURL=app.js.map