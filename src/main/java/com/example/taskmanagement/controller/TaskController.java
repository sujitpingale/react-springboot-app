package com.example.taskmanagement.controller;

import com.example.taskmanagement.model.Task;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.model.TaskStatus;
import com.example.taskmanagement.service.TaskService;
import com.example.taskmanagement.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.context.annotation.Bean;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import com.example.taskmanagement.exception.EntityNotFoundException;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {
    private final TaskService taskService;
    private final AuthService authService;

    @GetMapping
    public List<Task> getAllTasks(@RequestParam Long userId) {
        User user = authService.getUserById(userId);
        return taskService.getTasksByUser(user);
    }

    @GetMapping("/user/{userId}")
    public List<Task> getTasksByUser(@PathVariable Long userId) {
        User user = authService.getUserById(userId);
        return taskService.getTasksByUser(user);
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @PostMapping
    public ResponseEntity<?> createTask(@Valid @RequestBody Map<String, Object> taskRequest) {
        try {
            // Validate required fields
            if (taskRequest.get("title") == null || taskRequest.get("status") == null || taskRequest.get("userId") == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields: title, status, and userId are required"));
            }

            Task task = new Task();
            task.setTitle((String) taskRequest.get("title"));
            task.setDescription((String) taskRequest.get("description"));
            
            try {
                task.setStatus(TaskStatus.valueOf((String) taskRequest.get("status")));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid status value. Must be one of: TODO, IN_PROGRESS, COMPLETED"));
            }

            if (taskRequest.get("dueDate") != null) {
                try {
                    task.setDueDate(LocalDate.parse((String) taskRequest.get("dueDate")));
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Invalid due date format. Use YYYY-MM-DD"));
                }
            }
            
            try {
                Long userId = Long.valueOf(taskRequest.get("userId").toString());
                User user = authService.getUserById(userId);
                Task createdTask = taskService.createTask(task, user);
                return ResponseEntity.ok(createdTask);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid userId format"));
            } catch (EntityNotFoundException e) {
                return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error creating task: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @Valid @RequestBody Task taskDetails) {
        return taskService.updateTask(id, taskDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ISO_DATE_TIME));
        mapper.registerModule(javaTimeModule);
        mapper.registerModule(new Hibernate6Module());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
        mapper.disable(SerializationFeature.WRITE_SELF_REFERENCES_AS_NULL);
        return mapper;
    }
} 