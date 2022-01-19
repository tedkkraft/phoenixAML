# Phoenix

## Build prod and push to DockerHub
To deploy production version of Angular app running on a 
Docker container, run the following
(See also https://medium.com/bb-tutorials-and-thoughts/how-to-serve-angular-application-with-nginx-and-docker-3af45be5b854)
```
ng build --deploy-url=/phoenix/ --prod
docker build -t mickelonius/phoenix:v0.1 .
docker push mickelonius/phoenix:v0.1

# If ECS service is already running, 
# force new deployment to affect changes
aws ecs update-service --force-new-deployment --service phoenix --cluster traefik-demo
```

> To test Angular application and docker image locally
>  ```
>  ng serve --proxy-config proxy.conf.json
>  To run locally, without db:
>  ng build --deploy-url=/phoenix/
>  docker build -t mickelonius/phoenix:v0.1 .
>  docker run -p 80:80 mickelonius/phoenix:v0.1
>  ```
> 
## Angular Material UI
https://medium.com/@tomastrajan/the-complete-guide-to-angular-material-themes-4d165a9d24d1
https://material.angular.io/guide/getting-started

```
ng add @angular/material
```

## d3
```
npm install d3 --save
npm install @types/d3 --save-dev
```


---
### This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.6.

#### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

#### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

#### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

#### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
