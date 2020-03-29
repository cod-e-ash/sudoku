import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayComponent } from './play/play.component';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [AppComponent, PlayComponent, HomeComponent],
	imports: [BrowserModule, AppRoutingModule, CommonModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
