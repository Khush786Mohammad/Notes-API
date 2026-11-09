package com.khush.notes_api.controller;

import com.khush.notes_api.dto.NotesRequestDTO;
import com.khush.notes_api.dto.NotesResponseDTO;
import com.khush.notes_api.entity.Notes;
import com.khush.notes_api.entity.User;
import com.khush.notes_api.exceptions.NotesNotFoundException;
import com.khush.notes_api.mapper.NotesMapper;
import com.khush.notes_api.service.AuthenticationService;
import com.khush.notes_api.service.NotesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/user")
@Tag(name = "Notes", description = "Manage Authenticated user's notes")
@SecurityRequirement(name = "bearerAuth")
public class NotesController {
    private static final Logger logger = LoggerFactory.getLogger(NotesController.class);
    private static final String ClassName = "NotesController Class";

    private final NotesService service;
    private final AuthenticationService authService;

    @Operation(summary = "Fetch specific notes", description = "Use to fetch particular note's id.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Notes with note's id fetch successfully.",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = NotesResponseDTO.class))}
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized. Authentication is required."),
            @ApiResponse(responseCode = "404", description = "Failed to fetch notes with given note's id.")
    })
    @GetMapping(value = "/notes/{id}")
    public ResponseEntity<NotesResponseDTO> getNote(@PathVariable final long id) throws NotesNotFoundException {
        logger.info("Inside getNote method of {}", ClassName);
        final User user = this.authService.getLoggedInUser();
        final NotesResponseDTO note = this.service.getNotesById(id, user.getId());
        return ResponseEntity.status(HttpStatus.OK).body(note);
    }

    @Operation(summary = "Fetch All Notes", description = "Fetch logged in user all notes.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "All Notes Fetch Successfully."),
            @ApiResponse(responseCode = "401", description = "Unauthorized. Authentication is required."),
            @ApiResponse(responseCode = "404", description = "Something went wrong.")
    })
    @GetMapping(value = "/notes")
    public ResponseEntity<Page<NotesResponseDTO>> fetchAllNotes(
            @RequestParam(name = "pageNo", required = false, defaultValue = "0") final int pageNo,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") final int pageSize,
            @RequestParam(name = "sortField", required = false, defaultValue = "crtDt") final String sortField,
            @RequestParam(name = "order", required = false, defaultValue = "asc") final String order
    ) {
        logger.info("Inside the fetchAllNotes endpoint method of {}", ClassName);
        final Sort sort = order.equals("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending();
        final User user = this.authService.getLoggedInUser();
        final Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        final Page<NotesResponseDTO> notes = this.service.getAllNotes(user.getId(), pageable);
        logger.info("After the service call for getAllNotes {}", ClassName);
        return ResponseEntity.status(HttpStatus.OK).body(notes);
    }

    @Operation(summary = "Search User Notes", description = "Search logged-in user's notes by title or content, with pagination and dynamic sorting.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Notes retrieved successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid pagination or sorting parameters."),
            @ApiResponse(responseCode = "401", description = "Unauthorized. Authentication is required."),
            @ApiResponse(responseCode = "500", description = "Internal server error while searching notes.")
    })
    @GetMapping("/notes/search")
    public ResponseEntity<Page<NotesResponseDTO>> searchNotes(
            @RequestParam(name = "pageNo", required = false, defaultValue = "0") final int pageNo,
            @RequestParam(name = "pageSize", required = false, defaultValue = "8") final int pageSize,
            @RequestParam(name = "sortField", required = false, defaultValue = "crtDt") final String sortField,
            @RequestParam(name = "order", required = false, defaultValue = "asc") final String order,
            @RequestParam(name = "keyword", required = false, defaultValue = "") final String searchKey
    ) {
        logger.info("Inside the searchNotes method of {}", ClassName);
        final User user = this.authService.getLoggedInUser();
        final Sort sort = order.equals("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending();
        final Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        final Page<NotesResponseDTO> notes = this.service.searchNotes(user.getId(), searchKey, pageable);
        logger.info("Outside the searchNotes method of {}", ClassName);
        return ResponseEntity.status(HttpStatus.OK).body(notes);
    }

    @Operation(summary = "Create new Notes", description = "Created new notes for logged in user")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Notes created successfully."),
            @ApiResponse(responseCode = "401", description = "Unauthorized. Authentication is required."),
            @ApiResponse(responseCode = "404", description = "Failed to create notes")
    })
    @PostMapping(value = "/notes", consumes = "application/json")
    public ResponseEntity<NotesResponseDTO> createNewNotes(@Valid @RequestBody final NotesRequestDTO notesDto) {
        logger.info("Inside the createNewNotes endpoint of {}", ClassName);
        final Notes notes = new Notes();
        notes.setTitle(notesDto.getTitle());
        notes.setContent(notesDto.getContent());

        final User user = this.authService.getLoggedInUser();
        notes.setUser(user);
        final NotesResponseDTO newNote = this.service.addNote(notes);
        logger.info("After service method called in {}", ClassName);
        return ResponseEntity.status(HttpStatus.CREATED).body(newNote);
    }

    @Operation(summary = "Update Notes", description = "Used to update/modify user's created notes.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Notes updated successfully."),
            @ApiResponse(responseCode = "401", description = "Unauthorized. Authentication is required."),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    @PutMapping(value = "/notes", consumes = "application/json")
    public ResponseEntity<Map<String, String>> updateNote(@Valid @RequestBody final NotesRequestDTO notes) throws NotesNotFoundException {
        logger.info("Inside the updateNote method of {}", ClassName);
        final User user = this.authService.getLoggedInUser();
        NotesResponseDTO note1 = this.service.getNotesById(notes.getId(), user.getId());
        logger.info("Notes with id: {} is: {}", note1.getId(), note1);
        final Notes updatedNote = NotesMapper.toNotesObject(notes);
        updatedNote.setUser(user);
        this.service.updateNotes(updatedNote);
        logger.info("End of Update method of {}", ClassName);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Notes Updated Successfully"));
    }

    @Operation(summary = "Delete Notes", description = "Delete user's specific notes")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Notes with given id deleted successfully."),
            @ApiResponse(responseCode = "401", description = "Unauthorized. Authentication is required."),
            @ApiResponse(responseCode = "404", description = "Notes doesn't exists")
    })
    @DeleteMapping(value = "/notes/{id}")
    public ResponseEntity<Map<String, String>> deleteNotes(@PathVariable final Long id) throws NotesNotFoundException {
        logger.info("Inside the deleteNotes endpoint method of {}", ClassName);
        final User user = this.authService.getLoggedInUser();
        final NotesResponseDTO notes = this.service.getNotesById(id, user.getId());
        logger.info("Notes data with id: {}", notes);
        this.service.deleteNotesById(id);
        logger.info("After the notes delete method");
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Note deleted successfully."));
    }

    @Autowired
    public NotesController(final NotesService service1, final AuthenticationService authenticationService) {
        this.service = service1;
        this.authService = authenticationService;
    }
}
