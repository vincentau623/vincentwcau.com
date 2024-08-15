"use client";
import { TodoItem } from '@/models/todo';
import { Input, Button, Checkbox, Spacer } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';

const fetchTodos = async () => {
  const res = await fetch("/api/todos/list");
  return await res.json();
};

const createTodo = async (title: string) => {
  const res = await fetch("/api/todos/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return await res.json();
};

const updateTodo = async (id: string, updatedTodo: TodoItem) => {
  await fetch(`/api/todos/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTodo),
  });
};

const deleteTodo = async (id: string) => {
  await fetch(`/api/todos/delete/${id}`, { method: "DELETE" });
};

export default function Home() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    (async () => {
      const todos = await fetchTodos();
      setTodos(todos);
    })();
  }, []);

  const handleCreate = async () => {
    if (inputValue.trim()) {
      const newTodo = await createTodo(inputValue);
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  const handleUpdate = async (id: string, completed: boolean) => {
    const updatedTodo = todos.find((todo) => todo.id === id);
    if (!updatedTodo) {
      return;
    }
    updatedTodo.completed = completed;
    await updateTodo(id, updatedTodo);
    setTodos([...todos]);
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <div>
        Azure Cosmos DB Starter – Todo App
      </div>
      <div>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task"
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <Button onPress={handleCreate}>
          Add Todo
        </Button>
        {todos.map((todo) => (
          <div key={todo.id}>
            <Checkbox
              isSelected={todo.completed}
              onChange={(e) => handleUpdate(todo.id, e.target.checked)}
            >
              {todo.title}
            </Checkbox>
            <Spacer />
            <Button
              aria-label="Delete todo"
              onPress={() => handleDelete(todo.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}