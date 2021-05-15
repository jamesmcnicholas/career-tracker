import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// This service handles the selected level and stream data, passing it to the tasks component

@Injectable()
export class ProgressionService {
    
    selectedLevel$: Observable<any>;
    selectedStream$: Observable<any>;
    
    private selectedLevelSubject = new Subject<any>();
    private selectedStreamSubject = new Subject<any>();

    constructor() {
        this.selectedLevel$ = this.selectedLevelSubject.asObservable();
        this.selectedStream$ = this.selectedStreamSubject.asObservable();
    }

    selectedLevel(level) {
        this.selectedLevelSubject.next(level);
    }
    
    selectedStream(stream) {
        this.selectedStreamSubject.next(stream);
    }

    updateTasks() {
        
    }

}