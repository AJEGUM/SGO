import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clonamos la petición para agregar 'withCredentials'
  // Esto permite que las Cookies de Passport viajen al servidor
  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq);
};