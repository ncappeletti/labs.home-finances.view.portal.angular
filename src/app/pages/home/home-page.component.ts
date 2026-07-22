import { Component, signal, inject } from "@angular/core";
import { GatewayService } from "../../services/gateway-service";
import { CommonModule } from "@angular/common";

interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

@Component({
    templateUrl: './home-page.component.html',

    //styleUrl: './home-page.css'
})
export class HomePageComponent {
    private apiService = inject(GatewayService);

    protected readonly title = signal('home-finances');

    items = signal<WeatherForecast[]>([]);

    ngOnInit(): void {
        this.apiService.getWeatherforecast().subscribe({
            next: (data) => {
                console.log('Datos:', data);
                this.items.set(data);
            },
            error: (err) => console.error('Error:', err)
        });
    }
}