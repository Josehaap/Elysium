import { Component } from '@angular/core';
import { Form } from '../../components/form/form';
import { Footer } from '../../../shared/footer/footer';
import { dataLanding } from '../../data/dataLandingPage';


@Component({
  selector: 'app-login',
  imports: [Form, Footer],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
    protected dataFooter = dataLanding.footer;
}
