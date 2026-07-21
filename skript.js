let memory = {};

function remember(key, value) {
    memory[key] = value;
}

function recall(key) {
    return memory[key];
}