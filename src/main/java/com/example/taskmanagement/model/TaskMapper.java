package com.example.taskmanagement.model;

import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(target = "userId", expression = "java(task.getUser() != null ? task.getUser().getId() : null)")
    TaskDTO toDto(Task task);

    Task toEntity(TaskDTO taskDTO);
} 