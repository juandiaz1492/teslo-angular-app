import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbar } from "../../components/front-navbar/front-navbar";
import { FrontFooter } from "../../components/front-footer/front-footer";


@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavbar, FrontFooter],
  templateUrl: './store-front-layout.html',
})
export class StoreFrontLayout { }
