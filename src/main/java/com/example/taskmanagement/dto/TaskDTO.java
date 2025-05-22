package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskDTO {
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Status is required")
    private TaskStatus status;
    
    private LocalDate dueDate;
    
    private Long userId;
    
    private String userName;
} 