import { importProvidersFrom } from "@angular/core";

import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { provideRouter } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { routes } from "./app/app.routes";

export function getBaseUrl() {
	return document.getElementsByTagName("base")[0].href;
}

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(HttpClientModule),
		provideRouter(routes),
		provideAnimations(),
	],
}).catch((err) => console.log(err));
