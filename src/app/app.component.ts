import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {AuthService} from './auth.service';
import {LoggedInGuard} from './logged-in.guard';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'phoenix';
  leftLinks
  centerLinks
  rightLinks

  constructor(private router: Router, public authService: AuthService) {
    this.leftLinks = [
      { title: 'Home', path: '/home', component: HomeComponent, canActivate: [ LoggedInGuard ] },
      // { title: 'Charts', path: this.authService.prefix + '/charts', component: ChartsComponent },
      //{ title: 'Login', path: 'login', component: LoginComponent }
      /*{ title: "About", path: 'about', component: AboutComponent },
      { title: "Contact Us", path: 'contact', component: ContactComponent },
      { title: "Contact Us", path: 'contactus', redirectTo: 'contact' },

  // authentication demo
      { title: "Log In", path: 'login', component: LoginComponent },
      {
        path: 'protected',
        component: ProtectedComponent,
        canActivate: [ LoggedInGuard ]
      },

  // nested
      {
        title: "Products",
        path: 'products',
        component: ProductsComponent,
        children: childRoutes
      }*/
    ];
    this.centerLinks = [
      //{ title: 'Phoenix', path: this.authService.prefix + '/home', component: HomeComponent }
    ];
    this.rightLinks = [
      { title: 'Logout', path: '/login', component: LoginComponent }
    ];
  };

  logout() {
    this.authService.logout();
    this.router.navigate([this.authService.api_prefix + '/login']);
  }
}
