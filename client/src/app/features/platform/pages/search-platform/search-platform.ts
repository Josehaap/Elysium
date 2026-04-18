import { Component, inject } from '@angular/core';
import { SearchApi } from './services/search-api';
import { btnFollow } from 'src/app/features/shared/btnFollow/btnFollow';
@Component({
  selector: 'app-search-platform',
  imports: [btnFollow],
  templateUrl: './search-platform.html',
  styleUrl: './search-platform.css',
})
export class SearchPlatform {
  protected searchApi = inject(SearchApi);
}
