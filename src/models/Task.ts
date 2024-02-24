export interface Task {
    taskId: string,
    creationDate: string,
    expectedDate: string,
    creatorId: string,
    creator: {
        name: string,
        lastName: string,
        maternalLastName: string,
        email: string
    },
    taskType: string,
    taskTypes: {
        description: string
    },
    dueDate: string,
    assigneeId: string,
    assigne: {
        name: string,
        lastName: string,
        maternalLastName: string,
        email: string
    },
    description: string,
    objectStatusId: number,
    createdAt: string,
    updatedAt: string
}


export default Task