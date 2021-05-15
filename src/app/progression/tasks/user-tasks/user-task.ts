enum Status {
    Red = 0,
    Yellow,
    Green,
}

export class UserTask {
    _id?: string;
    _userId: string;
    _taskId: string;
    notes: Status;
}
