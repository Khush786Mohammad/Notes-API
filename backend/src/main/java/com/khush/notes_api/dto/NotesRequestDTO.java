package com.khush.notes_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Represent the Notes request format.")
public class NotesRequestDTO {
    @Schema(description = "Unique identifier of the notes", example = "1001", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "Title cannot be empty.")
    @Size(min = 5, message = "Title must contains atleast 5 characters.")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Schema(description = "Title of the note.", example = "Implement Swagger API Documentation")
    private String title;

    @NotBlank(message="Content cannot be empty.")
    @Size(min = 20, message="Content must contains atleast 20 characters.")
    @Size(max = 10000, message = "Content must not exceed 10000 characters")
    @Schema(description = "Content of the requested notes")
    private String content;
}
