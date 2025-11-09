const input = document.getElementById("input")
const boton = document.getElementById("agregar")
const lista = document.getElementById("lista-tareas")
const emptyState = document.getElementById("empty-state")

let tareas = []
const guardadas = localStorage.getItem("tareas")
if (guardadas) {
    tareas = JSON.parse(guardadas)
    tareas.forEach(tarea => {
        crearTarea(tarea.texto, tarea.completada, tarea.id)
    });
}
updateTaskList()

boton.addEventListener("click", () => {
    const texto = input.value.trim()
    if (texto === "")
        return
    
    const id = Date.now().toString()
    tareas.push({ texto, completada: false, id })
    guardarTareas()
    
    crearTarea(texto, false, id)

    input.value = ""
    input.focus()           // <-- usar paréntesis
    updateTaskList()
})

function crearTarea(texto, completed = false, id = null) {
    const li = document.createElement("li")
    const taskId = id || Date.now().toString()
    li.dataset.id = taskId
    li.classList.add('task-item')   // <-- necesaria para touch handlers
    li.draggable = true             // <-- habilita drag en escritorio

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.classList.add("checkbox")
    if (completed) {
        checkbox.checked = true
        li.classList.add("completed")
    }

    checkbox.addEventListener("change", () => {
        li.classList.toggle("completed");
        
        const tarea = tareas.find(t => String(t.id) === String(li.dataset.id))
        if (tarea) {
            tarea.completada = checkbox.checked
            guardarTareas()
        }
    });

    const span = document.createElement("span")
    span.textContent = texto

    const btnEliminar = document.createElement("button")
    btnEliminar.textContent = "🗑️ Eliminar"
    btnEliminar.classList.add("eliminar")
    btnEliminar.addEventListener("click", () => {
        li.style.animation = "fadeLeft 0.2s ease forwards"
        setTimeout(() => {
            li.remove()
            updateTaskList()
        }, 300)
        tareas = tareas.filter(t => String(t.id) !== String(li.dataset.id)) // <-- filtrar por id
        guardarTareas()
    })
    
    // drag handlers para escritorio
    li.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', li.dataset.id)
        li.classList.add('dragging')
    })
    li.addEventListener('dragend', () => {
        li.classList.remove('dragging')
    })

    lista.appendChild(li)
    li.appendChild(checkbox)
    li.appendChild(span)
    li.appendChild(btnEliminar)

    input.value = "";
    input.focus();

    updateTaskList()
}

function updateTaskList() {
    const totalTask = lista.children.length
    
    if (totalTask === 0) {
        emptyState.classList.add("show")
    } else {
        emptyState.classList.remove("show")
    }
}

function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas))
}
updateTaskList()

// Soporte táctil para arrastrar en móviles
let touchDragging = null;

lista.addEventListener('touchstart', (e) => {
    const li = e.target.closest('li.task-item')
    if (!li) return
    touchDragging = li
    touchDragging.classList.add('dragging')
}, { passive: true })

lista.addEventListener('touchmove', (e) => {
    if (!touchDragging) return
    e.preventDefault() // manejamos el movimiento
    const touch = e.touches[0]
    const elem = document.elementFromPoint(touch.clientX, touch.clientY)
    const afterEl = elem ? elem.closest('li.task-item') : null

    if (afterEl && afterEl !== touchDragging) {
        const rect = afterEl.getBoundingClientRect()
        const insertBefore = touch.clientY < rect.top + rect.height / 2
        if (insertBefore) lista.insertBefore(touchDragging, afterEl)
        else lista.insertBefore(touchDragging, afterEl.nextSibling)
    } else if (!afterEl) {
        lista.appendChild(touchDragging)
    }
}, { passive: false })

lista.addEventListener('touchend', () => {
    if (!touchDragging) return
    touchDragging.classList.remove('dragging')

    // reconstruir el orden en tareas y guardar
    const newOrderIds = Array.from(lista.children).map(li => li.dataset.id)
    tareas = newOrderIds.map(id => tareas.find(t => String(t.id) === String(id))).filter(Boolean)
    guardarTareas()
    touchDragging = null
}, { passive: true })

// handlers de drop/ordenado (escritorio)
lista.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(lista, e.clientY)
    const dragging = document.querySelector('.dragging')
    if (!dragging) return
    if (afterElement == null) {
        lista.appendChild(dragging)
    } else {
        lista.insertBefore(dragging, afterElement)
    }
})

lista.addEventListener('drop', e => {
    e.preventDefault()
    const newOrderIds = Array.from(lista.children).map(li => li.dataset.id)
    tareas = newOrderIds.map(id => tareas.find(t => String(t.id) === String(id))).filter(Boolean)
    guardarTareas()
    updateTaskList()
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li.task-item:not(.dragging)')]
    let closest = { offset: Number.NEGATIVE_INFINITY, element: null }

    for (const child of draggableElements) {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            closest = { offset, element: child }
        }
    }
    return closest.element
}