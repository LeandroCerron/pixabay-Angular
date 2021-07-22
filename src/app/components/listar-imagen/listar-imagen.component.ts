import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { ImagenService } from 'src/app/services/imagen.service';

@Component({
  selector: 'app-listar-imagen',
  templateUrl: './listar-imagen.component.html',
  styleUrls: ['./listar-imagen.component.css']
})
export class ListarImagenComponent implements OnInit, OnDestroy {
  termino: string = '';
  suscripcion: Subscription;
  listImagenes: any[] = [];
  loading: boolean = false;
  imagenesPorPagina = 30;
  paginaActual = 1;
  calcularTotalPaginas = 0;

  constructor(private _imagenService: ImagenService) {
    this.suscripcion = this._imagenService.getTerminoBusqueda().subscribe(data => {
      this.loading = true;
      this.termino = data;
      this.paginaActual = 1;
      this.obternerImagenes();
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void{
    this.suscripcion.unsubscribe();
  }

  obternerImagenes(){
    this.listImagenes = [];
    this._imagenService.getImagenes(this.termino, this.imagenesPorPagina, this.paginaActual).subscribe(data => {
      if(data.hits.length === 0){
        this.loading = false;
        this._imagenService.setError('Opss.. No se encontraron coincidencias');
      }else{
        this.calcularTotalPaginas = Math.ceil(data.totalHits / this.imagenesPorPagina);
        this.loading = false;
        this.listImagenes = data.hits;
      }
    }, error => {
      this._imagenService.setError('Opss.. Ocurrio un error!');
      this.loading = false;
    })
  }

  paginaAnterior() {
    this.loading = true;
    this.paginaActual--;
    this.obternerImagenes();
  }

  paginaPosterior() {
    this.loading = true;
    this.paginaActual++;
    this.obternerImagenes();
  }

  paginaAnteriorClass() {
    if(this.paginaActual === 1 ){
      return false;
    }else{
      return true;
    }
  }

  paginaPosteriorClass(){
    if(this.paginaActual === this.calcularTotalPaginas){
      return false;
    }else {
      return true;
    }
  }
}
