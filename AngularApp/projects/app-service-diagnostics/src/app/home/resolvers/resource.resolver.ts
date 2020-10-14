import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ResourceService } from '../../shared-v2/services/resource.service';
import { ArmResource } from '../../shared-v2/models/arm';
import { DetectorControlService } from 'diagnostic-data';

@Injectable()
export class ResourceResolver implements Resolve<Observable<{} | ArmResource>> {
    constructor(private _resourceService: ResourceService, private _detectorControlService: DetectorControlService) { }
    // Live Chat Service is included here so that we ensure an instance is created

    resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{} | ArmResource> {
        if (!this._detectorControlService.startTime) {

            this._detectorControlService.setDefault();
        }

        //Try get resourceUri from activatedRoute,if not then get from routerstate
        let resourceUri = activatedRouteSnapshot.parent.url
            .filter(x => x.path !== 'new' && x.path !== 'categories')
            .map(x => x.path)
            .join('/');
        if (this.checkResourceUri(resourceUri)) {
            const url = state.url;
            const startIndex = url.indexOf("subscriptions/") > -1 ? url.indexOf("subscriptions/") : 0;
            const endIndex = url.indexOf("/categories") > -1 ? url.indexOf("/categories") : url.length;

            resourceUri = url.substring(startIndex,endIndex);
        }

        if(this.checkResourceUri(resourceUri)){
            const urlFromActivatedRoute = activatedRouteSnapshot.parent.url.join('/');
            throw new Error(`Empty ResourceUri from resource.resolver;Activated Route: ${urlFromActivatedRoute}; State Url: ${state.url}`);
        }

        return this._resourceService.registerResource(resourceUri);
    }

    private checkResourceUri(resourceUri:string):boolean{
        return resourceUri === "" || resourceUri === "/";
    }
}
