import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(stores){
	return stores.map(store => {
		return `
			<a href="/store/${store.slug}" class="search__result">
				<strong>${store.name}</strong>
			</a>
		`
	}).join('');
}


function typeAhead(search){
	if(!search) return;

	const searchInput = search.querySelector('input[name="search"]');
	const searchResults = search.querySelector('.search__results');

	searchInput.on('input', function(){
		if(!this.value){
			searchResults.style.display ='none';
			return;
		}
		// searchResults.innerHTML=`No results for ${this.value}`;
		searchResults.style.display = "block";
		axios
		.get(`/api/search?q=${this.value}`)
		.then(res => {
			if(res.data.length){
				searchResults.innerHTML= dompurify.sanitize(searchResultsHTML(res.data));
				return;
			}
			searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${this.value} found!</div>`);
		}).catch(err => {
			console.error(err);
		})
	})

	//handle keyboard inputs
	searchInput.on('keyup', (e) => {
		//if they aren't pressing up down or enter who cares?
		if(![38,40,13].includes(e.keyCode)){
			return;
		}
		const activeClass = 'search__result--active';
		const current = search.querySelector(`.${activeClass}`);
		const items = search.querySelectorAll('.search__result');
		let next;
		if(e.keyCode === 40 && current){
			//if pushing down and current
			next = current.nextElementSibling || items[0];
		}
		else if(e.keyCode === 40){
			//no current, select the first
			next = items[0];
		}else if(e.keyCode === 38 && current){
			//if pushing up and there is a current
			next = current.previousElementSibling || items[items.length - 1];
		}else if(e.keyCode === 38){
			next = items[items.length - 1];
		}else if(e.keyCode === 13 && current.href){
			//hitting enter and clicking on element with link
			window.location = current.href;
			return;
		}
		if(current){
			current.classList.remove(activeClass);
		}
		next.classList.add(activeClass);
		// console.log(next);

	})

}

export default typeAhead;
