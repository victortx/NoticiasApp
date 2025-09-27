import {Component, OnInit} from '@angular/core';
import {MenuService} from '../../services/menu-service';
import {MenuItem} from '../../../Types/AuthTypes';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit  {
  menu$!: Observable<MenuItem[]>;

  constructor(private menuService: MenuService) { }

  ngOnInit(){
    this.menu$ = this.menuService.obtenerMenu();
  }

  normalizeIcon(icon?: string): string {
    // Devuelve algo como "bi-grid-1x2"; si viene sin prefijo, se lo agrega.
    if (!icon) return 'bi-circle';
    const i = icon.trim();
    return i.startsWith('bi-') ? i : `bi-${i}`;
  }

}
