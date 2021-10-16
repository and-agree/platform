import { Injectable } from '@angular/core';
import { ref, Storage, uploadBytes, UploadResult } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor(private storage: Storage, private authenticationService: AuthenticationService) {}

    public uploadFile(file: ArrayBuffer): Observable<UploadResult> {
        const bucket = this.authenticationService.user.value.companyId;
        const name = Math.ceil(Math.pow(Math.random() * 1000, 9))
            .toString(36)
            .substring(0, 16)
            .padStart(16, '0');

        const path = ref(this.storage, `${bucket}/${name}`);
        return from(uploadBytes(path, file));
    }
}
