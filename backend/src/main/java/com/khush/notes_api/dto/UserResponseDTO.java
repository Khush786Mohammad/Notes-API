package com.khush.notes_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Registered user format send as a response")
public class UserResponseDTO {
    @Schema(description = "Unique identifier for the registered user", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    @Schema(description = "Username of the registered user")
    private String username;
    @Schema(description = "Email address of the registered user")
    private String email;
}
