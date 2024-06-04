document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos de administración
    loadAdminData();

    // Función para obtener los datos de administración desde localStorage
    function getAdminDataFromLocalStorage() {
        const data = localStorage.getItem('adminData');
        return data ? JSON.parse(data) : {
            users: [],
            collaborations: []
        };
    }

    // Función para guardar los datos de administración en localStorage
    function saveAdminDataToLocalStorage(data) {
        localStorage.setItem('adminData', JSON.stringify(data));
    }

    // Función para cargar los datos de administración en la página
    function loadAdminData() {
        const data = getAdminDataFromLocalStorage();

        // Cargar usuarios
        data.users.forEach(user => {
            addUserToTable(user);
        });

        // Cargar colaboraciones
        data.collaborations.forEach(collaboration => {
            addCollaborationToTable(collaboration);
        });

        // Actualizar métricas
        updateMetrics(data);
    }

    // Función para agregar un usuario
    function agregarUsuario() {
        const username = prompt('Ingrese el nombre de usuario:');
        const email = prompt('Ingrese el correo electrónico:');
        const role = prompt('Ingrese el rol del usuario (Admin/Usuario):');

        const newUser = {
            username,
            email,
            role
        };

        const data = getAdminDataFromLocalStorage();
        data.users.push(newUser);
        saveAdminDataToLocalStorage(data);

        addUserToTable(newUser);
        updateMetrics(data);
    }

    // Función para agregar una colaboración
    function agregarColaboracion() {
        const projectName = prompt('Ingrese el nombre del proyecto:');
        const collaborators = prompt('Ingrese los colaboradores separados por comas:').split(',');

        const newCollaboration = {
            projectName,
            collaborators
        };

        const data = getAdminDataFromLocalStorage();
        data.collaborations.push(newCollaboration);
        saveAdminDataToLocalStorage(data);

        addCollaborationToTable(newCollaboration);
        updateMetrics(data);
    }

    // Función para editar un usuario
    function editarUsuario(username) {
        const data = getAdminDataFromLocalStorage();
        const index = data.users.findIndex(user => user.username === username);
        if (index !== -1) {
            const newUsername = prompt('Ingrese el nuevo nombre de usuario:', data.users[index].username);
            const newEmail = prompt('Ingrese el nuevo correo electrónico:', data.users[index].email);
            const newRole = prompt('Ingrese el nuevo rol del usuario (Admin/Usuario):', data.users[index].role);

            data.users[index].username = newUsername;
            data.users[index].email = newEmail;
            data.users[index].role = newRole;

            saveAdminDataToLocalStorage(data);

            // Actualizar fila en la tabla
            const row = document.getElementById('user-list').rows[index + 1];
            row.innerHTML = `
                <td>${newUsername}</td>
                <td>${newEmail}</td>
                <td>${newRole}</td>
                <td><button onclick="editarUsuario('${newUsername}')" class="update-button">Editar</button> <button onclick="eliminarUsuario('${newUsername}')" class="delete-button">Eliminar</button></td>
            `;

            updateMetrics(data);
        }
    }

    // Función para editar una colaboración
    function editarColaboracion(projectName) {
        const data = getAdminDataFromLocalStorage();
        const index = data.collaborations.findIndex(collaboration => collaboration.projectName === projectName);
        if (index !== -1) {
            const newProjectName = prompt('Ingrese el nuevo nombre del proyecto:', data.collaborations[index].projectName);
            const newCollaborators = prompt('Ingrese los nuevos colaboradores separados por comas:', data.collaborations[index].collaborators.join(',')).split(',');

            data.collaborations[index].projectName = newProjectName;
            data.collaborations[index].collaborators = newCollaborators;

            saveAdminDataToLocalStorage(data);

            // Actualizar fila en la tabla
            const row = document.getElementById('collaboration-list').rows[index + 1];
            row.innerHTML = `
                <td>${newProjectName}</td>
                <td>${newCollaborators.join(', ')}</td>
                <td><button onclick="editarColaboracion('${newProjectName}')" class="update-button">Editar</button> <button onclick="eliminarColaboracion('${newProjectName}')" class="delete-button">Eliminar</button></td>
            `;

            updateMetrics(data);
        }
    }

    // Función para eliminar un usuario
    function eliminarUsuario(username) {
        const data = getAdminDataFromLocalStorage();
        const index = data.users.findIndex(user => user.username === username);
        if (index !== -1) {
            data.users.splice(index, 1);
            saveAdminDataToLocalStorage(data);

            // Eliminar fila de la tabla
            const table = document.getElementById('user-list');
            table.deleteRow(index + 1);

            updateMetrics(data);
        }
    }

    // Función para eliminar una colaboración
    function eliminarColaboracion(projectName) {
        const data = getAdminDataFromLocalStorage();
        const index = data.collaborations.findIndex(collaboration => collaboration.projectName === projectName);
        if (index !== -1) {
            data.collaborations.splice(index, 1);
            saveAdminDataToLocalStorage(data);

            // Eliminar fila de la tabla
            const table = document.getElementById('collaboration-list');
            table.deleteRow(index + 1);

            updateMetrics(data);
        }
    }

    // Función para añadir un usuario a la tabla
    function addUserToTable(user) {
        const table = document.getElementById('user-list');
        const row = table.insertRow();

        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><button onclick="editarUsuario('${user.username}')" class="update-button">Editar</button> <button onclick="eliminarUsuario('${user.username}')" class="delete-button">Eliminar</button></td>
        `;
    }

    // Función para añadir una colaboración a la tabla
    function addCollaborationToTable(collaboration) {
        const table = document.getElementById('collaboration-list');
        const row = table.insertRow();

        row.innerHTML = `
            <td>${collaboration.projectName}</td>
            <td>${collaboration.collaborators.join(', ')}</td>
            <td><button onclick="editarColaboracion('${collaboration.projectName}')" class="update-button">Editar</button> <button onclick="eliminarColaboracion('${collaboration.projectName}')" class="delete-button">Eliminar</button></td>
        `;
    }

    // Función para actualizar las métricas
    function updateMetrics(data) {
        const totalUsers = data.users.length;
        const totalProjects = data.collaborations.length;
        let activeCollaborations = 0;
        let completedProjects = 0;

        data.collaborations.forEach(collaboration => {
            if (collaboration.collaborators.length > 0) {
                activeCollaborations++;
            } else {
                completedProjects++;
            }
        });

        document.getElementById('total-users').textContent = totalUsers;
        document.getElementById('total-projects').textContent = totalProjects;
        document.getElementById('active-collaborations').textContent = activeCollaborations;
        document.getElementById('completed-projects').textContent = completedProjects;
    }
});
