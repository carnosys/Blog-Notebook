const form = document.querySelector('#post-form');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const status = document.querySelector('#status');
const posts = document.querySelector('#posts');
let blogs = [];
let editingId = null;
let busy = false;

function announce(message, error = false) {
  status.textContent = message;
  status.classList.toggle('error', error);
}

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.message || `Request failed (${response.status}). Try refreshing the posts.`);
  }
  return response.status === 204 ? null : response.json();
}

function resetEditor() {
  editingId = null;
  form.reset();
  document.querySelector('#editor-heading').textContent = 'New post';
  document.querySelector('#save').textContent = 'Add post';
  document.querySelector('#cancel').hidden = true;
}

function render() {
  posts.replaceChildren();
  const query = document.querySelector('#search').value.trim().toLowerCase();
  const matches = blogs.map((blog, id) => ({ ...blog, id }))
    .filter(blog => `${blog.title} ${blog.body}`.toLowerCase().includes(query));
  document.querySelector('#count').textContent = query ? `${matches.length} / ${blogs.length}` : blogs.length;
  for (const blog of matches) {
    const card = document.querySelector('#post-template').content.cloneNode(true);
    card.querySelector('.post-number').textContent = `POST ${String(blog.id + 1).padStart(2, '0')}`;
    card.querySelector('h3').textContent = blog.title;
    card.querySelector('.post-body').textContent = blog.body;
    card.querySelector('.edit').onclick = () => {
      if (busy) return;
      editingId = blog.id;
      titleInput.value = blog.title;
      bodyInput.value = blog.body;
      document.querySelector('#editor-heading').textContent = 'Edit post';
      document.querySelector('#save').textContent = 'Save changes';
      document.querySelector('#cancel').hidden = false;
      titleInput.focus();
    };
    card.querySelector('.delete').onclick = () => {
      if (busy || !confirm(`Delete “${blog.title}”?`)) return;
      perform(async () => {
        await request(`/blogs/${blog.id}`, { method: 'DELETE' });
        resetEditor(); // Deleting shifts the API's list-based IDs.
        await load();
        announce('Post deleted.');
      });
    };
    posts.append(card);
  }
  if (!matches.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = query ? 'No matching posts. Try another search.' : 'Your notebook is empty. Write your first post!';
    posts.append(empty);
  }
}

async function load() {
  posts.setAttribute('aria-busy', 'true');
  try { blogs = await request('/blogs'); render(); }
  finally { posts.setAttribute('aria-busy', 'false'); }
}

async function perform(action) {
  if (busy) return;
  busy = true;
  document.querySelectorAll('button').forEach(button => button.disabled = true);
  try { await action(); }
  catch (error) { announce(error.message, true); }
  finally {
    busy = false;
    document.querySelectorAll('button').forEach(button => button.disabled = false);
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  if (!title || !body) { announce('Please enter a title and some thoughts.', true); return; }
  perform(async () => {
    const isEditing = editingId !== null;
    await request(isEditing ? `/blogs/${editingId}` : '/blogs', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body })
    });
    resetEditor();
    await load();
    announce(isEditing ? 'Changes saved.' : 'Post added.');
  });
});
document.querySelector('#cancel').onclick = resetEditor;
document.querySelector('#search').oninput = render;
document.querySelector('#refresh').onclick = () => perform(async () => {
  await load(); resetEditor(); announce('Posts refreshed.');
});
perform(async () => {
  try { await load(); }
  catch (error) { posts.textContent = 'Could not load posts. Use Refresh to try again.'; throw error; }
});
