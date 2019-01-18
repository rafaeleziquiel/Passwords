class Tarefa {
    constructor(titulo, desc, dataExec) {
        //Create or Update 
        var operation = "";
        //Indice do item selecionado da lista 
        var selected_index = "";
        //Recupera os dados armazenados
        var tbTasks = "";
        var titulo;
        var desc;
        var dataExec;
        this.titulo = titulo;
        this.desc = desc;
        this.dataExec = dataExec;
    }

    /**
     * Inicializa 
     * */
    init() {
        this.operation = "Create";
        this.selected_index = -1;
        this.tbTasks = localStorage.getItem("tbTasks");
        //Converte string em objeto 
        this.tbTasks = JSON.parse(this.tbTasks);
        //Se não há dados, iniciaiza um array vazio
        if (this.tbTasks == null) {
            this.tbTasks = [];
        }
        this.read();
    }

    /**
     * Procura pela tarefa
     * */
    search() {
        this.read(document.getElementById("txtPesquisa").value);
    }

    /**
     * Salva a tarefa
     * */
    save() {
        localStorage.setItem("tbTasks", JSON.stringify(this.tbTasks));
        return true;
    }

    /**
     * Stub para criar as tarefas
     * */
    stubCreate() {
        var objTask = JSON.stringify({
            titulo: this.titulo,
            desc: this.desc,
            dataExec: this.dataExec
        });
        this.tbTasks = localStorage.getItem("tbTasks");
        //Converte string em objeto 
        this.tbTasks = JSON.parse(this.tbTasks);
        //Se não há dados, iniciaiza um array vazio
        if (this.tbTasks == null) {
            this.tbTasks = [];
        }
        this.tbTasks.push(objTask);
        this.save();
        return true;
    }

    /**
     * Cria a tarefa
     * */
    create(Obj) {
        var objTask = JSON.stringify({
            titulo: document.getElementById("txtTitulo").value,
            desc: document.getElementById("txtDesc").value,
            dataExec: toDBDate(document.getElementById("txtDataExec").value)
        });
        var valid = validateDate(document.getElementById("txtDataExec").value);
        if (valid != false) {
            this.tbTasks.push(objTask);
            this.save();
            this.read();
            cleanRequired();
            this.openView(false);
            return true;
        }
    }

    /**
     * Lê as tarefas e cria a lista
     * */
    read(filter) {
        this.cleanForm();
        var tblLista = document.getElementById("tblLista");
        tblLista.innerHTML = "";
        tblLista.innerHTML = "<thead>" + "	<tr>" + "	<th></th>" + "	<th>Título</th>" + "	<th>Descrição</th>" + "	<th>Data de execução</th>" + "	</tr>" + "</thead>" + "<tbody>" + "</tbody>";
        var content = "";
        var Tasks = "";
        if (filter) {
            Tasks = this.filter(filter);
        } else {
            Tasks = this.tbTasks;
            Tasks = this.sortByDate(Tasks);
        }
        for (var i in Tasks) {
            var task = JSON.parse(Tasks[i]);
            content += "<tr>" + "	<td> <div id='delete" + task.selected_index + "' class='btnDelete' onclick='tasks.eventDeleteTask(this)'></div>";

            content += "<div id='update" + task.selected_index + "' class='btnEdit' data-toggle='modal' data-target='#myModal'  onclick='tasks.eventUpdateTask(this)'></div>";

            content += "</td>" + "	<td>" + task.titulo + "</td>" + "	<td>" + task.desc + "</td>" + "	<td>" + toDisplayDate(task.dataExec) + "</td>" + "</tr>";
        }
        var body = tblLista.childNodes[1];
        body.innerHTML = content;
    }

    filter(filter) {
        var filtered = [];
        filter = filter.toLowerCase();
        for (var i in this.tbTasks) {
            var task = JSON.parse(this.tbTasks[i]);
            var titulo = task.titulo.toLowerCase();
            var desc = task.desc.toLowerCase();
            if (titulo.search(filter) != -1 || desc.search(filter) != -1) {
                task.selected_index = i;
                filtered.push(JSON.stringify(task));
            }
        }
        //console.log(filtered);
        return filtered;
    }

    sortByDate(TasksJson) {
        var Tasks = [];
        var Sorted = [];
        var Result = [];
        for (var i in TasksJson) {
            var Task = JSON.parse(TasksJson[i]);
            Task.selected_index = i;
            Tasks.push(Task);
        }
        Tasks.sort(function(a, b) {
            return new Date(b.dataExec) - new Date(a.dataExec);
        });
        for (var i in Tasks) {
            Result.push(JSON.stringify(Tasks[i]));
        }
        return Result;
    }
    sortTasks(Tasks) {
            Tasks.sort(function(a, b) {
                return new Date(b.dataExec) - new Date(a.dataExec);
            });
            return Tasks;
        }
        /**
         * Atualiza a tarefa
         * */
    update() {
        this.tbTasks[this.selected_index] = JSON.stringify({
            titulo: document.getElementById("txtTitulo").value,
            desc: document.getElementById("txtDesc").value,
            dataExec: toDBDate(document.getElementById("txtDataExec").value)
        });
        this.save();
        //this.operation = "Update";
        this.read();
        cleanRequired();
        this.openView(false);
        return true;
    }

    /**
     * Deleta a tarefa
     * */
    delete() {
        var agree = confirm("Deseja realmente deletar esta tarefa?");
        if (!agree) {
            return false;
        }
        this.tbTasks.splice(this.selected_index, 1);
        this.save();
    }

    cleanForm() {
        document.getElementById("frmCadastro").reset();
        this.operation = "Create";
    }

    /**
     * Evento Submit do formulário de cadastro
     * */
    eventSubmitTask(form) {
        var valid = validateRequired(form);
        if (!valid) {
            return valid;
        }
        if (this.operation == "Create") return this.create();
        else return this.update();
    };

    /**
     * Evento Update da lista de tarefas
     * */
    eventUpdateTask(record) {
        this.openView(true);
        this.operation = "Update";
        this.selected_index = parseInt(record.id.replace("update", ""));
        var task = JSON.parse(this.tbTasks[this.selected_index]);
        document.getElementById("txtTitulo").value = task.titulo;
        console.log(document.getElementById("txtTitulo"));
        document.getElementById("txtDesc").value = task.desc;
        document.getElementById("txtDataExec").value = toDisplayDate(task.dataExec);
        document.getElementById("txtDataExec").readOnly = true;
        document.getElementById("txtDataExec").disabled = true;
        document.getElementById("txtTitulo").focus();
    };
    /**
     * Evento Delete da lista de tarefas
     * */
    eventDeleteTask(record) {
        this.selected_index = parseInt(record.id.replace("delete", ""));
        this.delete();
        this.read();
    };
    cancelTask(form) {
        this.openView(false);
        cleanRequired();
        this.operation = "Create";
    }
    newTask(form) {
        this.openView(true);
        cleanRequired();
        document.getElementById("txtTitulo").focus();
        this.operation = "Create";
    }
    openView(open) {
        if (open == true) {
            //document.getElementById("frmCadastro").style.display = 'block';
        } else {
            document.getElementById("txtDataExec").readOnly = false;
            document.getElementById("txtDataExec").disabled = false;
            jQuery('#myModal').modal('toggle');
            // document.getElementById("frmCadastro").style.display = 'none';
        }
    }
}
window.onload = function(e) {
    tasks = new Tarefa();
    tasks.init();
}