// # Select elements from interface
function Selectus(elements) {
	listElments = new Array();

	elements.forEach(( element ) => {
		let item = document.querySelector(element);

		listElments.push(item);
		console.log(item);
	});
	
	return listElments;
}

export default Selectus;
