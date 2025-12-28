import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    url = environment.apiUrl;

    constructor(private httpClient: HttpClient) { }

    add(data: any) {
        return this.httpClient.post(`${this.url}/product/add`, data, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    getProducts() {
        return this.httpClient.get(`${this.url}/product/get`);
    }

    update(data: any) {
        return this.httpClient.post(`${this.url}/product/update`, data, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    delete(id: number) {
        return this.httpClient.post(`${this.url}/product/delete/${id}`, {});
    }

    updateStatus(data: any) {
        return this.httpClient.post(`${this.url}/product/updateStatus`, data, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    getProductsByCategory(id: number) {
        return this.httpClient.get(`${this.url}/product/getByCategory/${id}`);
    }

    getProductById(id: number) {
        return this.httpClient.get(`${this.url}/product/getById/${id}`);
    }
}
