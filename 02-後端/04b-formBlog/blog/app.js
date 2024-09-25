import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';

const posts = [
  { id: 0, title: 'aaa', body: 'aaaaa', created_at: new Date().toLocaleString() },
  { id: 1, title: 'bbb', body: 'bbbbb', created_at: new Date().toLocaleString() }
];

const router = new Router();

router.get('/', list)        
  .get('/post/new', add)     
  .get('/post/:id', show)    
  .post('/post', create);    

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function list(ctx) {
  ctx.response.body = await render.list(posts);
}

async function add(ctx) {
  ctx.response.body = await render.newPost();
}

async function show(ctx) {
  const id = parseInt(ctx.params.id, 10); 
  const post = posts.find(p => p.id === id);
  
  if (!post) {
    ctx.throw(404, '無效的文章'); 
  }
  
  ctx.response.body = await render.show(post);
}

async function create(ctx) {
  const body = ctx.request.body; 
  
  if (body.type === "form") {
    const pairs = await body.value; 
    const post = {};

    for (const [key, value] of pairs) {
      post[key] = value.trim(); 
    }

    if (!post.title || !post.body) {
      ctx.response.status = 400;
      ctx.response.body = "Error"; 
      return;
    }

    post.id = posts.length; 
    post.created_at = new Date().toLocaleString(); 

    posts.push(post); 
    ctx.response.redirect('/'); 
  } else {
    ctx.response.status = 415; 
    ctx.response.body = "Error"; 
  }
}

console.log('Server running at http://127.0.0.1:8080');
await app.listen({ port: 8080 });
