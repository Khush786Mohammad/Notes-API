package com.khush.notes_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Notes format send as a response")
public class NotesResponseDTO {
    @Schema(description = "Unique identifier for the notes", example = "1002", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    @Schema(description = "Title of the notes", accessMode = Schema.AccessMode.READ_ONLY)
    private String title;
    @Schema(description = "Content of the note", accessMode = Schema.AccessMode.READ_ONLY)
    private String content;
    @Schema(description = "Created date with timestamp of the note", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime crtDt;
    @Schema(description = "Last updated timestamp of the note", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime lstUpdtDt;
}