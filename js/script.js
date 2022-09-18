// # Data Initials
const url = 'https://jsonplaceholder.typicode.com/posts';

// # Select elements from interface
import Selectus from 'qselectus/script.js';

const [
	/* loading */
	loadingElement, 
	/* containers */
	postPage, 
	postsContainer,
	postContainer, 
	commentsContainer,
	/* comment form elements */
	commentForm, 
	emailInput, 
	bodyInput
] = Selectus([
	'#loading', 
	'#post',
	'#posts-container',
	'#post-container',
	'#comments-container',
	'#comment-form',
	'#email',
	'#body'
]);


// # Get id from URL
const urlSearchParams = new URLSearchParams(
	window.location.search
);
let postId = urlSearchParams.get('id');


// # Create elements
function createElemnts(obj) {
	let arr = new Array();

	obj.elmnts.forEach(( item ) => {
		elmnt = document.createElement(item);
		arr.push(elmnt);	
	});

	return arr;
}


// # Create elements
function addChild(root, child) {
	child.forEach(( elmnt ) => {
		root.appendChild(elmnt);
	});
}


// # Get All Posts
const getAllPost = async () => {

	const response = await fetch(url);
	console.log(response);

	const data = await response.json();
	console.log(data);

	loadingElement.classList.add('hide');

	data.map(( post ) => {
		
		const [ 
			div, title, body, link 
		] = createElemnts(
			{ elmnts: [ 'div', 'h2', 'p', 'a' ] }
		);

		title.innerText = post.title;
		body.innerText = post.body;
		link.innerText = "Ler mais";
		link.setAttribute(
			"href", `post.html?id=${post.id}`
		);

		addChild(
			div, 
			[ title, body, link ]
		);
		addChild(
			postsContainer, [ div ]
		);		

	});

}


// # Get Individual Post
async function getPost(id) {

	const [responsePost, responseComments] = await Promise.all([
		fetch(`${url}/${id}`),
		fetch(`${url}/${id}/comments`),
	  ]);


	const dataPost = await responsePost.json();
	const dataComments = await responseComments.json();

	loadingElement.classList.add('hide');
	postPage.classList.remove('hide');

	const [title, body] = createElemnts({ elmnts: ['h1', 'p'] });

	title.innerText = dataPost.title;
	body.innerText = dataPost.body;

	addChild(postContainer, [ title, body ]);

	console.log(dataComments);
	dataComments.map(( comment ) => {
		createComment(comment);
	});

}


// # Create Commment
function createComment(comment) {

	const [
		div, email, commentBody
	] = createElemnts(
		{ elmnts: ['div', 'h3', 'p'] }
	);

	email.innerText = comment.email;
	commentBody.innerText = comment.body;
	
	addChild(
		div, 
		[email, commentBody]
	);

	addChild(commentsContainer, [div]);
}


// # Insert a comment
async function postComment(comment) {
	const response = await fetch(
		url,
		{
			method: "POST",
			body: comment,
			headers: {
				'Content-type': 'application/json'
			}
		}
	);
	
	const data = await response.json();
	console.log(data);
	
	createComment(data);
}


if (!postId) {
	
	getAllPost();
	
} else {
	
	getPost(postId);
	
	// # Add event to comment form
	commentForm.addEventListener("submit", ( e ) => {
		e.preventDefault();
		
		let comment = {
			email: emailInput.value,
			body: bodyInput.value
		};
		
		comment = JSON.stringify(comment);
		
		postComment(comment);
		
		emailInput.value = "";
		bodyInput.value = "";
	});
	
}