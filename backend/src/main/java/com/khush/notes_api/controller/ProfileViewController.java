package com.khush.notes_api.controller;

import com.khush.notes_api.dto.UserResponseDTO;
import com.khush.notes_api.entity.User;
import com.khush.notes_api.mapper.UserMapper;
import com.khush.notes_api.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User Profile", description = "Fetched the user details")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/profile")

public class ProfileViewController {

    private final AuthenticationService authenticationService;

    @Autowired
    public ProfileViewController(@Qualifier("userService") final AuthenticationService service) {
        this.authenticationService = service;
    }

    @Operation(summary = "Fetch User Profile", description = "Fetches the user profile details")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User details fetch successfully.",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ProfileViewController.class))}
            ),
            @ApiResponse(responseCode = "404", description = "Failed to fetch user details.")
    })
    @PostMapping(value = "/me")
    public ResponseEntity<UserResponseDTO> userProfile() {
        User user = this.authenticationService.getLoggedInUser();
        UserResponseDTO dto = UserMapper.userResponseDTO(user);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }
}
