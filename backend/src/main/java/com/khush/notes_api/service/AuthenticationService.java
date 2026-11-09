package com.khush.notes_api.service;

import com.khush.notes_api.entity.User;
import com.khush.notes_api.exceptions.CommonException;
import com.khush.notes_api.repository.UserRepository;
import com.khush.notes_api.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLIntegrityConstraintViolationException;

@Service("userService")
public class AuthenticationService {
    private final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final AuthenticationManager authenticationManager;
    private final UserRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Transactional
    public User registerUser(final User user) throws SQLIntegrityConstraintViolationException {
        user.setPassword(encoder.encode(user.getPassword()));
        return this.repository.save(user);
    }

    public Authentication isAuthenticatedUser(final User user) throws CommonException {
        try {
            return authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        } catch (final BadCredentialsException | UsernameNotFoundException exception) {
            logger.error("Exception occured inside the isAuthenticatedUser method of AuthenticationService class::", exception);
            throw new CommonException(exception.getMessage() + ". Invalid Username or password");
        } catch (final AuthenticationException e) {
            //disabled , locked or expired account handling
            throw new CommonException(e.getMessage());
        }
    }

    public User getLoggedInUser() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        final UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        assert userPrincipal != null;
        User user = new User();
        user.setId(userPrincipal.getPkId());
        user.setUsername(userPrincipal.getUsername());
        user.setEmail(userPrincipal.getEmailAddress());
        return user;
    }

    @Autowired
    public AuthenticationService(final UserRepository repo, final AuthenticationManager authenticationManager) {
        this.repository = repo;
        this.authenticationManager = authenticationManager;
    }
}
