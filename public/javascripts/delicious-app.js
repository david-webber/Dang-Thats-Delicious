import '../sass/style.scss';

import {
	$,
	$$
} from './modules/bling';

import autoComplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import loadPlaces from './modules/loadPlaces';


autoComplete($('#address'), $('#lat'), $('#lng'));
typeAhead( $('.search') );
loadPlaces();
autoComplete($('#mapSearch'))