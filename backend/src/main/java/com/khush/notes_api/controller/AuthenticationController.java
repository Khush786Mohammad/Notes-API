package com.khush.notes_api.controller;

import com.khush.notes_api.dto.UserResponseDTO;
import com.khush.notes_api.entity.User;
import com.khush.notes_api.exceptions.CommonException;
import com.khush.notes_api.mapper.UserMapper;
import com.khush.notes_api.security.UserPrincipal;
import com.khush.notes_api.service.AuthenticationService;
import com.khush.notes_api.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "User Registration and Login")
public class AuthenticationController {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
    private static final String ClassName = "AuthenticationController Class";

    @Autowired()
    @Qualifier("userService")
    private AuthenticationService authenticationService;

    @Autowired
    @Qualifier("jwtService")
    private JwtService jwtService;

    @Operation(summary = "User Registration", description = "To register a user")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User Register Successfully", content = {
                    @Content(mediaType = "application/json", schema =
                    @Schema(implementation = User.class))
            }),
            @ApiResponse(responseCode = "400", description = "Bad Request, invalid/bad data is passed"),
            @ApiResponse()
    })
    @PostMapping(value = "/register", consumes = "application/json")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody final User user) throws SQLIntegrityConstraintViolationException {
        logger.info("Inside the registration method of {}", ClassName);
        final User newUser = this.authenticationService.registerUser(user);
        UserResponseDTO crtUser = UserMapper.userResponseDTO(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(crtUser);
    }

    @Operation(summary = "User Authentication",
            description = "Used to Authenticate User and returns a " +
                    "Authentication Token when user is authenticated successfully.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User Authenticated successfully."),
            @ApiResponse(responseCode = "400", description = "Bad Credentials")
    })
    @PostMapping(value = "/login", consumes = "application/json")
    public ResponseEntity<Object> login(@RequestBody final User user) throws CommonException {
        logger.info("Inside the login method of {}", ClassName);
        if (user.getUsername() == null || user.getUsername().trim().equalsIgnoreCase(""))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username cannot be empty");
        final Authentication authentication = this.authenticationService.isAuthenticatedUser(user);

        if (authentication.isAuthenticated()) {
            logger.info("Inside login method of {}, user is authenticated successfully", ClassName);
            final UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            assert userPrincipal != null;
            final String token = jwtService.generateToken(userPrincipal);
            final Map<String, String> resMap = new HashMap<>();
            resMap.put("token", token);
            return ResponseEntity.status(HttpStatus.OK).body(resMap);
        }
        logger.info("End of login method");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Credentials");
    }
}
