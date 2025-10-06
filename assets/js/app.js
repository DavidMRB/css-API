const API_BASE_URL = 'https://todoapitest.juansegaliz.com';
let todos = [];

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorDiv.classList.add('show');
    setTimeout(() => errorDiv.classList.remove('show'), 5000);
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    successText.textContent = message;
    successDiv.classList.add('show');
    setTimeout(() => successDiv.classList.remove('show'), 3000);
}

function getPriorityColor(priority) {
    switch (priority) {
        case 3: return 'priority-high';
        case 2: return 'priority-medium';
        default: return 'priority-low';
    }
}

function getPriorityLabel(priority) {
    switch (priority) {
        case 3: return 'Alta';
        case 2: return 'Media';
        default: return 'Baja';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function toLocalDateTime(dateString) {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
}

async function loadTodos() {
    try {
        const response = await fetch(`${API_BASE_URL}/todos`);
        if (!response.ok) throw new Error('Error al cargar los todos');
        
        const data = await response.json();
        todos = data.data;
        renderTodos();
    } catch (error) {
        console.error('Error:', error);
        showError('Error al cargar los todos');
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}

async function getTodoById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`No se encontró ningún todo con el ID ${id}`);
            }
            throw new Error(`Error al buscar el todo ${id}`);
        }
        
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function createTodo(todoData) {
    try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todoData),
        });
        
        if (!response.ok) throw new Error('Error al crear el todo');
        
        const data = await response.json();
        showSuccess(`✅ Todo creado exitosamente con ID: ${data.data.id}`);
        await loadTodos();
        document.getElementById('createForm').reset();
    } catch (error) {
        console.error('Error:', error);
        showError('Error al crear el todo');
    }
}

async function updateTodo(id, todoData) {
    try {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todoData),
        });
        
        if (!response.ok) throw new Error('Error al actualizar el todo');
        
        showSuccess('✅ Todo actualizado exitosamente');
        await loadTodos();
        closeEditModal();
    } catch (error) {
        console.error('Error:', error);
        showError('Error al actualizar el todo');
    }
}

async function deleteTodo(id) {
    if (!confirm('¿Estás seguro de eliminar este todo?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Error al eliminar el todo');
        
        showSuccess('✅ Todo eliminado exitosamente');
        await loadTodos();
    } catch (error) {
        console.error('Error:', error);
        showError('Error al eliminar el todo');
    }
}

async function toggleComplete(todo) {
    const updateData = {
        title: todo.title,
        description: todo.description,
        isCompleted: !todo.isCompleted,
        priority: todo.priority,
        dueAt: todo.dueAt,
    };
    await updateTodo(todo.id, updateData);
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    const todoCount = document.getElementById('todoCount');
    const todoListContainer = document.getElementById('todoListContainer');
    const emptyState = document.getElementById('emptyState');

    todoCount.textContent = todos.length;

    if (todos.length === 0) {
        todoListContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    todoListContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');

    todoList.innerHTML = todos.map(todo => `
        <div class="todo-item">
            <input
                type="checkbox"
                ${todo.isCompleted ? 'checked' : ''}
                onchange='toggleComplete(${JSON.stringify(todo).replace(/'/g, "&#39;")})'
                class="todo-checkbox"
            >

            <div class="todo-content">
                <div class="todo-header">
                    <div class="todo-info">
                        <span class="todo-id">ID: ${todo.id}</span>
                        <h3 class="todo-title ${todo.isCompleted ? 'completed' : ''}">
                            ${todo.title}
                        </h3>
                    </div>
                    <span class="priority-badge ${getPriorityColor(todo.priority)}">
                        ${getPriorityLabel(todo.priority)}
                    </span>
                </div>

                ${todo.description ? `
                    <p class="todo-description ${todo.isCompleted ? 'completed' : ''}">
                        ${todo.description}
                    </p>
                ` : ''}

                <div class="todo-meta">
                    <span>📅 Vence: ${formatDate(todo.dueAt)}</span>
                    <span>🕐 Creado: ${formatDate(todo.createdAt)}</span>
                </div>
            </div>

            <div class="todo-actions">
                <button onclick="viewTodoDetail(${todo.id})" class="btn btn-view">
                    Ver
                </button>
                <button onclick="openEditModal(${todo.id})" class="btn btn-edit">
                    Editar
                </button>
                <button onclick="deleteTodo(${todo.id})" class="btn btn-delete">
                    Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

async function handleSearch(e) {
    e.preventDefault();
    const searchId = parseInt(document.getElementById('searchId').value);
    const searchResult = document.getElementById('searchResult');

    try {
        const todo = await getTodoById(searchId);
        
        searchResult.innerHTML = `
            <div class="todo-detail-card">
                <h3>✅ Todo encontrado</h3>
                <div class="detail-row">
                    <span class="detail-label">ID:</span>
                    <span class="detail-value">${todo.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Título:</span>
                    <span class="detail-value">${todo.title}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Descripción:</span>
                    <span class="detail-value">${todo.description || 'Sin descripción'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Estado:</span>
                    <span class="detail-value">${todo.isCompleted ? '✅ Completado' : '⏳ Pendiente'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Prioridad:</span>
                    <span class="detail-value">
                        <span class="priority-badge ${getPriorityColor(todo.priority)}">
                            ${getPriorityLabel(todo.priority)}
                        </span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Fecha de vencimiento:</span>
                    <span class="detail-value">${formatDate(todo.dueAt)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Creado:</span>
                    <span class="detail-value">${formatDate(todo.createdAt)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Actualizado:</span>
                    <span class="detail-value">${formatDate(todo.updatedAt)}</span>
                </div>
            </div>
        `;
        searchResult.classList.remove('hidden');
        showSuccess(`Todo con ID ${searchId} encontrado exitosamente`);
    } catch (error) {
        searchResult.innerHTML = `
            <div class="todo-detail-card" style="background-color: #fef2f2; border-color: #dc2626;">
                <h3 style="color: #dc2626;">❌ No encontrado</h3>
                <p style="color: #991b1b;">${error.message}</p>
            </div>
        `;
        searchResult.classList.remove('hidden');
        showError(error.message);
    }
}

async function viewTodoDetail(id) {
    try {
        const todo = await getTodoById(id);
        const modalContent = document.getElementById('viewModalContent');
        
        modalContent.innerHTML = `
            <div class="detail-row">
                <span class="detail-label">ID:</span>
                <span class="detail-value">${todo.id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Título:</span>
                <span class="detail-value">${todo.title}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Descripción:</span>
                <span class="detail-value">${todo.description || 'Sin descripción'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Estado:</span>
                <span class="detail-value">${todo.isCompleted ? '✅ Completado' : '⏳ Pendiente'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Prioridad:</span>
                <span class="detail-value">
                    <span class="priority-badge ${getPriorityColor(todo.priority)}">
                        ${getPriorityLabel(todo.priority)}
                    </span>
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Fecha de vencimiento:</span>
                <span class="detail-value">${formatDate(todo.dueAt)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Creado:</span>
                <span class="detail-value">${formatDate(todo.createdAt)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Actualizado:</span>
                <span class="detail-value">${formatDate(todo.updatedAt)}</span>
            </div>
            <div style="margin-top: 1rem;">
                <button onclick="closeViewModal()" class="btn btn-secondary" style="width: 100%;">Cerrar</button>
            </div>
        `;
        
        document.getElementById('viewModal').classList.add('show');
    } catch (error) {
        showError(`Error al cargar el detalle del todo: ${error.message}`);
    }
}

function openEditModal(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    document.getElementById('editId').value = todo.id;
    document.getElementById('editTitle').value = todo.title;
    document.getElementById('editDescription').value = todo.description;
    document.getElementById('editCompleted').checked = todo.isCompleted;
    document.getElementById('editPriority').value = todo.priority;
    document.getElementById('editDueAt').value = toLocalDateTime(todo.dueAt);

    document.getElementById('editModal').classList.add('show');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
    document.getElementById('editForm').reset();
}

function closeViewModal() {
    document.getElementById('viewModal').classList.remove('show');
}

document.getElementById('searchForm').addEventListener('submit', handleSearch);

document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const todoData = {
        title: formData.get('title').trim(),
        description: formData.get('description').trim(),
        priority: parseInt(formData.get('priority')),
        dueAt: formData.get('dueAt') || new Date().toISOString(),
    };

    await createTodo(todoData);
});

document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const todoData = {
        title: document.getElementById('editTitle').value.trim(),
        description: document.getElementById('editDescription').value.trim(),
        isCompleted: document.getElementById('editCompleted').checked,
        priority: parseInt(document.getElementById('editPriority').value),
        dueAt: new Date(document.getElementById('editDueAt').value).toISOString(),
    };

    await updateTodo(id, todoData);
});

document.getElementById('editModal').addEventListener('click', (e) => {
    if (e.target.id === 'editModal') {
        closeEditModal();
    }
});

document.getElementById('viewModal').addEventListener('click', (e) => {
    if (e.target.id === 'viewModal') {
        closeViewModal();
    }
});

loadTodos();