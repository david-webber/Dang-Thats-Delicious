import '../sass/style.scss';

import {
	$,
	$$
} from './modules/bling';

import autoComplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import loadPlaces from './modules/loadPlaces';
import ajaxHeart from './modules/heart.js';


autoComplete($('#address'), $('#lat'), $('#lng'));
typeAhead( $('.search') );

if($('#map')){
loadPlaces();
}

autoComplete($('#mapSearch'));

//$$ = queryselectoorall
const heartForms = $$('form.heart');
//add eventlistener to all hearts
heartForms.on('submit', ajaxHeart)