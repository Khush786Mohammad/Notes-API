package com.khush.notes_api.advice;

import com.khush.notes_api.exceptions.CommonException;
import com.khush.notes_api.exceptions.NotesNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Order(1)
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final String ClassName = "GlobalExceptionHandler Class";

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidException(final MethodArgumentNotValidException exception) {
        logger.info("Inside the handleValidException of {}", ClassName);
        final Map<String, String> message = new HashMap<>();
        exception
                .getBindingResult()
                .getFieldErrors()
                .forEach(error -> message.put("error", error.getDefaultMessage()));
        logger.error("Method argument are not valid");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
    }

    @ExceptionHandler(NotesNotFoundException.class)
    public ResponseEntity<Map<String, String>> notesNotFoundException(final NotesNotFoundException exception) {
        logger.info("Inside the notesNotFoundException of {}", ClassName);
        logger.error("Failed to find the notes with requested id");
        final Map<String, String> handler = new HashMap<>();
        handler.put("error", exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(handler);
    }

    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> duplicateUsername(final SQLIntegrityConstraintViolationException exception) {
        logger.info("Inside the SQLIntegrityConstraintViolationException of {}", ClassName);
        logger.error("Username already exists.");
        final Map<String, String> handler = new HashMap<>();
        handler.put("error", "User Credentials already exists.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(handler);
    }

    @ExceptionHandler(CommonException.class)
    public ResponseEntity<String> handleCommonException(final CommonException exception) {
        logger.info("Inside the CommonException method of {}", ClassName);
        logger.error("Exception is: ", exception);
        final String message = exception != null ? exception.getMessage() : "Something went wrong. Please try again later.";
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
    }
}
