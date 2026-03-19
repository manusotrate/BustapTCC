import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-metodo-pagamento',
  templateUrl: './metodo-pagamento.page.html',
  styleUrls: ['./metodo-pagamento.page.scss'],
  standalone: false
})
export class MetodoPagamentoPage implements OnInit {
  valor: number = 0;

  get valorFormatado(): string {
    return `R$${this.valor.toFixed(2).replace('.', ',')}`;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const v = this.route.snapshot.queryParamMap.get('valor');
    if (v) this.valor = parseFloat(v);
  }

  escolherPix() {
    this.router.navigate(['/recarga/pix'], { queryParams: { valor: this.valor } });
  }

  escolherDebito() {
    this.router.navigate(['/recarga/debito'], { queryParams: { valor: this.valor } });
  }

  goBack() {
    this.router.navigate(['/recarga']);
  }
}