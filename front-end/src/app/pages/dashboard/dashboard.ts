import { Component } from '@angular/core';
import { StarField } from "../../components/star-field/star-field";
import { Header } from "../../components/layouts/header/header";
import { Main } from "../../components/layouts/main/main";

@Component({
  selector: 'app-dashboard',
  imports: [StarField, Header, Main],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
