import { PlayComponent } from '@src/app/play/play.component';
import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';


export const routes: Routes = [
	{
		path: '',
		redirectTo: '/play',
		pathMatch: 'full',
	},
	{
		path: 'play',
		component: PlayComponent,
	},
];

@NgModule({
	imports: [NativeScriptRouterModule.forRoot(routes)],
	exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
